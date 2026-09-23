import { createClient } from '@supabase/supabase-js';
import { Database } from '../../supabase/database.types';
import { DiscoveryEngine } from '../discovery';
import { CrawlerEngine } from '../crawler';
import { BrowserEngine } from '../browser';
import { QAConfigManager } from '../config';
import { 
  ScanResult, 
  ScanStatus, 
  CheckResult, 
  Issue, 
  IssueSeverity,
  PageResult,
  ScreenshotResult 
} from '../types';

interface ScanOptions {
  siteId: string;
  userId: string;
  url: string;
  previousScanId?: string;
  config?: QAConfigManager;
}

export class QAOrchestrator {
  private supabase: ReturnType<typeof createClient<Database>>;
  private config: QAConfigManager;
  private discovery: DiscoveryEngine;
  private crawler: CrawlerEngine;
  private browser: BrowserEngine;

  constructor(supabaseUrl: string, supabaseKey: string, config?: QAConfigManager) {
    this.supabase = createClient<Database>(supabaseUrl, supabaseKey);
    this.config = config || new QAConfigManager();
    this.discovery = new DiscoveryEngine();
    this.crawler = new CrawlerEngine(this.config);
    this.browser = new BrowserEngine(this.config);
  }

  async runScan(options: ScanOptions): Promise<ScanResult> {
    const { siteId, userId, url, previousScanId } = options;

    // Créer le scan en base de données
    const { data: scan, error: scanError } = await this.supabase
      .from('scans')
      .insert({
        site_id: siteId,
        user_id: userId,
        status: 'created' as ScanStatus,
        previous_scan_id: previousScanId || null
      })
      .select('id')
      .single() as any;

    if (scanError || !scan) {
      throw new Error(`Erreur lors de la création du scan: ${scanError?.message}`);
    }

    const scanId = scan.id;
    const result: ScanResult = {
      scanId,
      siteId,
      status: 'created',
      startedAt: new Date(),
      completedAt: null,
      pagesDiscovered: 0,
      checksTotal: 0,
      checksPassed: 0,
      checksWarning: 0,
      checksFailed: 0,
      criticalCount: 0,
      majorCount: 0,
      summary: '',
      error: null,
      issues: [],
      checks: [],
      pages: [],
      screenshots: []
    };

    try {
      // Initialiser les moteurs
      await this.initializeEngines();

      // Phase 1: Discovery
      await this.updateScanStatus(scanId, 'discovering');
      const discoveryResult = await this.discovery.discover(url);
      
      // Sauvegarder les pages découvertes
      const discoveredPages = await this.saveDiscoveredPages(scanId, discoveryResult);

      // Phase 2: Crawl
      await this.updateScanStatus(scanId, 'crawling');
      const crawlResult = await this.crawler.crawl(url);
      
      // Sauvegarder les pages crawlées
      const crawledPages = await this.saveCrawledPages(scanId, crawlResult);
      result.pages = crawledPages;
      result.pagesDiscovered = crawledPages.length;

      // Phase 3: Browser Testing
      await this.updateScanStatus(scanId, 'browser_testing');
      const allChecks: CheckResult[] = [];

      // Tester chaque page
      for (const page of crawledPages.slice(0, this.config.getMaxPages())) {
        try {
          // Navigation test
          const navChecks = await this.browser.testNavigation(page.url);
          allChecks.push(...navChecks.map(check => ({ ...check, scanId, pageId: page.id || null })));

          // Forms test
          const formChecks = await this.browser.testForms(page.url);
          allChecks.push(...formChecks.map(check => ({ ...check, scanId, pageId: page.id || null })));

          // CTA test
          const ctaChecks = await this.browser.testCTA(page.url);
          allChecks.push(...ctaChecks.map(check => ({ ...check, scanId, pageId: page.id || null })));

        } catch (error) {
          console.error(`Erreur lors des tests pour ${page.url}:`, error);
        }
      }

      // Responsive test (uniquement sur la homepage pour économiser du temps)
      const responsiveChecks = await this.browser.testResponsive(url);
      const homepageId = crawledPages[0]?.id || null;
      allChecks.push(...responsiveChecks.map(check => ({ ...check, scanId, pageId: homepageId })));

      // Sauvegarder les checks
      await this.saveChecks(scanId, allChecks);
      result.checks = allChecks;

      // Calculer les statistiques
      result.checksTotal = allChecks.length;
      result.checksPassed = allChecks.filter(c => c.status === 'passed').length;
      result.checksWarning = allChecks.filter(c => c.status === 'warning').length;
      result.checksFailed = allChecks.filter(c => c.status === 'failed').length;
      result.criticalCount = allChecks.filter(c => c.severity === 'critical').length;
      result.majorCount = allChecks.filter(c => c.severity === 'major').length;

      // Phase 4: Analyzing
      await this.updateScanStatus(scanId, 'analyzing');
      const issues = this.extractIssues(allChecks);
      
      // Sauvegarder les issues
      await this.saveIssues(scanId, issues);
      result.issues = issues;

      // Phase 5: Reporting
      await this.updateScanStatus(scanId, 'reporting');
      result.summary = this.generateSummary(result);

      // Phase 6: Completed
      await this.updateScanStatus(scanId, 'completed');
      result.status = 'completed';
      result.completedAt = new Date();

      // Mettre à jour le scan final
      await this.finalizeScan(scanId, result);

      // Mettre à jour le site avec le dernier scan
      await this.updateSiteLastScan(siteId, scanId);

      return result;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      result.error = errorMessage;
      result.status = 'failed';
      
      await this.updateScanStatus(scanId, 'failed');
      await this.supabase
        .from('scans')
        .update({ error: errorMessage } as any)
        .eq('id', scanId);

      throw error;
    } finally {
      await this.cleanupEngines();
    }
  }

