/**
 * Health Data Service
 * Main service that orchestrates Google Fit data fetching, AI analysis, and database storage
 */

import { fetchGoogleFitData, fetchLastNDays } from "../api/googleFit";
import { calculateHealthScore } from "../ai/healthScoring";
import { calculateInjuryRisk } from "../ai/injuryRisk";
import { generateRecommendations } from "../ai/recommendations";
import {
  upsertHealthScore,
  upsertHealthMetrics,
  insertInjuryRisk,
  insertRecommendations,
  getHealthMetrics,
  getLatestHealthScore,
  getLatestInjuryRisk,
  getLatestRecommendations,
  updateLastSync,
  createSyncLog,
  completeSyncLog,
} from "../supabase/database";
import { DashboardData, HealthMetrics, GoogleFitData } from "@/types";

/**
 * Sync user data from Google Fit
 * Fetches last 7 days of data, processes it, and stores in database
 */
export async function syncGoogleFitData(
  userId: string,
  accessToken: string
): Promise<{ success: boolean; message: string; recordsSynced: number }> {
  // Create sync log
  const syncLog = await createSyncLog(userId);

  try {
    // Fetch last 7 days of data from Google Fit
    const googleFitDataArray = await fetchLastNDays(accessToken, 7);

    // Convert Google Fit data to HealthMetrics
    const healthMetrics: HealthMetrics[] = googleFitDataArray.map((data, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index));

      return convertGoogleFitToHealthMetrics(data, date);
    });

    // Store metrics in database
    for (const metric of healthMetrics) {
      await upsertHealthMetrics(userId, metric);
    }

    // Calculate and store health score
    const healthScore = calculateHealthScore(healthMetrics);
    await upsertHealthScore(userId, healthScore);

    // Calculate and store injury risk
    const injuryRisk = calculateInjuryRisk(healthMetrics);
    await insertInjuryRisk(userId, injuryRisk);

    // Generate and store AI recommendations
    const recommendations = generateRecommendations(
      healthMetrics,
      healthScore,
      injuryRisk,
      userId
    );
    await insertRecommendations(userId, recommendations);

    // Update last sync time
    await updateLastSync(userId);

    // Complete sync log
    await completeSyncLog(syncLog.id, true, healthMetrics.length);

    return {
      success: true,
      message: "Data synced successfully",
      recordsSynced: healthMetrics.length,
    };
  } catch (error) {
    console.error("Sync error:", error);
    await completeSyncLog(
      syncLog.id,
      false,
      0,
      error instanceof Error ? error.message : "Unknown error"
    );

    return {
      success: false,
      message: "Failed to sync data",
      recordsSynced: 0,
    };
  }
}

/**
 * Get dashboard data for a user
 * Fetches all necessary data from database or uses mock data if unavailable
 */
export async function getDashboardData(userId: string): Promise<DashboardData> {
  try {
    // Fetch data from database
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    const [healthMetricsData, latestHealthScore, latestInjuryRisk, recommendations] = 
      await Promise.all([
        getHealthMetrics(userId, startDate, endDate),
        getLatestHealthScore(userId),
        getLatestInjuryRisk(userId),
        getLatestRecommendations(userId, 5),
      ]);

    // Convert database records to app types
    const weeklyMetrics: HealthMetrics[] = healthMetricsData.map((record) => ({
      date: new Date(record.date),
      steps: record.steps,
      activeMinutes: record.active_minutes,
      heartRate: record.heart_rate_avg,
      sleepHours: record.sleep_hours,
      caloriesBurned: record.calories_burned,
      workoutSessions: [], // TODO: Fetch from workout_sessions table
    }));

    return {
      user: {
        id: userId,
        email: "",
        name: "",
        googleId: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      healthScore: {
        id: latestHealthScore.id,
        userId: latestHealthScore.user_id,
        date: new Date(latestHealthScore.date),
        overallScore: latestHealthScore.overall_score,
        activityLevel: latestHealthScore.activity_level,
        sleepQuality: latestHealthScore.sleep_quality,
        recoveryScore: latestHealthScore.recovery_score,
        consistency: latestHealthScore.consistency,
      },
      injuryRisk: {
        level: latestInjuryRisk.risk_level,
        score: latestInjuryRisk.risk_score,
        factors: latestInjuryRisk.risk_factors,
        recommendations: latestInjuryRisk.recommendations,
      },
      weeklyMetrics,
      recommendations: recommendations.map((rec) => ({
        id: rec.id,
        userId: rec.user_id,
        date: new Date(rec.date),
        type: rec.type as any,
        title: rec.title,
        description: rec.description,
        priority: rec.priority as any,
        completed: rec.completed,
      })),
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    // Return mock data if database fetch fails
    const { mockDashboardData } = require("../mockData");
    return mockDashboardData;
  }
}

/**
 * Convert Google Fit data to HealthMetrics
 */
function convertGoogleFitToHealthMetrics(
  googleFitData: GoogleFitData,
  date: Date
): HealthMetrics {
  return {
    date,
    steps: googleFitData.steps,
    activeMinutes: googleFitData.activeMinutes,
    heartRate: googleFitData.heartRate.average,
    sleepHours: googleFitData.sleep.duration / 60, // Convert minutes to hours
    caloriesBurned: googleFitData.calories,
    workoutSessions: googleFitData.activities.map((activity) => ({
      type: activity.type,
      duration: activity.duration,
      intensity: determineIntensity(activity.duration, activity.calories),
      caloriesBurned: activity.calories,
      startTime: new Date(activity.startTime),
      endTime: new Date(activity.endTime),
    })),
  };
}

/**
 * Determine workout intensity based on duration and calories
 */
function determineIntensity(
  duration: number,
  calories: number
): "low" | "medium" | "high" {
  const caloriesPerMinute = calories / duration;

  if (caloriesPerMinute > 10) return "high";
  if (caloriesPerMinute > 6) return "medium";
  return "low";
}

/**
 * Calculate statistics from health metrics
 */
export function calculateStats(metrics: HealthMetrics[]) {
  if (metrics.length === 0) {
    return {
      avgSteps: 0,
      avgActiveMinutes: 0,
      avgSleep: 0,
      totalCalories: 0,
      activeDays: 0,
    };
  }

  return {
    avgSteps: Math.round(
      metrics.reduce((sum, m) => sum + m.steps, 0) / metrics.length
    ),
    avgActiveMinutes: Math.round(
      metrics.reduce((sum, m) => sum + m.activeMinutes, 0) / metrics.length
    ),
    avgSleep: parseFloat(
      (metrics.reduce((sum, m) => sum + m.sleepHours, 0) / metrics.length).toFixed(1)
    ),
    totalCalories: metrics.reduce((sum, m) => sum + m.caloriesBurned, 0),
    activeDays: metrics.filter((m) => m.activeMinutes > 20).length,
  };
}

/**
 * Export health data to CSV
 */
export function exportToCSV(metrics: HealthMetrics[]): string {
  const headers = [
    "Date",
    "Steps",
    "Active Minutes",
    "Heart Rate",
    "Sleep Hours",
    "Calories Burned",
    "Workouts",
  ];

  const rows = metrics.map((m) => [
    m.date.toISOString().split("T")[0],
    m.steps.toString(),
    m.activeMinutes.toString(),
    m.heartRate.toString(),
    m.sleepHours.toFixed(1),
    m.caloriesBurned.toString(),
    m.workoutSessions.length.toString(),
  ]);

  const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
  return csv;
}

