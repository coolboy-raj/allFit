/**
 * Supabase Database Operations
 * CRUD operations for all tables
 */

import { supabase } from "./client";
import { User, HealthScore, HealthMetrics, AIRecommendation, InjuryRisk, WorkoutSession } from "@/types";

// ============================================
// USER OPERATIONS
// ============================================

/**
 * Create or update user
 */
export async function upsertUser(userData: {
  googleId: string;
  email: string;
  name: string;
  pictureUrl?: string;
  accessToken?: string;
  refreshToken?: string;
}) {
  console.log('[Supabase] 📝 Upserting user:', {
    googleId: userData.googleId,
    email: userData.email,
    name: userData.name,
  });

  const { data, error } = await supabase
    .from("users")
    .upsert(
      {
        id: userData.googleId, // Use Google ID as primary key
        google_id: userData.googleId,
        email: userData.email,
        name: userData.name,
        picture_url: userData.pictureUrl,
        access_token: userData.accessToken,
        refresh_token: userData.refreshToken,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "id",
      }
    )
    .select()
    .single();

  if (error) {
    console.error('[Supabase] ❌ Error upserting user:', error);
    throw error;
  }
  
  console.log('[Supabase] ✅ User upserted successfully:', data?.id);
  return data;
}

/**
 * Get user by Google ID
 */
