import { QAConfig, DEFAULT_QA_CONFIG, ViewportConfig } from '../types';

export class QAConfigManager {
  private config: QAConfig;

  constructor(config?: Partial<QAConfig>) {
    this.config = {
      ...DEFAULT_QA_CONFIG,
      ...config
    };
  }

  getConfig(): QAConfig {
    return { ...this.config };
  }

  updateConfig(updates: Partial<QAConfig>): void {
    this.config = {
      ...this.config,
      ...updates
    };
  }

  getMaxPages(): number {
    return this.config.maxPages;
  }

  getMaxCrawlDepth(): number {
    return this.config.maxCrawlDepth;
  }

  getMaxScanTime(): number {
    return this.config.maxScanTime;
  }

  getMaxPageTime(): number {
    return this.config.maxPageTime;
  }

  getMaxNavigationTime(): number {
    return this.config.maxNavigationTime;
  }

  getMaxRetries(): number {
    return this.config.maxRetries;
  }

  getMaxScreenshots(): number {
    return this.config.maxScreenshots;
  }

  getViewports(): ViewportConfig[] {
    return this.config.viewports;
  }

  getViewport(name: string): ViewportConfig | undefined {
    return this.config.viewports.find(v => v.name === name);
  }

  // Configuration pour différents plans de pricing
  static forQuickQA(): QAConfigManager {
    return new QAConfigManager({
      maxPages: 10,
      maxCrawlDepth: 2,
      maxScanTime: 180, // 3 minutes
      maxScreenshots: 5,
      viewports: [{ name: 'desktop', width: 1440, height: 900 }]
    });
  }

  static forFullQA(): QAConfigManager {
    return new QAConfigManager(DEFAULT_QA_CONFIG);
  }

  static forDeliveryQA(): QAConfigManager {
    return new QAConfigManager({
      ...DEFAULT_QA_CONFIG,
      maxPages: 100,
      maxCrawlDepth: 5,
      maxScanTime: 1200, // 20 minutes
      maxScreenshots: 50
    });
  }
}
