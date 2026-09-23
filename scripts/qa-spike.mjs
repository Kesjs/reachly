#!/usr/bin/env node
/**
 * scripts/qa-spike.mjs
 *
 * Script JETABLE — hors architecture finale.
 * Objectif (voir reachly-spec.md §6) : mesurer le pipeline sur des sites réels
 * AVANT de brancher les routes API / l'orchestrateur complet.
 *
 * Pipeline minimal :
 *   discovery (homepage + sitemap.xml + robots.txt + liens internes)
 *   → crawl 10-15 pages max
 *   → 1 passage Playwright par page (navigation, console, network 4xx/5xx,
 *     screenshot mobile 375x812 + desktop 1440x900)
 *   → détection de formulaires basique (présence/champs, PAS de soumission)
 *
 * Sortie : rapport JSON + résumé console (durée, pages testées, nb requêtes,
 * nb screenshots) → sert à fixer MAX_PAGES / MAX_SCREENSHOTS / MAX_SCAN_TIME
 * à partir de vraies mesures plutôt qu'à l'instinct.
 *
 * Usage :
 *   node scripts/qa-spike.mjs https://exemple.com
 *   node scripts/qa-spike.mjs https://exemple.com --max-pages=15
 */

import { chromium } from 'playwright'
import * as cheerio from 'cheerio'
import { mkdir, writeFile } from 'fs/promises'
import path from 'path'

// ---------- Config ----------
const args = process.argv.slice(2)
const targetUrl = args.find((a) => !a.startsWith('--'))
const getFlag = (name, fallback) => {
  const found = args.find((a) => a.startsWith(`--${name}=`))
  return found ? found.split('=')[1] : fallback
}

const MAX_PAGES = parseInt(getFlag('max-pages', '15'), 10)
const MAX_CRAWL_DEPTH = parseInt(getFlag('max-depth', '4'), 10)
const NAV_TIMEOUT_MS = 15_000
const OUTPUT_DIR = path.resolve(process.cwd(), '.qa-spike-output')

const PRIVATE_IP_PATTERNS = [
  /^localhost$/i,
  /^127\./,
  /^10\./,
  /^172\.(1[6-9]|2\d|3[0-1])\./,
  /^192\.168\./,
  /^169\.254\./,
  /^0\.0\.0\.0$/,
]

if (!targetUrl) {
  console.error('Usage: node scripts/qa-spike.mjs <url> [--max-pages=15] [--max-depth=4]')
  process.exit(1)
}

function isBlockedHost(hostname) {
  return PRIVATE_IP_PATTERNS.some((re) => re.test(hostname))
}

function normalizeUrl(rawUrl, base) {
  try {
    const u = new URL(rawUrl, base)
    u.hash = ''
    u.hostname = u.hostname.toLowerCase()
    if (u.pathname !== '/' && u.pathname.endsWith('/')) {
      u.pathname = u.pathname.slice(0, -1)
    }
    return u.toString()
  } catch {
    return null
  }
}

// ---------- Discovery ----------
async function discoverUrls(startUrl) {
  const start = new URL(startUrl)
  if (isBlockedHost(start.hostname)) {
    throw new Error(`Host bloqué (IP privée/interne) : ${start.hostname}`)
  }

  const discovered = new Set([normalizeUrl(startUrl, startUrl)])

  // sitemap.xml
  try {
    const sitemapUrl = new URL('/sitemap.xml', start.origin).toString()
    const res = await fetch(sitemapUrl, { signal: AbortSignal.timeout(8000) })
    if (res.ok) {
      const xml = await res.text()
      const locs = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1])
      for (const loc of locs) {
        const norm = normalizeUrl(loc, start.origin)
        if (norm) discovered.add(norm)
      }
      console.log(`  sitemap.xml : ${locs.length} URLs trouvées`)
    }
  } catch {
    console.log('  sitemap.xml : absent ou inaccessible')
  }

  // robots.txt
  try {
    const robotsUrl = new URL('/robots.txt', start.origin).toString()
    const res = await fetch(robotsUrl, { signal: AbortSignal.timeout(5000) })
    console.log(`  robots.txt : ${res.ok ? 'trouvé' : 'absent'}`)
  } catch {
    console.log('  robots.txt : inaccessible')
  }

  // liens internes de la homepage
  try {
    const res = await fetch(startUrl, { signal: AbortSignal.timeout(10000) })
    const html = await res.text()
    const $ = cheerio.load(html)
    $('a[href]').each((_, el) => {
      const href = $(el).attr('href')
      if (!href || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) return
      const norm = normalizeUrl(href, start.origin)
      if (norm && new URL(norm).origin === start.origin) discovered.add(norm)
    })
  } catch (err) {
    console.log(`  homepage fetch échoué : ${err.message}`)
  }

  return [...discovered].slice(0, MAX_PAGES)
}

