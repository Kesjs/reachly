-- REACHLY V1 - SCHÉMA DE BASE DE DONNÉES
-- QA AUTOMATISÉ DE SITES WEB AVANT LIVRAISON

-- Extension pour les UUID (si non déjà présente)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: sites
-- Sites à tester par Reachly
CREATE TABLE IF NOT EXISTS sites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour performances
CREATE INDEX IF NOT EXISTS idx_sites_user_id ON sites(user_id);

-- Table: scans
-- Scans QA exécutés sur un site
CREATE TABLE IF NOT EXISTS scans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'created', -- created, discovering, crawling, browser_testing, analyzing, reporting, completed, partial, failed, blocked
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  pages_discovered INTEGER DEFAULT 0,
  checks_total INTEGER DEFAULT 0,
  checks_passed INTEGER DEFAULT 0,
  checks_warning INTEGER DEFAULT 0,
  checks_failed INTEGER DEFAULT 0,
  critical_count INTEGER DEFAULT 0,
  major_count INTEGER DEFAULT 0,
  summary TEXT,
  error TEXT,
  previous_scan_id UUID REFERENCES scans(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour performances
CREATE INDEX IF NOT EXISTS idx_scans_site_id ON scans(site_id);
CREATE INDEX IF NOT EXISTS idx_scans_user_id ON scans(user_id);
CREATE INDEX IF NOT EXISTS idx_scans_status ON scans(status);
CREATE INDEX IF NOT EXISTS idx_scans_previous_scan_id ON scans(previous_scan_id);

-- Table: pages
-- Pages découvertes lors du crawl
CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scan_id UUID NOT NULL REFERENCES scans(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  status_code INTEGER,
  final_url TEXT,
  response_time_ms INTEGER,
  title TEXT,
  depth INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour performances
CREATE INDEX IF NOT EXISTS idx_pages_scan_id ON pages(scan_id);
CREATE INDEX IF NOT EXISTS idx_pages_url ON pages(url);

-- Table: checks
-- Checks individuels exécutés
CREATE TABLE IF NOT EXISTS checks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scan_id UUID NOT NULL REFERENCES scans(id) ON DELETE CASCADE,
  page_id UUID REFERENCES pages(id) ON DELETE SET NULL,
  category TEXT NOT NULL, -- pages, links, navigation, forms, cta, browser, network, assets, responsive, seo, performance, accessibility, security, visual
  key TEXT NOT NULL, -- clé unique du check dans la catégorie
  status TEXT NOT NULL, -- passed, warning, failed, inconclusive, skipped, running
  severity TEXT, -- critical, major, warning, info
  title TEXT,
  message TEXT,
  duration_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour performances
CREATE INDEX IF NOT EXISTS idx_checks_scan_id ON checks(scan_id);
CREATE INDEX IF NOT EXISTS idx_checks_page_id ON checks(page_id);
CREATE INDEX IF NOT EXISTS idx_checks_category ON checks(category);
CREATE INDEX IF NOT EXISTS idx_checks_status ON checks(status);

-- Table: issues
-- Problèmes détectés (issus des checks failed)
CREATE TABLE IF NOT EXISTS issues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scan_id UUID NOT NULL REFERENCES scans(id) ON DELETE CASCADE,
  page_id UUID REFERENCES pages(id) ON DELETE SET NULL,
  category TEXT NOT NULL,
  severity TEXT NOT NULL, -- critical, major, warning
  title TEXT NOT NULL,
  description TEXT,
  suggestion TEXT,
  confidence TEXT, -- high, medium, low
  status TEXT DEFAULT 'open', -- open, fixed, ignored
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour performances
CREATE INDEX IF NOT EXISTS idx_issues_scan_id ON issues(scan_id);
CREATE INDEX IF NOT EXISTS idx_issues_page_id ON issues(page_id);
CREATE INDEX IF NOT EXISTS idx_issues_severity ON issues(severity);
CREATE INDEX IF NOT EXISTS idx_issues_status ON issues(status);

-- Table: evidence
-- Preuves associées aux issues
CREATE TABLE IF NOT EXISTS evidence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scan_id UUID NOT NULL REFERENCES scans(id) ON DELETE CASCADE,
  issue_id UUID REFERENCES issues(id) ON DELETE SET NULL,
  type TEXT NOT NULL, -- url, action, network, console, screenshot, measurement
  payload JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour performances
CREATE INDEX IF NOT EXISTS idx_evidence_scan_id ON evidence(scan_id);
CREATE INDEX IF NOT EXISTS idx_evidence_issue_id ON evidence(issue_id);
CREATE INDEX IF NOT EXISTS idx_evidence_type ON evidence(type);

-- Table: screenshots
-- Screenshots capturés lors des tests
CREATE TABLE IF NOT EXISTS screenshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scan_id UUID NOT NULL REFERENCES scans(id) ON DELETE CASCADE,
  page_id UUID REFERENCES pages(id) ON DELETE SET NULL,
  issue_id UUID REFERENCES issues(id) ON DELETE SET NULL,
  viewport TEXT NOT NULL, -- mobile, tablet, desktop
  storage_path TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour performances
CREATE INDEX IF NOT EXISTS idx_screenshots_scan_id ON screenshots(scan_id);
CREATE INDEX IF NOT EXISTS idx_screenshots_page_id ON screenshots(page_id);
CREATE INDEX IF NOT EXISTS idx_screenshots_issue_id ON screenshots(issue_id);

-- RLS (Row Level Security)
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE screenshots ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour sites
CREATE POLICY "Users can view their own sites" ON sites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sites" ON sites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sites" ON sites
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sites" ON sites
  FOR DELETE USING (auth.uid() = user_id);

-- Politiques RLS pour scans
CREATE POLICY "Users can view their own scans" ON scans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own scans" ON scans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own scans" ON scans
  FOR UPDATE USING (auth.uid() = user_id);

-- Politiques RLS pour pages
CREATE POLICY "Users can view pages from their scans" ON pages
  FOR SELECT USING (
    scan_id IN (
      SELECT id FROM scans WHERE user_id = auth.uid()
    )
  );

-- Politiques RLS pour checks
CREATE POLICY "Users can view checks from their scans" ON checks
  FOR SELECT USING (
    scan_id IN (
      SELECT id FROM scans WHERE user_id = auth.uid()
    )
  );

-- Politiques RLS pour issues
CREATE POLICY "Users can view issues from their scans" ON issues
  FOR SELECT USING (
    scan_id IN (
      SELECT id FROM scans WHERE user_id = auth.uid()
    )
  );

-- Politiques RLS pour evidence
CREATE POLICY "Users can view evidence from their scans" ON evidence
  FOR SELECT USING (
    scan_id IN (
      SELECT id FROM scans WHERE user_id = auth.uid()
    )
  );

-- Politiques RLS pour screenshots
CREATE POLICY "Users can view screenshots from their scans" ON screenshots
  FOR SELECT USING (
    scan_id IN (
      SELECT id FROM scans WHERE user_id = auth.uid()
    )
  );

-- Trigger pour updated_at sur sites
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_sites_updated_at
  BEFORE UPDATE ON sites
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Ajouter la colonne last_scan_id après création de la table scans
ALTER TABLE sites ADD COLUMN IF NOT EXISTS last_scan_id UUID REFERENCES scans(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_sites_last_scan_id ON sites(last_scan_id);