export async function getUserByGoogleId(googleId: string) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("google_id", googleId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update user tokens
 */
export async function updateUserTokens(
  userId: string,
  accessToken: string,
  refreshToken: string
) {
  const { error } = await supabase
    .from("users")
    .update({
      access_token: accessToken,
      refresh_token: refreshToken,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (error) throw error;
}

/**
 * Update last sync time
 */
export async function updateLastSync(userId: string) {
  const { error } = await supabase
    .from("users")
    .update({
      last_sync_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (error) throw error;
}

// ============================================
// HEALTH SCORE OPERATIONS
// ============================================

/**
 * Insert or update health score
 */
export async function upsertHealthScore(
  userId: string,
  healthScore: HealthScore
) {
  console.log('[Supabase] 💯 Upserting health score:', {
    userId: userId.substring(0, 8) + '...',
    date: healthScore.date,
    overallScore: healthScore.overallScore,
  });

  const { data, error } = await supabase
    .from("health_scores")
    .upsert(
      {
        user_id: userId,
        date: new Date(healthScore.date).toISOString().split("T")[0],
        overall_score: healthScore.overallScore,
        activity_level: healthScore.activityLevel,
        sleep_quality: healthScore.sleepQuality,
        recovery_score: healthScore.recoveryScore,
        consistency: healthScore.consistency,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id,date",
      }
    )
    .select()
    .single();

  if (error) {
    console.error('[Supabase] ❌ Error upserting health score:', error);
    throw error;
  }
  
  console.log('[Supabase] ✅ Health score upserted successfully');
  return data;
}

/**
 * Get health scores for date range
 */
export async function getHealthScores(
  userId: string,
  startDate: Date,
  endDate: Date
) {
  const { data, error } = await supabase
    .from("health_scores")
    .select("*")
    .eq("user_id", userId)
    .gte("date", startDate.toISOString().split("T")[0])
    .lte("date", endDate.toISOString().split("T")[0])
    .order("date", { ascending: true });

  if (error) throw error;
  return data;
}

/**
 * Get latest health score
 */
export async function getLatestHealthScore(userId: string) {
  const { data, error } = await supabase
    .from("health_scores")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false })
    .limit(1)
    .single();

  if (error) throw error;
  return data;
}

// ============================================
// HEALTH METRICS OPERATIONS
// ============================================

/**
 * Insert or update health metrics
 */
export async function upsertHealthMetrics(
  userId: string,
  metrics: HealthMetrics
) {
  console.log('[Supabase] 📊 Upserting health metrics:', {
    userId: userId.substring(0, 8) + '...',
    date: metrics.date,
    steps: metrics.steps,
    activeMinutes: metrics.activeMinutes,
    sleepHours: metrics.sleepHours,
  });

  const { data, error } = await supabase
    .from("health_metrics")
    .upsert(
      {
        user_id: userId,
        date: new Date(metrics.date).toISOString().split("T")[0],
        steps: metrics.steps,
        active_minutes: metrics.activeMinutes,
        heart_rate_avg: metrics.heartRate,
        sleep_hours: metrics.sleepHours,
        calories_burned: metrics.caloriesBurned,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id,date",
      }
    )
    .select()
    .single();

  if (error) {
    console.error('[Supabase] ❌ Error upserting health metrics:', error);
    throw error;
  }
  
  console.log('[Supabase] ✅ Health metrics upserted successfully:', data?.id);
  return data;
}

/**
 * Get health metrics for date range
 */
export async function getHealthMetrics(
  userId: string,
  startDate: Date,
  endDate: Date
) {
  console.log('[Supabase] 🔍 Fetching health metrics:', {
    userId: userId.substring(0, 8) + '...',
    startDate: startDate.toISOString().split("T")[0],
    endDate: endDate.toISOString().split("T")[0],
  });

  const { data, error } = await supabase
    .from("health_metrics")
    .select("*")
    .eq("user_id", userId)
    .gte("date", startDate.toISOString().split("T")[0])
    .lte("date", endDate.toISOString().split("T")[0])
    .order("date", { ascending: true });

  if (error) {
    console.error('[Supabase] ❌ Error fetching health metrics:', error);
    throw error;
  }
  
  console.log('[Supabase] ✅ Fetched', data?.length || 0, 'health metric records');
  return data;
}

// ============================================
// INJURY RISK OPERATIONS
// ============================================

/**
 * Insert injury risk assessment
 */
export async function insertInjuryRisk(userId: string, injuryRisk: InjuryRisk) {
  console.log('[Supabase] ⚠️ Inserting injury risk:', {
    userId: userId.substring(0, 8) + '...',
    level: injuryRisk.level,
    score: injuryRisk.score,
  });

  const { data, error } = await supabase
    .from("injury_risk_assessments")
    .upsert(
      {
        user_id: userId,
        date: new Date().toISOString().split("T")[0],
        risk_level: injuryRisk.level,
        risk_score: injuryRisk.score,
        risk_factors: injuryRisk.factors,
        recommendations: injuryRisk.recommendations,
      },
      {
        onConflict: "user_id,date",
      }
    )
    .select()
    .single();

  if (error) {
    console.error('[Supabase] ❌ Error inserting injury risk:', error);
    throw error;
  }
  
  console.log('[Supabase] ✅ Injury risk inserted successfully');
  return data;
}

/**
 * Get latest injury risk assessment
 */
export async function getLatestInjuryRisk(userId: string) {
  const { data, error } = await supabase
    .from("injury_risk_assessments")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false })
    .limit(1)
    .single();

  if (error) throw error;
  return data;
}

// ============================================
// AI RECOMMENDATIONS OPERATIONS
// ============================================

/**
 * Insert AI recommendations
 */
export async function insertRecommendations(
  userId: string,
  recommendations: AIRecommendation[]
) {
  console.log('[Supabase] 🤖 Inserting', recommendations.length, 'AI recommendations for user:', userId.substring(0, 8) + '...');

  const recs = recommendations.map((rec) => ({
    user_id: userId,
    date: new Date(rec.date).toISOString().split("T")[0],
    type: rec.type,
    title: rec.title,
    description: rec.description,
    priority: rec.priority,
    completed: rec.completed,
  }));

  const { data, error } = await supabase
    .from("ai_recommendations")
    .insert(recs)
    .select();

  if (error) {
    console.error('[Supabase] ❌ Error inserting recommendations:', error);
    throw error;
  }
  
  console.log('[Supabase] ✅ Recommendations inserted successfully:', data?.length || 0);
  return data;
}

/**
 * Get recommendations for date range
 */
export async function getRecommendations(
  userId: string,
  startDate: Date,
  endDate: Date
) {
  const { data, error } = await supabase
    .from("ai_recommendations")
    .select("*")
    .eq("user_id", userId)
    .gte("date", startDate.toISOString().split("T")[0])
    .lte("date", endDate.toISOString().split("T")[0])
    .order("priority", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Get latest recommendations
 */
export async function getLatestRecommendations(userId: string, limit: number = 5) {
  const { data, error } = await supabase
    .from("ai_recommendations")
    .select("*")
    .eq("user_id", userId)
    .eq("completed", false)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

/**
 * Mark recommendation as completed
 */
export async function markRecommendationCompleted(recommendationId: string) {
  const { error } = await supabase
    .from("ai_recommendations")
    .update({
      completed: true,
      completed_at: new Date().toISOString(),
    })
    .eq("id", recommendationId);

  if (error) throw error;
}

// ============================================
// SYNC OPERATIONS
// ============================================

/**
 * Create sync log entry
 */
export async function createSyncLog(userId: string) {
  const { data, error } = await supabase
    .from("sync_logs")
    .insert({
      user_id: userId,
      sync_start_time: new Date().toISOString(),
      status: "pending",
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update sync log on completion
 */
export async function completeSyncLog(
  logId: string,
  success: boolean,
  recordsSynced: number = 0,
  errorMessage?: string
) {
  const { error } = await supabase
    .from("sync_logs")
    .update({
      sync_end_time: new Date().toISOString(),
      status: success ? "success" : "failed",
      records_synced: recordsSynced,
      error_message: errorMessage,
    })
    .eq("id", logId);

  if (error) throw error;
}

// ============================================
// WORKOUT SESSION OPERATIONS
// ============================================

/**
 * Save workout session
 */
export async function saveWorkoutSession(workoutSession: WorkoutSession) {
  console.log('[Supabase] 💪 Saving workout session:', {
    userId: workoutSession.userId.substring(0, 8) + '...',
    exerciseType: workoutSession.exerciseType,
    totalReps: workoutSession.totalReps,
    averageFormScore: workoutSession.averageFormScore,
  });

  const { data, error } = await supabase
    .from("workout_sessions")
    .insert({
      id: workoutSession.id,
      user_id: workoutSession.userId,
      exercise_type: workoutSession.exerciseType,
      sets: workoutSession.sets,
      start_time: workoutSession.startTime.toISOString(),
      end_time: workoutSession.endTime?.toISOString(),
      total_reps: workoutSession.totalReps,
      average_form_score: workoutSession.averageFormScore,
      completed: workoutSession.completed,
    })
    .select()
    .single();

  if (error) {
    console.error('[Supabase] ❌ Error saving workout session:', error);
    throw error;
  }
  
  console.log('[Supabase] ✅ Workout session saved successfully:', data?.id);
  return data;
}

/**
 * Get workout sessions for a user
 */
export async function getWorkoutSessions(
  userId: string,
  startDate?: Date,
  endDate?: Date,
  exerciseType?: string
) {
  let query = supabase
    .from("workout_sessions")
    .select("*")
    .eq("user_id", userId)
    .order("start_time", { ascending: false });

  if (startDate) {
    query = query.gte("start_time", startDate.toISOString());
  }

  if (endDate) {
    query = query.lte("start_time", endDate.toISOString());
  }

  if (exerciseType) {
    query = query.eq("exercise_type", exerciseType);
  }

  const { data, error } = await query;

  if (error) {
    console.error('[Supabase] ❌ Error fetching workout sessions:', error);
    throw error;
  }
  
  return data;
}

/**
 * Get workout statistics for a user
 */
export async function getWorkoutStats(userId: string, days: number = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabase
    .from("workout_sessions")
    .select("*")
    .eq("user_id", userId)
    .eq("completed", true)
    .gte("start_time", startDate.toISOString());

  if (error) throw error;
  
  // Calculate stats
  const totalWorkouts = data?.length || 0;
  const totalReps = data?.reduce((sum, session) => sum + session.total_reps, 0) || 0;
  const averageFormScore = totalWorkouts > 0
    ? data.reduce((sum, session) => sum + session.average_form_score, 0) / totalWorkouts
    : 0;

  return {
    totalWorkouts,
    totalReps,
    averageFormScore,
    sessions: data,
  };
}

