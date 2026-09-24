-- Ajoute un message de progression lisible sur scans, mis à jour en direct
-- par l'orchestrateur pendant le pipeline (discovery, crawl, test de chaque
-- page, analyse, rapport). Permet à l'UI d'afficher autre chose qu'une
-- barre de progression générique pendant les scans longs.
ALTER TABLE scans ADD COLUMN IF NOT EXISTS current_step TEXT;

COMMENT ON COLUMN scans.current_step IS 'Message de progression lisible (ex: "Test de la page 3/12 : /contact"), mis à jour en direct par l''orchestrateur pendant le scan.';
