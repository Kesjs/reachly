#!/usr/bin/env node

/**
 * Script pour appliquer la migration Reachly V1 sur Supabase
 * Utilise l'API REST PostgreSQL directement via fetch
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration - lire depuis .env.local si disponible
let SUPABASE_URL = 'https://wdvzopitnulgvptsopcj.supabase.co';
let SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkdnpvcGl0bnVsZ3ZwdHNvcGNqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDE3MjE1MywiZXhwIjoyMTA1NzQ4MTUzfQ.xyo4paztn5f-wfYylgGDaCCQicYf9XKrYPYtr-Qo980';

try {
  const envContent = readFileSync(join(__dirname, '..', '.env.local'), 'utf-8');
  const urlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/);
  const keyMatch = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/);
  
  if (urlMatch) SUPABASE_URL = urlMatch[1].trim();
  if (keyMatch) SUPABASE_SERVICE_ROLE_KEY = keyMatch[1].trim();
  
  console.log('✅ Configuration chargée depuis .env.local');
} catch (error) {
  console.log('ℹ️  .env.local non trouvé, utilisation des valeurs par défaut');
}

async function applyMigration() {
  try {
    console.log('🚀 Application de la migration Reachly V1...');

    // Lire le fichier de migration
    const migrationPath = join(__dirname, '..', 'supabase', 'migrations', '20260923162100_reachly_v1_schema.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf-8');

    console.log('📄 Fichier de migration lu:', migrationPath);

    // Info sur comment appliquer la migration
    console.log('⚠️  Note: Pour appliquer cette migration, utilisez le dashboard Supabase:');
    console.log('   1. Allez sur https://supabase.com/dashboard/project/wdvzopitnulgvptsopcj/sql');
    console.log('   2. Copiez le contenu du fichier migration');
    console.log('   3. Collez-le dans l\'éditeur SQL et exécutez-le');
    console.log('');
    console.log('📋 Voici le contenu de la migration à copier:');
    console.log('─'.repeat(50));
    console.log(migrationSQL);
    console.log('─'.repeat(50));
    console.log('');
    console.log('✅ Script terminé. Veuillez appliquer la migration manuellement via le dashboard.');

  } catch (error) {
    console.error('❌ Erreur lors de l\'application de la migration:', error);
    process.exit(1);
  }
}

applyMigration();