  private async initializeEngines(): Promise<void> {
    await this.discovery.initialize();
    await this.crawler.initialize();
    await this.browser.initialize();
  }

  private async cleanupEngines(): Promise<void> {
    await this.discovery.cleanup();
    await this.crawler.cleanup();
    await this.browser.cleanup();
  }

  private async updateScanStatus(scanId: string, status: ScanStatus): Promise<void> {
    const updateData: any = { status };
    
    if (status === 'discovering') {
      updateData.started_at = new Date().toISOString();
    } else if (status === 'completed' || status === 'failed' || status === 'partial') {
      updateData.completed_at = new Date().toISOString();
    }

    await this.supabase
      .from('scans')
      .update(updateData)
      .eq('id', scanId);
  }

  private async saveDiscoveredPages(scanId: string, discoveryResult: any): Promise<any[]> {
    const pages = discoveryResult.internalLinks.map((url: string, index: number) => ({
      scan_id: scanId,
      url,
      status_code: null,
      final_url: url,
      response_time_ms: null,
      title: null,
      depth: 0
    }));

    const { data, error } = await this.supabase
      .from('pages')
      .insert(pages)
      .select('id');

    if (error) {
      console.error('Erreur lors de la sauvegarde des pages découvertes:', error);
      return [];
    }

    return data || [];
  }

  private async saveCrawledPages(scanId: string, crawlResult: any): Promise<PageResult[]> {
    const pages = crawlResult.pages.map((page: any) => ({
      scan_id: scanId,
      url: page.url,
      status_code: page.status,
      final_url: page.finalUrl,
      response_time_ms: page.responseTime,
      title: page.title,
      depth: page.depth
    }));

    const { data, error } = await this.supabase
      .from('pages')
      .insert(pages)
      .select('id');

    if (error) {
      console.error('Erreur lors de la sauvegarde des pages crawlées:', error);
      return crawlResult.pages;
    }

    // Mapper les IDs retournés
    return (data || []).map((dbPage: any, index: number) => ({
      ...crawlResult.pages[index],
      id: dbPage.id
    }));
  }

  private async saveChecks(scanId: string, checks: CheckResult[]): Promise<void> {
    const checksToSave = checks.map(check => ({
      scan_id: scanId,
      page_id: check.pageId,
      category: check.category,
      key: check.key,
      status: check.status,
      severity: check.severity,
      title: check.title,
      message: check.message,
      duration_ms: check.duration
    }));

    const { error } = await this.supabase
      .from('checks')
      .insert(checksToSave as any);

    if (error) {
      console.error('Erreur lors de la sauvegarde des checks:', error);
    }
  }

  private async saveIssues(scanId: string, issues: Issue[]): Promise<void> {
    const issuesToSave = issues.map(issue => ({
      scan_id: scanId,
      page_id: issue.pageId,
      category: issue.category,
      severity: issue.severity,
      title: issue.title,
      description: issue.description,
      suggestion: issue.suggestion,
      confidence: issue.confidence,
      status: issue.status
    }));

    const { data, error } = await this.supabase
      .from('issues')
      .insert(issuesToSave as any)
      .select('id') as any;

    if (error) {
      console.error('Erreur lors de la sauvegarde des issues:', error);
      return;
    }

    // Sauvegarder l'evidence pour chaque issue
    for (let i = 0; i < issues.length; i++) {
      const issue = issues[i];
      const dbIssue = data?.[i] as any;
      
      if (dbIssue && issue.evidence.length > 0) {
        const evidenceToSave = issue.evidence.map(ev => ({
          scan_id: scanId,
          issue_id: dbIssue.id,
          type: ev.type,
          payload: ev.payload as any
        }));

        await this.supabase
          .from('evidence')
          .insert(evidenceToSave as any);
      }
    }
  }

