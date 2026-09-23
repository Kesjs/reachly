import { QAConfigManager } from '../config';
import { ScanStatus, IssueSeverity } from '../types';

export function isReadyToShip(status: ScanStatus, criticalCount: number, majorCount: number): boolean {
  return status === 'completed' && criticalCount === 0 && majorCount === 0;
}

export function getScanStatusText(status: ScanStatus): string {
  const statusTexts: Record<ScanStatus, string> = {
    created: 'Scan créé',
    discovering: 'Découverte en cours...',
    crawling: 'Exploration des pages...',
    browser_testing: 'Tests navigateur...',
    analyzing: 'Analyse des résultats...',
    reporting: 'Génération du rapport...',
    completed: 'Scan terminé',
    partial: 'Scan partiel',
    failed: 'Scan échoué',
    blocked: 'Scan bloqué'
  };

  return statusTexts[status] || status;
}

export function getSeverityColor(severity: IssueSeverity): string {
  const colors: Record<IssueSeverity, string> = {
    critical: 'red',
    major: 'orange',
    warning: 'yellow'
  };

  return colors[severity] || 'gray';
}

export function getSeverityIcon(severity: IssueSeverity): string {
  const icons: Record<IssueSeverity, string> = {
    critical: '⚠️',
    major: '⚡',
    warning: 'ℹ️'
  };

  return icons[severity] || '•';
}

export function formatDuration(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`;
  } else if (ms < 60000) {
    return `${Math.round(ms / 1000)}s`;
  } else {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.round((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  }
}

export function calculateProgress(status: ScanStatus): number {
  const progressMap: Record<ScanStatus, number> = {
    created: 0,
    discovering: 10,
    crawling: 30,
    browser_testing: 60,
    analyzing: 80,
    reporting: 90,
    completed: 100,
    partial: 100,
    failed: 0,
    blocked: 0
  };

  return progressMap[status] || 0;
}

export function estimateTimeRemaining(status: ScanStatus, elapsed: number): number {
  const totalTimeEstimates: Record<ScanStatus, number> = {
    created: 600, // 10 minutes
    discovering: 540,
    crawling: 420,
    browser_testing: 240,
    analyzing: 60,
    reporting: 30,
    completed: 0,
    partial: 0,
    failed: 0,
    blocked: 0
  };

  const estimatedTotal = totalTimeEstimates[status] || 600;
  return Math.max(0, estimatedTotal - elapsed);
}

export function validateUrl(url: string): { valid: boolean; error?: string } {
  try {
    const urlObj = new URL(url);
    
    // Vérifier le protocole
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return { valid: false, error: 'Le protocole doit être HTTP ou HTTPS' };
    }

    // Vérifier que ce n'est pas localhost
    if (urlObj.hostname === 'localhost' || urlObj.hostname === '127.0.0.1') {
      return { valid: false, error: 'Les URLs localhost ne sont pas supportées' };
    }

    // Vérifier les IP privées
    const privateIPPatterns = [
      /^10\./,
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
      /^192\.168\./,
      /^169\.254\./
    ];

    for (const pattern of privateIPPatterns) {
      if (pattern.test(urlObj.hostname)) {
        return { valid: false, error: 'Les adresses IP privées ne sont pas supportées' };
      }
    }

    return { valid: true };
  } catch {
    return { valid: false, error: 'URL invalide' };
  }
}

export function getConfigForPlan(plan: 'quick' | 'full' | 'delivery'): QAConfigManager {
  switch (plan) {
    case 'quick':
      return QAConfigManager.forQuickQA();
    case 'delivery':
      return QAConfigManager.forDeliveryQA();
    case 'full':
    default:
      return QAConfigManager.forFullQA();
  }
}

export function groupIssuesByCategory(issues: any[]): Record<string, any[]> {
  return issues.reduce((acc, issue) => {
    const category = issue.category || 'other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(issue);
    return acc;
  }, {} as Record<string, any[]>);
}

export function groupIssuesBySeverity(issues: any[]): Record<string, any[]> {
  return issues.reduce((acc, issue) => {
    const severity = issue.severity || 'info';
    if (!acc[severity]) {
      acc[severity] = [];
    }
    acc[severity].push(issue);
    return acc;
  }, {} as Record<string, any[]>);
}

export function compareScans(previous: any, current: any): {
  fixed: number;
  stillPresent: number;
  new: number;
  unchanged: number;
} {
  const previousIssues = new Set(previous.issues?.map((i: any) => i.signature) || []);
  const currentIssues = new Set(current.issues?.map((i: any) => i.signature) || []);

  const fixed = [...previousIssues].filter(sig => !currentIssues.has(sig)).length;
  const newIssues = [...currentIssues].filter(sig => !previousIssues.has(sig)).length;
  const stillPresent = [...previousIssues].filter(sig => currentIssues.has(sig)).length;
  const unchanged = current.issues?.length - newIssues - stillPresent;

  return {
    fixed,
    stillPresent,
    new: newIssues,
    unchanged: Math.max(0, unchanged)
  };
}
