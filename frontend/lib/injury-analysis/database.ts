/**
 * Injury Analysis Database Operations
 * Frontend API client for injury analysis backend
 */

const INJURY_API_URL = process.env.NEXT_PUBLIC_INJURY_API_URL || 'http://localhost:5000';

export interface Athlete {
  id: string;
  user_id?: string;
  name: string;
  email?: string;
  age?: number;
  position?: string;
  height?: string;
  weight?: string;
  primary_sport?: string;
  team?: string;
  status: 'active' | 'recovering' | 'injured';
  created_at?: string;
  updated_at?: string;
}

export interface WorkoutExercise {
  id: string;
  exercise: string;
  sets: number;
  reps: number;
  weight: number;
  intensity: string;
  notes: string;
}

export interface InjuryEntry {
  id: string;
  bodyPart: string;
  injuryType: string;
  severity: string;
  timeOccurred: string;
  mechanism: string;
  notes: string;
}

export interface ActivityLog {
  id?: string;
  athlete_id: string;
  activity_type: 'workout' | 'sports';
  date: string;
  start_time?: string;
  duration: number;
  
  // Workout fields
  workout_type?: string;
  exercises?: WorkoutExercise[];
  equipment_used?: string[];
  
  // Sports fields
  sport?: string;
  position?: string;
  match_type?: string;
  location?: string;
  opponent?: string;
  result?: string;
  minutes_played?: number;
  intensity_level?: string;
  performance_metrics?: {
    sprintDistance?: number;
    topSpeed?: number;
    jumps?: number;
    tackles?: number;
  };
  injuries?: InjuryEntry[];
  medical_attention?: string;
  surface_type?: string;
  weather_conditions?: string;
  
  // Common fields
  heart_rate_avg?: number;
  heart_rate_max?: number;
  calories_burned?: number;
  affected_body_parts?: string[];
  recovery_status: string;
  fatigue_level?: number;
  notes?: string;
  coach_feedback?: string;
  
  created_at?: string;
  updated_at?: string;
}

export interface BodyPartWorkload {
  id: string;
  athlete_id: string;
  body_part: string;
  date: string;
  workload_score: number;
  cumulative_7day: number;
  cumulative_30day: number;
  injury_risk_percentage: number;
  risk_level: 'minimal' | 'low' | 'medium' | 'high' | 'critical';
  recovery_rate: number;
  days_since_last_activity: number;
  activity_count: number;
  total_duration: number;
  avg_intensity: number;
  created_at?: string;
  updated_at?: string;
}

export interface InjuryRiskSnapshot {
  id: string;
  athlete_id: string;
  date: string;
  overall_risk_score: number;
  risk_level: 'minimal' | 'low' | 'medium' | 'high' | 'critical';
  training_load_score: number;
  fatigue_index: number;
  recovery_score: number;
  high_risk_body_parts: string[];
  medium_risk_body_parts: string[];
  recommendations: Array<{
    priority: string;
    title: string;
    description: string;
  }>;
  created_at?: string;
}

export interface BodyPartRisk {
  part: string;
  risk: string;
  percentage: number;
  message: string;
}

export interface InjuryRiskAnalysis {
  body_part_risks: BodyPartRisk[];
  overall_risk: InjuryRiskSnapshot | null;
  workloads: BodyPartWorkload[];
}

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Create or update athlete profile
 */
export async function createOrUpdateAthlete(athleteData: Partial<Athlete>): Promise<Athlete> {
  const response = await fetch(`${INJURY_API_URL}/api/athletes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(athleteData),
  });

  if (!response.ok) {
    throw new Error('Failed to create/update athlete');
  }

  const result = await response.json();
  return result.data;
}

/**
 * Get athlete by ID
 */
export async function getAthlete(athleteId: string): Promise<Athlete> {
  const response = await fetch(`${INJURY_API_URL}/api/athletes/${athleteId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch athlete');
  }

  const result = await response.json();
  return result.data;
}

/**
 * Get all athletes for a user
 */
export async function getUserAthletes(userId: string): Promise<Athlete[]> {
  const response = await fetch(`${INJURY_API_URL}/api/users/${userId}/athletes`);

  if (!response.ok) {
    throw new Error('Failed to fetch user athletes');
  }

  const result = await response.json();
  return result.data;
}

/**
 * Update athlete profile
 */
export async function updateAthlete(athleteId: string, athleteData: Partial<Athlete>): Promise<Athlete> {
  const response = await fetch(`${INJURY_API_URL}/api/athletes/${athleteId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(athleteData),
  });

  if (!response.ok) {
    throw new Error('Failed to update athlete');
  }

  const result = await response.json();
  return result.data;
}

/**
 * Delete athlete
 */
export async function deleteAthlete(athleteId: string): Promise<void> {
  const response = await fetch(`${INJURY_API_URL}/api/athletes/${athleteId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete athlete');
  }
}

/**
 * Log a new activity (workout or sports)
 */
export async function logActivity(activityData: ActivityLog): Promise<{
  activity: ActivityLog;
  workload_updates: BodyPartWorkload[];
  injury_risk: InjuryRiskSnapshot | null;
}> {
  const response = await fetch(`${INJURY_API_URL}/api/activities/log`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(activityData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to log activity');
  }

  const result = await response.json();
  return result.data;
}

/**
 * Get injury risk analysis for athlete
 */
export async function getInjuryRiskAnalysis(
  athleteId: string,
  date?: string
): Promise<InjuryRiskAnalysis> {
  const url = new URL(`${INJURY_API_URL}/api/athletes/${athleteId}/injury-risk`);
  if (date) {
    url.searchParams.append('date', date);
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error('Failed to fetch injury risk analysis');
  }

  const result = await response.json();
  return result.data;
}

/**
 * Get activity history for athlete
 */
export async function getActivityHistory(
  athleteId: string,
  limit: number = 50,
  offset: number = 0
): Promise<ActivityLog[]> {
  const url = new URL(`${INJURY_API_URL}/api/athletes/${athleteId}/activities`);
  url.searchParams.append('limit', limit.toString());
  url.searchParams.append('offset', offset.toString());

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error('Failed to fetch activity history');
  }

  const result = await response.json();
  return result.data;
}

/**
 * Get single activity by ID
 */
export async function getActivity(activityId: string): Promise<ActivityLog> {
  const response = await fetch(`${INJURY_API_URL}/api/activities/${activityId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch activity');
  }

  const result = await response.json();
  return result.data;
}

/**
 * Update an activity
 */
export async function updateActivity(
  activityId: string,
  updateData: Partial<ActivityLog>
): Promise<{
  activity: ActivityLog;
  injury_risk: InjuryRiskSnapshot | null;
}> {
  const response = await fetch(`${INJURY_API_URL}/api/activities/${activityId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update activity');
  }

  const result = await response.json();
  return result.data;
}

/**
 * Delete an activity
 */
export async function deleteActivity(activityId: string): Promise<{
  message: string;
  athlete_id: string;
}> {
  const response = await fetch(`${INJURY_API_URL}/api/activities/${activityId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete activity');
  }

  const result = await response.json();
  return result;
}

/**
 * Trigger daily recovery update (admin function)
 */
export async function triggerDailyRecoveryUpdate(): Promise<void> {
  const response = await fetch(`${INJURY_API_URL}/api/recovery/daily-update`, {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('Failed to trigger recovery update');
  }
}

/**
 * Health check
 */
export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${INJURY_API_URL}/health`);
    return response.ok;
  } catch (error) {
    return false;
  }
}

