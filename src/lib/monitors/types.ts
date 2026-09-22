// Modèle front du "formulaire surveillé" — le seul objet métier de Reachly.
// Pas encore branché sur une table Supabase (le schéma actuel est celui de
// Reflet : brands/measurement_runs/opportunities…, aucun rapport). À
// remplacer par de vraies requêtes une fois la table `monitors` créée.

export type MonitorStatus = 'ok' | 'broken' | 'testing' | 'paused'

export interface MonitorStep {
  label: string
  ok: boolean
}

export interface MonitorIncident {
  id: string
  startedAt: string
  resolvedAt: string | null
  errorSummary: string
}

export interface Monitor {
  id: string
  url: string
  label: string | null
  status: MonitorStatus
  lastTestedAt: string | null
  nextTestAt: string | null
  lastSteps: MonitorStep[]
  lastErrorSummary: string | null
  aiDiagnosis: string | null
  screenshotUrl: string | null
  incidents: MonitorIncident[]
  alertEmails: string[]
  frequencyMinutes: number
}
