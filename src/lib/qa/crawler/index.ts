import { chromium, Browser, Page, BrowserContext } from 'playwright';
import { CrawlResult, PageResult, FormInfo, FORBIDDEN_URLS } from '../types';
import { QAConfigManager } from '../config';

export class CrawlerEngine {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private config: QAConfigManager;
  private visitedUrls: Set<string> = new Set();
  private queue: string[] = [];
  private crawledPages: PageResult[] = [];

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

    this.context = await this.browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Reachly-QA/1.0',
      viewport: { width: 1440, height: 900 }
    });
  }

  async cleanup(): Promise<void> {
    if (this.context) {
      await this.context.close();
      this.context = null;
    }
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  async crawl(startUrl: string, maxPages?: number): Promise<CrawlResult> {
    const startTime = Date.now();
    const maxPagesLimit = maxPages || this.config.getMaxPages();
    const maxDepth = this.config.getMaxCrawlDepth();

    // Normaliser l'URL de départ
    const normalizedStartUrl = this.normalizeUrl(startUrl);
    
    // Initialiser la queue avec l'URL de départ
    this.queue = [{ url: normalizedStartUrl, depth: 0 }];
    this.visitedUrls.clear();
    this.crawledPages = [];

    const baseUrl = new URL(normalizedStartUrl).origin;

    while (this.queue.length > 0 && this.crawledPages.length < maxPagesLimit) {
      const { url: currentUrl, depth } = this.queue.shift()!;

      // Vérifier la profondeur maximale
      if (depth > maxDepth) {
        continue;
      }

      // Vérifier si déjà visité
      if (this.visitedUrls.has(currentUrl)) {
        continue;
      }

      // Vérifier si URL interdite
      if (this.isForbiddenUrl(currentUrl)) {
        continue;
      }

      // Marquer comme visité
      this.visitedUrls.add(currentUrl);

      // Crawler la page
      try {
        const pageResult = await this.crawlPage(currentUrl, depth, baseUrl);
        this.crawledPages.push(pageResult);

        // Ajouter les liens découverts à la queue
        for (const link of pageResult.links) {
          const normalizedLink = this.normalizeUrl(link);
          if (!this.visitedUrls.has(normalizedLink) && 
              !this.isForbiddenUrl(normalizedLink) &&
              this.isSameOrigin(normalizedLink, baseUrl)) {
            this.queue.push({ url: normalizedLink, depth: depth + 1 });
          }
        }

      } catch (error) {
        console.error(`Erreur lors du crawl de ${currentUrl}:`, error);
        // Continuer avec les autres pages
      }
    }

    const duration = Date.now() - startTime;

    return {
      pages: this.crawledPages,
      total: this.crawledPages.length,
      duration
    };
  }

  private async crawlPage(url: string, depth: number, baseUrl: string): Promise<PageResult> {
    if (!this.context) {
      throw new Error('Crawler engine not initialized');
    }

    const page = await this.context.newPage();
    const startTime = Date.now();

    try {
      // Naviguer vers la page
      const response = await page.goto(url, {
        waitUntil: 'networkidle',
        timeout: this.config.getMaxPageTime() * 1000
      });

      if (!response) {
        throw new Error('Pas de réponse du serveur');
      }

      const status = response.status();
      const finalUrl = page.url();
      const responseTime = Date.now() - startTime;

      // Extraire le titre
      const title = await page.title();

      // Extraire les liens
      const links = await this.extractLinks(page, baseUrl);

      // Extraire les images
      const images = await this.extractImages(page);

      // Extraire les formulaires
      const forms = await this.extractForms(page);

      return {
        url,
        status,
        finalUrl,
        responseTime,
        title,
        depth,
        links,
        images,
        forms
      };

    } finally {
      await page.close();
    }
  }

  private async extractLinks(page: Page, baseUrl: string): Promise<string[]> {
    const links = await page.$$eval('a[href]', elements => {
      return elements
        .map(el => (el as HTMLAnchorElement).href)
        .filter(href => href && href.startsWith('http'));
    });

    const baseUrlObj = new URL(baseUrl);
    const origin = baseUrlObj.origin;

    return links
      .filter(link => {
        try {
          const linkUrl = new URL(link);
          return linkUrl.origin === origin;
        } catch {
          return false;
        }
      })
      .map(link => this.normalizeUrl(link))
      .filter((value, index, self) => self.indexOf(value) === index)
      .slice(0, 50); // Limiter à 50 liens par page
  }

  private async extractImages(page: Page): Promise<string[]> {
    const images = await page.$$eval('img[src]', elements => {
      return elements
        .map(el => (el as HTMLImageElement).src)
        .filter(src => src && src.startsWith('http'));
    });

    return images
      .map(src => this.normalizeUrl(src))
      .filter((value, index, self) => self.indexOf(value) === index);
  }

  private async extractForms(page: Page): Promise<FormInfo[]> {
    const forms = await page.$$eval('form', forms => {
      return forms.map(form => {
        const action = (form as HTMLFormElement).action || window.location.href;
        const method = (form as HTMLFormElement).method || 'POST';
        
        const fields = Array.from(form.querySelectorAll('input, select, textarea')).map(field => {
          const input = field as HTMLInputElement;
          return {
            name: input.name || input.id || '',
            type: input.type || 'text',
            required: input.required || false,
            label: this.getFieldLabel(field)
          };
        });

        const submitButton = form.querySelector('button[type="submit"], input[type="submit"]')?.getAttribute('name') || null;

        return { action, method, fields, submitButton };
      });
    });

    return forms.filter(form => form.fields.length > 0);
  }

  private getFieldLabel(field: Element): string | null {
    const id = field.getAttribute('id');
    if (id) {
      const label = document.querySelector(`label[for="${id}"]`);
      if (label) {
        return label.textContent?.trim() || null;
      }
    }

    const parentLabel = field.closest('label');
    if (parentLabel) {
      return parentLabel.textContent?.trim() || null;
    }

    const placeholder = field.getAttribute('placeholder');
    if (placeholder) {
      return placeholder;
    }

    return null;
  }

  private normalizeUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      
      // Supprimer les paramètres de tracking courants
      const paramsToRemove = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'fbclid', 'gclid'];
      paramsToRemove.forEach(param => {
        urlObj.searchParams.delete(param);
      });

      // Normaliser le trailing slash
      const path = urlObj.pathname;
      if (path !== '/' && path.endsWith('/')) {
        urlObj.pathname = path.slice(0, -1);
      }

      return urlObj.toString();
    } catch {
      return url;
    }
  }

  private isForbiddenUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.toLowerCase();

      return FORBIDDEN_URLS.some(forbidden => {
        if (forbidden.includes('/')) {
          return hostname.startsWith(forbidden.split('/')[0]);
        }
        return hostname === forbidden || hostname.includes(forbidden);
      });
    } catch {
      return true;
    }
  }

  private isSameOrigin(url: string, baseUrl: string): boolean {
    try {
      const urlObj = new URL(url);
      const baseUrlObj = new URL(baseUrl);
      return urlObj.origin === baseUrlObj.origin;
    } catch {
      return false;
    }
  }
}

interface QueueItem {
  url: string;
  depth: number;
}