// ---------- Playwright pass ----------
async function testPage(browser, url) {
  const result = {
    url,
    httpStatus: null,
    consoleErrors: [],
    jsExceptions: [],
    networkErrors: [],
    forms: [],
    screenshots: {},
    timedOut: false,
    blocked: false,
  }

  const context = await browser.newContext({
    viewport: { width: 375, height: 812 },
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  })
  const page = await context.newPage()

  page.on('console', (msg) => {
    if (msg.type() === 'error') result.consoleErrors.push(msg.text())
  })
  page.on('pageerror', (err) => {
    result.jsExceptions.push(err.message)
  })
  page.on('response', (res) => {
    const status = res.status()
    if (status >= 400) {
      result.networkErrors.push({ url: res.url(), status, resourceType: res.request().resourceType() })
    }
  })

  try {
    const res = await page.goto(url, { timeout: NAV_TIMEOUT_MS, waitUntil: 'domcontentloaded' })
    result.httpStatus = res ? res.status() : null
    if (result.httpStatus === 403 || result.httpStatus === 503) {
      const body = (await page.content()).toLowerCase()
      if (body.includes('cloudflare') || body.includes('captcha') || body.includes('access denied')) {
        result.blocked = true
      }
    }

    await page.waitForTimeout(500)

    await mkdir(OUTPUT_DIR, { recursive: true })
    const slug = url.replace(/https?:\/\//, '').replace(/[^a-z0-9]/gi, '_').slice(0, 80)
    const mobilePath = path.join(OUTPUT_DIR, `${slug}__mobile.png`)
    await page.screenshot({ path: mobilePath })
    result.screenshots.mobile = mobilePath

    const forms = await page.$$eval('form', (formEls) =>
      formEls.map((f) => ({
        action: f.getAttribute('action') || null,
        method: f.getAttribute('method') || 'get',
        fieldCount: f.querySelectorAll('input, textarea, select').length,
        fieldTypes: [...f.querySelectorAll('input')].map((i) => i.type || 'text'),
      }))
    )
    result.forms = forms

    await page.setViewportSize({ width: 1440, height: 900 })
    await page.waitForTimeout(300)
    const desktopPath = path.join(OUTPUT_DIR, `${slug}__desktop.png`)
    await page.screenshot({ path: desktopPath })
    result.screenshots.desktop = desktopPath
  } catch (err) {
    if (err.name === 'TimeoutError') {
      result.timedOut = true
    } else {
      result.jsExceptions.push(`[navigation] ${err.message}`)
    }
  } finally {
    await context.close()
  }

  return result
}

// ---------- Main ----------
async function main() {
  const startedAt = Date.now()
  console.log(`\n🔎 Discovery sur ${targetUrl}`)
  const urls = await discoverUrls(targetUrl)
  console.log(`  → ${urls.length} URLs retenues (max ${MAX_PAGES}, profondeur max ${MAX_CRAWL_DEPTH} non appliquée dans ce spike)\n`)

  const browser = await chromium.launch({ headless: true })
  const pageResults = []
  let screenshotCount = 0
  let networkRequestErrorCount = 0

  for (const [i, url] of urls.entries()) {
    process.stdout.write(`  [${i + 1}/${urls.length}] ${url} ... `)
    const result = await testPage(browser, url)
    pageResults.push(result)
    screenshotCount += Object.keys(result.screenshots).length
    networkRequestErrorCount += result.networkErrors.length
    console.log(
      result.timedOut
        ? 'TIMEOUT'
        : result.blocked
        ? 'BLOCKED'
        : `status=${result.httpStatus} console_errors=${result.consoleErrors.length} network_errors=${result.networkErrors.length} forms=${result.forms.length}`
    )
  }

  await browser.close()

  const durationMs = Date.now() - startedAt
  const summary = {
    targetUrl,
    generatedAt: new Date().toISOString(),
    durationMs,
    durationHuman: `${(durationMs / 1000).toFixed(1)}s`,
    pagesDiscovered: urls.length,
    pagesTested: pageResults.length,
    screenshotsTaken: screenshotCount,
    totalNetworkErrors: networkRequestErrorCount,
    blockedPages: pageResults.filter((p) => p.blocked).length,
    timedOutPages: pageResults.filter((p) => p.timedOut).length,
    totalFormsFound: pageResults.reduce((acc, p) => acc + p.forms.length, 0),
    totalConsoleErrors: pageResults.reduce((acc, p) => acc + p.consoleErrors.length, 0),
    pages: pageResults,
  }

  await mkdir(OUTPUT_DIR, { recursive: true })
  const reportPath = path.join(OUTPUT_DIR, 'report.json')
  await writeFile(reportPath, JSON.stringify(summary, null, 2))

  console.log('\n📊 Résumé (à utiliser pour fixer MAX_PAGES / MAX_SCREENSHOTS / MAX_SCAN_TIME) :')
  console.log(`  Durée totale        : ${summary.durationHuman}`)
  console.log(`  Pages testées       : ${summary.pagesTested}/${summary.pagesDiscovered}`)
  console.log(`  Screenshots pris    : ${summary.screenshotsTaken}`)
  console.log(`  Erreurs réseau 4xx/5xx : ${summary.totalNetworkErrors}`)
  console.log(`  Pages bloquées (bot/CDN) : ${summary.blockedPages}`)
  console.log(`  Pages en timeout    : ${summary.timedOutPages}`)
  console.log(`  Formulaires trouvés : ${summary.totalFormsFound}`)
  console.log(`  Erreurs console JS  : ${summary.totalConsoleErrors}`)
  console.log(`\n  Rapport complet : ${reportPath}\n`)
  console.log('  ⚠️  Étape suivante (spec §6.3) : relire chaque erreur/issue ci-dessus à la main')
  console.log('     et noter le taux de faux positifs avant de coder le moindre check "officiel".\n')
}

main().catch((err) => {
  console.error('Erreur fatale du spike :', err)
  process.exit(1)
})
