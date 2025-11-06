/**
 * LocalStorage fallback for when Supabase is not configured
 * Stores data locally in the browser
 */

import { HealthMetrics, HealthScore, InjuryRisk, AIRecommendation } from "@/types";

const STORAGE_KEYS = {
  HEALTH_METRICS: 'totalfit_health_metrics',
  HEALTH_SCORES: 'totalfit_health_scores',
  INJURY_RISKS: 'totalfit_injury_risks',
  RECOMMENDATIONS: 'totalfit_recommendations',
};

/**
 * Save health metrics to localStorage
 */
export function saveHealthMetrics(userId: string, metrics: HealthMetrics): void {
  console.log('[LocalStorage] 💾 Saving health metrics:', {
    userId: userId.substring(0, 8) + '...',
    date: metrics.date,
    steps: metrics.steps,
  });

  const existingData = getHealthMetrics(userId);
  
  // Remove existing entry for same date
  const filtered = existingData.filter(
    m => m.date.toDateString() !== metrics.date.toDateString()
  );
  
  // Add new entry
  filtered.push(metrics);
  
  // Sort by date (newest first)
  filtered.sort((a, b) => b.date.getTime() - a.date.getTime());
  
  // Store
  localStorage.setItem(
    `${STORAGE_KEYS.HEALTH_METRICS}_${userId}`,
    JSON.stringify(filtered)
  );
  
  console.log('[LocalStorage] ✅ Saved. Total records:', filtered.length);
}

/**
 * Get health metrics from localStorage
 */
export function getHealthMetrics(userId: string, days: number = 30): HealthMetrics[] {
  const data = localStorage.getItem(`${STORAGE_KEYS.HEALTH_METRICS}_${userId}`);
  
  if (!data) return [];
  
  try {
    const parsed = JSON.parse(data);
    return parsed.map((m: any) => ({
      ...m,
      date: new Date(m.date),
    }));
  } catch (error) {
    console.error('Error parsing health metrics:', error);
    return [];
  }
}

/**
 * Save health score to localStorage
 */
export function saveHealthScore(userId: string, score: HealthScore): void {
  const existingData = getHealthScores(userId);
  
  // Remove existing entry for same date
  const filtered = existingData.filter(
    s => s.date.toDateString() !== score.date.toDateString()
  );
  
  // Add new entry
  filtered.push(score);
  
  // Sort by date (newest first)
  filtered.sort((a, b) => b.date.getTime() - a.date.getTime());
  
  // Store
  localStorage.setItem(
    `${STORAGE_KEYS.HEALTH_SCORES}_${userId}`,
    JSON.stringify(filtered)
  );
}

/**
 * Get health scores from localStorage
 */
export function getHealthScores(userId: string): HealthScore[] {
  const data = localStorage.getItem(`${STORAGE_KEYS.HEALTH_SCORES}_${userId}`);
  
  if (!data) return [];
  
  try {
    const parsed = JSON.parse(data);
    return parsed.map((s: any) => ({
      ...s,
      date: new Date(s.date),
    }));
  } catch (error) {
    console.error('Error parsing health scores:', error);
    return [];
  }
}

/**
 * Get latest health score
 */
export function getLatestHealthScore(userId: string): HealthScore | null {
  const scores = getHealthScores(userId);
  return scores.length > 0 ? scores[0] : null;
}

/**
 * Save injury risk to localStorage
 */
export function saveInjuryRisk(userId: string, risk: InjuryRisk): void {
  const key = `${STORAGE_KEYS.INJURY_RISKS}_${userId}`;
  const existingData = getInjuryRisks(userId);
  
  // Keep only last 30 entries
  const filtered = existingData.slice(0, 29);
  filtered.unshift(risk);
  
  localStorage.setItem(key, JSON.stringify(filtered));
}

/**
 * Get injury risks from localStorage
 */
export function getInjuryRisks(userId: string): InjuryRisk[] {
  const data = localStorage.getItem(`${STORAGE_KEYS.INJURY_RISKS}_${userId}`);
  
  if (!data) return [];
  
  try {
    return JSON.parse(data);
  } catch (error) {
    console.error('Error parsing injury risks:', error);
    return [];
  }
}

/**
 * Get latest injury risk
 */
export function getLatestInjuryRisk(userId: string): InjuryRisk | null {
  const risks = getInjuryRisks(userId);
  return risks.length > 0 ? risks[0] : null;
}

/**
 * Save recommendations to localStorage
 */
export function saveRecommendations(userId: string, recommendations: AIRecommendation[]): void {
  const key = `${STORAGE_KEYS.RECOMMENDATIONS}_${userId}`;
  const existingData = getRecommendations(userId);
  
  // Combine and deduplicate by id
  const combined = [...recommendations, ...existingData];
  const unique = combined.filter(
    (rec, index, self) => index === self.findIndex(r => r.id === rec.id)
  );
  
  // Keep only last 50
  const limited = unique.slice(0, 50);
  
  localStorage.setItem(key, JSON.stringify(limited));
}

/**
 * Get recommendations from localStorage
 */
export function getRecommendations(userId: string): AIRecommendation[] {
  const data = localStorage.getItem(`${STORAGE_KEYS.RECOMMENDATIONS}_${userId}`);
  
  if (!data) return [];
  
  try {
    const parsed = JSON.parse(data);
    return parsed.map((r: any) => ({
      ...r,
      date: new Date(r.date),
    }));
  } catch (error) {
    console.error('Error parsing recommendations:', error);
    return [];
  }
}

/**
 * Get latest recommendations
 */
export function getLatestRecommendations(userId: string, limit: number = 5): AIRecommendation[] {
  const recs = getRecommendations(userId);
  return recs.slice(0, limit);
}

/**
 * Clear all data for a user
 */
export function clearAllData(userId: string): void {
  localStorage.removeItem(`${STORAGE_KEYS.HEALTH_METRICS}_${userId}`);
  localStorage.removeItem(`${STORAGE_KEYS.HEALTH_SCORES}_${userId}`);
  localStorage.removeItem(`${STORAGE_KEYS.INJURY_RISKS}_${userId}`);
  localStorage.removeItem(`${STORAGE_KEYS.RECOMMENDATIONS}_${userId}`);
}

/**
 * Check if Supabase is configured
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  const configured = !!(url && key && url !== '' && key !== '');
  
  console.log('[Config] 🔍 Checking Supabase configuration:', {
    hasUrl: !!url,
    hasKey: !!key,
    configured: configured,
  });
  
  return configured;
}

