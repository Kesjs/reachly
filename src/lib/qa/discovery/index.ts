import { chromium, Browser, Page, BrowserContext } from 'playwright';
import { DiscoveryResult, FormInfo, FieldInfo, FORBIDDEN_URLS } from '../types';

export class DiscoveryEngine {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private page: Page | null = null;

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

    this.page = await this.context.newPage();
  }

  async cleanup(): Promise<void> {
    if (this.page) {
      await this.page.close();
      this.page = null;
    }
    if (this.context) {
      await this.context.close();
      this.context = null;
    }
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  async discover(url: string): Promise<DiscoveryResult> {
    if (!this.page) {
      throw new Error('Discovery engine not initialized');
    }

    // Validation de l'URL
    const normalizedUrl = this.normalizeUrl(url);
    if (this.isForbiddenUrl(normalizedUrl)) {
      throw new Error(`URL interdite: ${normalizedUrl}`);
    }

    try {
      // Naviguer vers la page
      const response = await this.page.goto(normalizedUrl, {
        waitUntil: 'networkidle',
        timeout: 30000
      });

      if (!response) {
        throw new Error('Pas de réponse du serveur');
      }

      const status = response.status();
      if (status >= 400) {
        throw new Error(`Erreur HTTP ${status}`);
      }

      // Attendre que la page soit chargée
      await this.page.waitForLoadState('domcontentloaded');

      // Extraire les informations
      const result: DiscoveryResult = {
        url: normalizedUrl,
        homepage: normalizedUrl,
        sitemap: await this.tryFetchSitemap(normalizedUrl),
        robots: await this.tryFetchRobots(normalizedUrl),
        internalLinks: await this.extractInternalLinks(normalizedUrl),
        navigation: await this.extractNavigation(),
        forms: await this.extractForms(),
        ctaCandidates: await this.extractCTACandidates(),
        images: await this.extractImages(),
        scripts: await this.extractScripts()
      };

      return result;

    } catch (error) {
      throw new Error(`Erreur lors du discovery: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private normalizeUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      if (!urlObj.protocol) {
        urlObj.protocol = 'https:';
      }
      return urlObj.toString();
    } catch {
      return `https://${url}`;
    }
  }

  private isForbiddenUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.toLowerCase();

      return FORBIDDEN_URLS.some(forbidden => {
        if (forbidden.includes('/')) {
          // CIDR notation - vérification simplifiée
          return hostname.startsWith(forbidden.split('/')[0]);
        }
        return hostname === forbidden || hostname.includes(forbidden);
      });
    } catch {
      return true;
    }
  }

  private async tryFetchSitemap(baseUrl: string): Promise<string | null> {
    try {
      const urlObj = new URL(baseUrl);
      const sitemapUrl = `${urlObj.origin}/sitemap.xml`;
      
      const response = await this.page!.context().request.get(sitemapUrl);
      if (response.ok()) {
        return sitemapUrl;
      }
      return null;
    } catch {
      return null;
    }
  }

  private async tryFetchRobots(baseUrl: string): Promise<string | null> {
    try {
      const urlObj = new URL(baseUrl);
      const robotsUrl = `${urlObj.origin}/robots.txt`;
      
      const response = await this.page!.context().request.get(robotsUrl);
      if (response.ok()) {
        return robotsUrl;
      }
      return null;
    } catch {
      return null;
    }
  }

  private async extractInternalLinks(baseUrl: string): Promise<string[]> {
    if (!this.page) return [];

    const links = await this.page.$$eval('a[href]', elements => {
      return elements
        .map(el => (el as HTMLAnchorElement).href)
        .filter(href => href && href.startsWith('http'))
        .filter((value, index, self) => self.indexOf(value) === index);
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
      .slice(0, 100); // Limiter à 100 liens pour le discovery
  }

  private async extractNavigation(): Promise<string[]> {
    if (!this.page) return [];

    const navSelectors = [
      'nav a[href]',
      '[role="navigation"] a[href]',
      '.navigation a[href]',
      '.menu a[href]',
      '.navbar a[href]'
    ];

    for (const selector of navSelectors) {
      try {
        const links = await this.page.$$eval(selector, elements => {
          return elements
            .map(el => (el as HTMLAnchorElement).href)
            .filter(href => href && href.startsWith('http'));
        });

        if (links.length > 0) {
          return links.map(link => this.normalizeUrl(link));
        }
      } catch {
        continue;
      }
    }

    return [];
  }

  private async extractForms(): Promise<FormInfo[]> {
    if (!this.page) return [];

    const forms = await this.page.$$eval('form', forms => {
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
    // Chercher un label associé
    const id = field.getAttribute('id');
    if (id) {
      const label = document.querySelector(`label[for="${id}"]`);
      if (label) {
        return label.textContent?.trim() || null;
      }
    }

    // Chercher un label parent
    const parentLabel = field.closest('label');
    if (parentLabel) {
      return parentLabel.textContent?.trim() || null;
    }

    // Chercher un placeholder
    const placeholder = field.getAttribute('placeholder');
    if (placeholder) {
      return placeholder;
    }

    return null;
  }

  private async extractCTACandidates(): Promise<string[]> {
    if (!this.page) return [];

    const ctaTexts = [
      'contact',
      'get started',
      'book a call',
      'request a quote',
      'learn more',
      'download',
      'buy',
      'sign up',
      'register',
      'subscribe',
      'join'
    ];

    const links = await this.page.$$eval('a, button', elements => {
      return elements
        .map(el => {
          const text = el.textContent?.toLowerCase().trim() || '';
          const href = (el as HTMLAnchorElement).href || '';
          return { text, href };
        })
        .filter(({ text }) => ctaTexts.some(cta => text.includes(cta)));
    });

    return links
      .map(({ href }) => href || this.page!.url())
      .filter(href => href)
      .map(href => this.normalizeUrl(href))
      .filter((value, index, self) => self.indexOf(value) === index);
  }

  private async extractImages(): Promise<string[]> {
    if (!this.page) return [];

    const images = await this.page.$$eval('img[src]', elements => {
      return elements
        .map(el => (el as HTMLImageElement).src)
        .filter(src => src && src.startsWith('http'));
    });

    return images
      .map(src => this.normalizeUrl(src))
      .filter((value, index, self) => self.indexOf(value) === index);
  }

  private async extractScripts(): Promise<string[]> {
    if (!this.page) return [];

    const scripts = await this.page.$$eval('script[src]', elements => {
      return elements
        .map(el => (el as HTMLScriptElement).src)
        .filter(src => src && src.startsWith('http'));
    });

    return scripts
      .map(src => this.normalizeUrl(src))
      .filter((value, index, self) => self.indexOf(value) === index);
  }
}
