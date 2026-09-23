export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      sites: {
        Row: {
          id: string
          user_id: string
          url: string
          name: string | null
          created_at: string
          updated_at: string
          last_scan_id: string | null
        }
        Insert: {
          id?: string
          user_id: string
          url: string
          name?: string | null
          created_at?: string
          updated_at?: string
          last_scan_id?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          url?: string
          name?: string | null
          created_at?: string
          updated_at?: string
          last_scan_id?: string | null
        }
      }
      scans: {
        Row: {
          id: string
          site_id: string
          user_id: string
          status: 'created' | 'discovering' | 'crawling' | 'browser_testing' | 'analyzing' | 'reporting' | 'completed' | 'partial' | 'failed' | 'blocked'
          started_at: string | null
          completed_at: string | null
          pages_discovered: number
          checks_total: number
          checks_passed: number
          checks_warning: number
          checks_failed: number
          critical_count: number
          major_count: number
          summary: string | null
          error: string | null
          previous_scan_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          site_id: string
          user_id: string
          status?: 'created' | 'discovering' | 'crawling' | 'browser_testing' | 'analyzing' | 'reporting' | 'completed' | 'partial' | 'failed' | 'blocked'
          started_at?: string | null
          completed_at?: string | null
          pages_discovered?: number
          checks_total?: number
          checks_passed?: number
          checks_warning?: number
          checks_failed?: number
          critical_count?: number
          major_count?: number
          summary?: string | null
          error?: string | null
          previous_scan_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          site_id?: string
          user_id?: string
          status?: 'created' | 'discovering' | 'crawling' | 'browser_testing' | 'analyzing' | 'reporting' | 'completed' | 'partial' | 'failed' | 'blocked'
          started_at?: string | null
          completed_at?: string | null
          pages_discovered?: number
          checks_total?: number
          checks_passed?: number
          checks_warning?: number
          checks_failed?: number
          critical_count?: number
          major_count?: number
          summary?: string | null
          error?: string | null
          previous_scan_id?: string | null
          created_at?: string
        }
      }
      pages: {
        Row: {
          id: string
          scan_id: string
          url: string
          status_code: number | null
          final_url: string | null
          response_time_ms: number | null
          title: string | null
          depth: number
          created_at: string
        }
        Insert: {
          id?: string
          scan_id: string
          url: string
          status_code?: number | null
          final_url?: string | null
          response_time_ms?: number | null
          title?: string | null
          depth?: number
          created_at?: string
        }
        Update: {
          id?: string
          scan_id?: string
          url?: string
          status_code?: number | null
          final_url?: string | null
          response_time_ms?: number | null
          title?: string | null
          depth?: number
          created_at?: string
        }
      }
      checks: {
        Row: {
          id: string
          scan_id: string
          page_id: string | null
          category: 'pages' | 'links' | 'navigation' | 'forms' | 'cta' | 'browser' | 'network' | 'assets' | 'responsive' | 'seo' | 'performance' | 'accessibility' | 'security' | 'visual'
          key: string
          status: 'passed' | 'warning' | 'failed' | 'inconclusive' | 'skipped' | 'running'
          severity: 'critical' | 'major' | 'warning' | 'info' | null
          title: string | null
          message: string | null
          duration_ms: number | null
          created_at: string
        }
        Insert: {
          id?: string
          scan_id: string
          page_id?: string | null
          category: 'pages' | 'links' | 'navigation' | 'forms' | 'cta' | 'browser' | 'network' | 'assets' | 'responsive' | 'seo' | 'performance' | 'accessibility' | 'security' | 'visual'
          key: string
          status?: 'passed' | 'warning' | 'failed' | 'inconclusive' | 'skipped' | 'running'
          severity?: 'critical' | 'major' | 'warning' | 'info' | null
          title?: string | null
          message?: string | null
          duration_ms?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          scan_id?: string
          page_id?: string | null
          category?: 'pages' | 'links' | 'navigation' | 'forms' | 'cta' | 'browser' | 'network' | 'assets' | 'responsive' | 'seo' | 'performance' | 'accessibility' | 'security' | 'visual'
          key?: string
          status?: 'passed' | 'warning' | 'failed' | 'inconclusive' | 'skipped' | 'running'
          severity?: 'critical' | 'major' | 'warning' | 'info' | null
          title?: string | null
          message?: string | null
          duration_ms?: number | null
          created_at?: string
        }
      }
      issues: {
        Row: {
          id: string
          scan_id: string
          page_id: string | null
          category: string
          severity: 'critical' | 'major' | 'warning'
          title: string
          description: string | null
          suggestion: string | null
          confidence: 'high' | 'medium' | 'low' | null
          status: 'open' | 'fixed' | 'ignored'
          created_at: string
        }
        Insert: {
          id?: string
          scan_id: string
          page_id?: string | null
          category: string
          severity: 'critical' | 'major' | 'warning'
          title: string
          description?: string | null
          suggestion?: string | null
          confidence?: 'high' | 'medium' | 'low' | null
          status?: 'open' | 'fixed' | 'ignored'
          created_at?: string
        }
        Update: {
          id?: string
          scan_id?: string
          page_id?: string | null
          category?: string
          severity?: 'critical' | 'major' | 'warning'
          title?: string
          description?: string | null
          suggestion?: string | null
          confidence?: 'high' | 'medium' | 'low' | null
          status?: 'open' | 'fixed' | 'ignored'
          created_at?: string
        }
      }
      evidence: {
        Row: {
          id: string
          scan_id: string
          issue_id: string | null
          type: 'url' | 'action' | 'network' | 'console' | 'screenshot' | 'measurement'
          payload: Json
          created_at: string
        }
        Insert: {
          id?: string
          scan_id: string
          issue_id?: string | null
          type: 'url' | 'action' | 'network' | 'console' | 'screenshot' | 'measurement'
          payload: Json
          created_at?: string
        }
        Update: {
          id?: string
          scan_id?: string
          issue_id?: string | null
          type?: 'url' | 'action' | 'network' | 'console' | 'screenshot' | 'measurement'
          payload?: Json
          created_at?: string
        }
      }
      screenshots: {
        Row: {
          id: string
          scan_id: string
          page_id: string | null
          issue_id: string | null
          viewport: 'mobile' | 'tablet' | 'desktop'
          storage_path: string
          created_at: string
        }
        Insert: {
          id?: string
          scan_id: string
          page_id?: string | null
          issue_id?: string | null
          viewport: 'mobile' | 'tablet' | 'desktop'
          storage_path: string
          created_at?: string
        }
        Update: {
          id?: string
          scan_id?: string
          page_id?: string | null
          issue_id?: string | null
          viewport?: 'mobile' | 'tablet' | 'desktop'
          storage_path?: string
          created_at?: string
        }
      }
    }
  }
}