  private extractIssues(checks: CheckResult[]): Issue[] {
    const issues: Issue[] = [];

    for (const check of checks) {
      if (check.status === 'failed' && check.severity) {
        issues.push({
          id: crypto.randomUUID(),
          scanId: check.scanId,
          pageId: check.pageId,
          category: check.category,
          severity: check.severity as IssueSeverity,
          title: check.title,
          description: check.message,
          suggestion: this.generateSuggestion(check),
          confidence: 'high',
          status: 'open',
          evidence: check.evidence || []
        });
      }
    }

    return issues;
  }

  private generateSuggestion(check: CheckResult): string {
    const suggestions: Record<string, string> = {
      'http_status': 'Vérifiez que la page existe et est accessible',
      'console_errors': 'Corrigez les erreurs JavaScript dans la console',
      'page_title': 'Ajoutez un titre descriptif à la page',
      'forms_detected': 'Vérifiez que les formulaires sont nécessaires et fonctionnels',
      'cta_detected': 'Ajoutez des boutons d\'action clairs pour guider les utilisateurs',
      'horizontal_overflow': 'Corrigez le layout pour éviter l\'overflow horizontal'
    };

    return suggestions[check.key] || 'Investiguez et corrigez le problème signalé';
  }

  private generateSummary(result: ScanResult): string {
    const { pagesDiscovered, checksTotal, checksPassed, checksWarning, checksFailed, criticalCount, majorCount } = result;

    if (criticalCount > 0) {
      return `${criticalCount} problème(s) critique(s) détecté(s). Le site n'est pas prêt à être livré.`;
    } else if (majorCount > 0) {
      return `${majorCount} problème(s) majeur(s) détecté(s). Corrigez-les avant la livraison.`;
    } else if (checksFailed > 0) {
      return `${checksFailed} problème(s) détecté(s). Vérifiez les détails.`;
    } else if (checksWarning > 0) {
      return `${checksWarning} avertissement(s). Le site est globalement bon mais des améliorations sont possibles.`;
    } else {
      return 'QA complet réussi. Le site est prêt à être livré.';
    }
  }

  private async finalizeScan(scanId: string, result: ScanResult): Promise<void> {
    await this.supabase
      .from('scans')
      .update({
        pages_discovered: result.pagesDiscovered,
        checks_total: result.checksTotal,
        checks_passed: result.checksPassed,
        checks_warning: result.checksWarning,
        checks_failed: result.checksFailed,
        critical_count: result.criticalCount,
        major_count: result.majorCount,
        summary: result.summary
      } as any)
      .eq('id', scanId) as any;
  }

  private async updateSiteLastScan(siteId: string, scanId: string): Promise<void> {
    await this.supabase
      .from('sites')
      .update({ last_scan_id: scanId, updated_at: new Date().toISOString() } as any)
      .eq('id', siteId) as any;
  }

  async getScanStatus(scanId: string): Promise<ScanStatus | null> {
    const { data, error } = await this.supabase
      .from('scans')
      .select('status')
      .eq('id', scanId)
      .single() as any;

    if (error || !data) {
      return null;
    }

    return data.status as ScanStatus;
  }

  async getScanResult(scanId: string): Promise<ScanResult | null> {
    const { data: scan, error: scanError } = await this.supabase
      .from('scans')
      .select('*')
      .eq('id', scanId)
      .single() as any;

    if (scanError || !scan) {
      return null;
    }

    // Récupérer les pages
    const { data: pages } = await this.supabase
      .from('pages')
      .select('*')
      .eq('scan_id', scanId) as any;

    // Récupérer les issues
    const { data: issues } = await this.supabase
      .from('issues')
      .select('*')
      .eq('scan_id', scanId) as any;

    return {
      scanId: scan.id,
      siteId: scan.site_id,
      status: scan.status as ScanStatus,
      startedAt: new Date(scan.started_at || scan.created_at),
      completedAt: scan.completed_at ? new Date(scan.completed_at) : null,
      pagesDiscovered: scan.pages_discovered,
      checksTotal: scan.checks_total,
      checksPassed: scan.checks_passed,
      checksWarning: scan.checks_warning,
      checksFailed: scan.checks_failed,
      criticalCount: scan.critical_count,
      majorCount: scan.major_count,
      summary: scan.summary || '',
      error: scan.error,
      issues: issues || [],
      checks: [],
      pages: pages || [],
      screenshots: []
    };
  }
}
