// API endpoints pour le moteur QA Reachly

import { createClient } from '@supabase/supabase-js';
import { Database } from '../../supabase/database.types';
import { QAOrchestrator, QAConfigManager } from '../../qa';

// Singleton pour l'orchestrateur
let orchestratorInstance: QAOrchestrator | null = null;

function getOrchestrator(): QAOrchestrator {
  if (!orchestratorInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Configuration Supabase manquante');
    }

    orchestratorInstance = new QAOrchestrator(supabaseUrl, supabaseKey);
  }
  return orchestratorInstance;
}

// Créer un nouveau site
export async function createSite(userId: string, url: string, name?: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
  
  const supabase = createClient<Database>(supabaseUrl!, supabaseKey!);
  
  const { data, error } = await supabase
    .from('sites')
    .insert({
      user_id: userId,
      url,
      name: name || extractDomainFromUrl(url)
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Erreur lors de la création du site: ${error.message}`);
  }

  return data;
}

// Lancer un scan QA
export async function startQAScan(
  siteId: string,
  userId: string,
  url: string,
  plan: 'quick' | 'full' | 'delivery' = 'full',
  consentConfirmedAt?: string | null
) {
  const config = getConfigForPlan(plan);
  const orchestrator = getOrchestrator();

  // Lancer le scan de manière asynchrone
  const scanPromise = orchestrator.runScan({
    siteId,
    userId,
    url,
    config,
    // NB: l'orchestrateur (§7) n'écrit pas encore réellement la ligne
    // `scans` — quand ce sera branché, consentConfirmedAt doit être
    // passé tel quel dans l'insert (`scans.consent_confirmed_at`).
    // Le refus est déjà bloqué côté client dans NewQAModal.
    consentConfirmedAt
  });

  // Retourner immédiatement avec l'ID du scan (sera créé dans l'orchestrateur)
  // Pour l'instant, on retourne un scanId fictif
  const scanId = crypto.randomUUID();
  
  // Ne pas attendre la fin du scan - exécution en arrière-plan
  scanPromise.catch((error: unknown) => {
    console.error('Erreur lors du scan QA:', error);
  });

  return { scanId, status: 'started' };
}

// Obtenir le statut d'un scan
export async function getScanStatus(scanId: string) {
  const orchestrator = getOrchestrator();
  return await orchestrator.getScanStatus(scanId);
}

// Obtenir les résultats d'un scan
export async function getScanResults(scanId: string) {
  const orchestrator = getOrchestrator();
  return await orchestrator.getScanResult(scanId);
}

// Obtenir les sites d'un utilisateur
export async function getUserSites(userId: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
  
  const supabase = createClient<Database>(supabaseUrl!, supabaseKey!);
  
  const { data, error } = await supabase
    .from('sites')
    .select(`
      *,
      scans (
        id,
        status,
        created_at,
        completed_at,
        pages_discovered,
        checks_total,
        checks_passed,
        checks_warning,
        checks_failed,
        critical_count,
        major_count,
        summary
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Erreur lors de la récupération des sites: ${error.message}`);
  }

  return data;
}

// Obtenir un site spécifique
export async function getSite(siteId: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
  
  const supabase = createClient<Database>(supabaseUrl!, supabaseKey!);
  
  const { data, error } = await supabase
    .from('sites')
    .select(`
      *,
      scans (
        id,
        status,
        created_at,
        completed_at,
        pages_discovered,
        checks_total,
        checks_passed,
        checks_warning,
        checks_failed,
        critical_count,
        major_count,
        summary
      )
    `)
    .eq('id', siteId)
    .single();

  if (error) {
    throw new Error(`Erreur lors de la récupération du site: ${error.message}`);
  }

  return data;
}

// Relancer un scan (retest)
export async function retestScan(siteId: string, userId: string, url: string, previousScanId?: string) {
  const orchestrator = getOrchestrator();
  
  const scanPromise = orchestrator.runScan({
    siteId,
    userId,
    url,
    previousScanId
  });

  const scanId = crypto.randomUUID();
  
  scanPromise.catch((error: unknown) => {
    console.error('Erreur lors du retest:', error);
  });

  return { scanId, status: 'started' };
}

// Supprimer un site
export async function deleteSite(siteId: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
  
  const supabase = createClient<Database>(supabaseUrl!, supabaseKey!);
  
  const { error } = await supabase
    .from('sites')
    .delete()
    .eq('id', siteId);

  if (error) {
    throw new Error(`Erreur lors de la suppression du site: ${error.message}`);
  }

  return { success: true };
}

// Fonctions utilitaires
function extractDomainFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return url;
  }
}

function getConfigForPlan(plan: 'quick' | 'full' | 'delivery'): QAConfigManager {
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
