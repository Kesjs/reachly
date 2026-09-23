import { chromium, Browser, Page, BrowserContext } from 'playwright';
import { CheckResult, CheckStatus, CheckCategory, Evidence, EvidenceType, ViewportConfig, SENSITIVE_ACTIONS } from '../types';
import { QAConfigManager } from '../config';

export class BrowserEngine {
  private browser: Browser | null = null;
  private contexts: Map<string, BrowserContext> = new Map();
  private config: QAConfigManager;

  constructor(config: QAConfigManager) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    this.browser = await chromium.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });
  }

  async cleanup(): Promise<void> {
    for (const context of this.contexts.values()) {
      await context.close();
    }
    this.contexts.clear();

    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  async createPage(viewport?: ViewportConfig): Promise<Page> {
    if (!this.browser) {
      throw new Error('Browser engine not initialized');
    }

    const context = await this.browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Reachly-QA/1.0',
      viewport: viewport ? { width: viewport.width, height: viewport.height } : { width: 1440, height: 900 }
    });

    const page = await context.newPage();
    return page;
  }

  async testNavigation(url: string): Promise<CheckResult[]> {
    const results: CheckResult[] = [];
    const page = await this.createPage();

    try {
      // Capturer les erreurs console
      const consoleErrors: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });

      // Naviguer vers la page
      const response = await page.goto(url, {
        waitUntil: 'networkidle',
        timeout: this.config.getMaxNavigationTime() * 1000
      });

      if (!response) {
        results.push(this.createCheckResult(
          'navigation',
          'page_load',
          'failed',
          'critical',
          'Échec du chargement de la page',
          'Aucune réponse du serveur',
          [{ type: 'url', payload: { url } }]
        ));
        return results;
      }

      const status = response.status();

      // Vérifier le statut HTTP
      if (status >= 400) {
        results.push(this.createCheckResult(
          'pages',
          'http_status',
          'failed',
          status >= 500 ? 'critical' : 'major',
          `Erreur HTTP ${status}`,
          `La page a retourné un code d'erreur ${status}`,
          [{ type: 'network', payload: { url, status } }]
        ));
      } else {
        results.push(this.createCheckResult(
          'pages',
          'http_status',
          'passed',
          null,
          'Page accessible',
          `La page a répondu avec le statut ${status}`,
          [{ type: 'network', payload: { url, status } }]
        ));
      }

      // Vérifier les erreurs console
      if (consoleErrors.length > 0) {
        results.push(this.createCheckResult(
          'browser',
          'console_errors',
          'failed',
          'major',
          `${consoleErrors.length} erreur(s) console détectée(s)`,
          consoleErrors.join('\n'),
          [{ type: 'console', payload: { errors: consoleErrors } }]
        ));
      } else {
        results.push(this.createCheckResult(
          'browser',
          'console_errors',
          'passed',
          null,
          'Aucune erreur console',
          'Aucune erreur JavaScript détectée',
          []
        ));
      }

      // Vérifier le titre
      const title = await page.title();
      if (!title || title.trim().length === 0) {
        results.push(this.createCheckResult(
          'seo',
          'page_title',
          'warning',
          'warning',
          'Titre de page manquant',
          'La page n\'a pas de titre ou le titre est vide',
          [{ type: 'url', payload: { url, title: '' } }]
        ));
      } else {
        results.push(this.createCheckResult(
          'seo',
          'page_title',
          'passed',
          null,
          'Titre de page présent',
          `Titre: "${title}"`,
          [{ type: 'url', payload: { url, title } }]
        ));
      }

    } catch (error) {
      results.push(this.createCheckResult(
        'navigation',
        'page_load',
        'failed',
        'critical',
        'Erreur de navigation',
        error instanceof Error ? error.message : String(error),
        [{ type: 'url', payload: { url } }]
      ));
    } finally {
      await page.close();
    }

    return results;
  }

  async testForms(url: string): Promise<CheckResult[]> {
    const results: CheckResult[] = [];
    const page = await this.createPage();

    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: this.config.getMaxPageTime() * 1000 });

      // Trouver les formulaires
      const forms = await page.$$eval('form', forms => {
        return forms.map((form, index) => {
          const action = (form as HTMLFormElement).action || window.location.href;
          const method = (form as HTMLFormElement).method || 'POST';
          const fieldCount = form.querySelectorAll('input, select, textarea').length;
          return { index, action, method, fieldCount };
        });
      });

      if (forms.length === 0) {
        results.push(this.createCheckResult(
          'forms',
          'forms_detected',
          'passed',
          null,
          'Aucun formulaire détecté',
          'La page ne contient pas de formulaire',
          [{ type: 'url', payload: { url } }]
        ));
        return results;
      }

      results.push(this.createCheckResult(
        'forms',
        'forms_detected',
        'passed',
        null,
        `${forms.length} formulaire(s) détecté(s)`,
        `La page contient ${forms.length} formulaire(s)`,
        [{ type: 'url', payload: { url, forms } }]
      ));

      // Tester chaque formulaire
      for (const form of forms) {
        // Vérifier si le formulaire a des champs
        if (form.fieldCount === 0) {
          results.push(this.createCheckResult(
            'forms',
            `form_${form.index}_fields`,
            'warning',
            'warning',
            'Formulaire sans champs',
            `Le formulaire #${form.index} n'a aucun champ`,
            [{ type: 'action', payload: { form } }]
          ));
        } else {
          results.push(this.createCheckResult(
            'forms',
            `form_${form.index}_fields`,
            'passed',
            null,
            `Formulaire avec ${form.fieldCount} champ(s)`,
            `Le formulaire #${form.index} a ${form.fieldCount} champ(s)`,
            [{ type: 'action', payload: { form } }]
          ));
        }

        // Vérifier si l'action est valide
        try {
          new URL(form.action);
          results.push(this.createCheckResult(
            'forms',
            `form_${form.index}_action`,
            'passed',
            null,
            'Action de formulaire valide',
            `Le formulaire #${form.index} a une action valide: ${form.action}`,
            [{ type: 'action', payload: { form } }]
          ));
        } catch {
          results.push(this.createCheckResult(
            'forms',
            `form_${form.index}_action`,
            'warning',
            'warning',
            'Action de formulaire invalide',
            `Le formulaire #${form.index} a une action invalide: ${form.action}`,
            [{ type: 'action', payload: { form } }]
          ));
        }
      }

    } catch (error) {
      results.push(this.createCheckResult(
        'forms',
        'forms_test',
        'failed',
        'major',
        'Erreur lors du test des formulaires',
        error instanceof Error ? error.message : String(error),
        [{ type: 'url', payload: { url } }]
      ));
    } finally {
      await page.close();
    }

    return results;
  }

  async testCTA(url: string): Promise<CheckResult[]> {
    const results: CheckResult[] = [];
    const page = await this.createPage();

    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: this.config.getMaxPageTime() * 1000 });

      // Trouver les CTA potentiels
      const ctaSelectors = [
        'a[href*="contact"]',
        'a[href*="get-started"]',
        'a[href*="signup"]',
        'a[href*="register"]',
        'button[type="submit"]',
        '.cta',
        '.call-to-action'
      ];

      let ctaCount = 0;
      const ctaDetails: any[] = [];

      for (const selector of ctaSelectors) {
        try {
          const elements = await page.$$(selector);
          for (const element of elements) {
            const text = await element.textContent();
            const href = await element.getAttribute('href');
            
            if (text || href) {
              ctaCount++;
              ctaDetails.push({ text, href, selector });
            }
          }
        } catch {
          continue;
        }
      }

      if (ctaCount === 0) {
        results.push(this.createCheckResult(
          'cta',
          'cta_detected',
          'warning',
          'warning',
          'Aucun CTA détecté',
          'Aucun bouton d\'action clair n\'a été trouvé',
          [{ type: 'url', payload: { url } }]
        ));
      } else {
        results.push(this.createCheckResult(
          'cta',
          'cta_detected',
          'passed',
          null,
          `${ctaCount} CTA détecté(s)`,
          `${ctaCount} bouton(s) d'action trouvé(s)`,
          [{ type: 'action', payload: { url, ctaCount, details: ctaDetails } }]
        ));
      }

    } catch (error) {
      results.push(this.createCheckResult(
        'cta',
        'cta_test',
        'failed',
        'major',
        'Erreur lors du test des CTA',
        error instanceof Error ? error.message : String(error),
        [{ type: 'url', payload: { url } }]
      ));
    } finally {
      await page.close();
    }

    return results;
  }

  async testResponsive(url: string): Promise<CheckResult[]> {
    const results: CheckResult[] = [];
    const viewports = this.config.getViewports();

    for (const viewport of viewports) {
      const page = await this.createPage(viewport);

      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: this.config.getMaxPageTime() * 1000 });

        // Vérifier l'overflow horizontal
        const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
        const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);

        if (scrollWidth > clientWidth) {
          results.push(this.createCheckResult(
            'responsive',
            `horizontal_overflow_${viewport.name}`,
            'failed',
            'major',
            `Overflow horizontal sur ${viewport.name}`,
            `Largeur de scroll: ${scrollWidth}px, Largeur client: ${clientWidth}px`,
            [
              { type: 'measurement', payload: { viewport: viewport.name, scrollWidth, clientWidth } },
              { type: 'screenshot', payload: { viewport: viewport.name, url } }
            ]
          ));
        } else {
          results.push(this.createCheckResult(
            'responsive',
            `horizontal_overflow_${viewport.name}`,
            'passed',
            null,
            `Pas d'overflow sur ${viewport.name}`,
            `La page s'affiche correctement sur ${viewport.name}`,
            [{ type: 'measurement', payload: { viewport: viewport.name, scrollWidth, clientWidth } }]
          ));
        }

      } catch (error) {
        results.push(this.createCheckResult(
          'responsive',
          `responsive_test_${viewport.name}`,
          'failed',
          'major',
          `Erreur responsive sur ${viewport.name}`,
          error instanceof Error ? error.message : String(error),
          [{ type: 'url', payload: { url, viewport: viewport.name } }]
        ));
      } finally {
        await page.close();
      }
    }

    return results;
  }

  async takeScreenshot(url: string, viewport: ViewportConfig): Promise<Buffer> {
    const page = await this.createPage(viewport);

    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: this.config.getMaxPageTime() * 1000 });
      return await page.screenshot({ fullPage: true });
    } finally {
      await page.close();
    }
  }

  private createCheckResult(
    category: CheckCategory,
    key: string,
    status: CheckStatus,
    severity: any,
    title: string,
    message: string,
    evidence: Evidence[]
  ): CheckResult {
    return {
      id: crypto.randomUUID(),
      scanId: '', // À définir par l'orchestrateur
      pageId: null,
      category,
      key,
      status,
      severity,
      title,
      message,
      duration: 0,
      evidence
    };
  }

  isSensitiveAction(text: string): boolean {
    const lowerText = text.toLowerCase();
    return SENSITIVE_ACTIONS.some(action => lowerText.includes(action));
  }
}
