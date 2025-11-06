/**
 * AI Health Scoring Algorithms
 * Calculates health scores based on activity, sleep, and recovery data
 */

import { HealthMetrics, HealthScore } from "@/types";

/**
 * Calculate overall health score (0-100)
 * Based on weighted average of multiple factors
 */
export function calculateHealthScore(metrics: HealthMetrics[]): HealthScore {
  if (metrics.length === 0) {
    return {
      id: "",
      userId: "",
      date: new Date(),
      overallScore: 0,
      activityLevel: 0,
      sleepQuality: 0,
      recoveryScore: 0,
      consistency: 0,
    };
  }

  const latestMetric = metrics[metrics.length - 1];
  
  const activityLevel = calculateActivityLevel(metrics);
  const sleepQuality = calculateSleepQuality(metrics);
  const recoveryScore = calculateRecoveryScore(metrics);
  const consistency = calculateConsistency(metrics);

  // Weighted average (Activity: 30%, Sleep: 25%, Recovery: 30%, Consistency: 15%)
  const overallScore = Math.round(
    activityLevel * 0.30 +
    sleepQuality * 0.25 +
    recoveryScore * 0.30 +
    consistency * 0.15
  );

  return {
    id: `hs_${Date.now()}`,
    userId: "",
    date: latestMetric.date,
    overallScore,
    activityLevel,
    sleepQuality,
    recoveryScore,
    consistency,
  };
}

/**
 * Calculate activity level score (0-100)
 * Based on steps, active minutes, and workout intensity
 */
export function calculateActivityLevel(metrics: HealthMetrics[]): number {
  if (metrics.length === 0) return 0;

  const latestMetric = metrics[metrics.length - 1];
  
  // Target: 10,000 steps per day
  const stepScore = Math.min((latestMetric.steps / 10000) * 100, 100);
  
  // Target: 60 active minutes per day
  const activeMinutesScore = Math.min((latestMetric.activeMinutes / 60) * 100, 100);
  
  // Workout sessions bonus
  const workoutBonus = Math.min(latestMetric.workoutSessions.length * 10, 20);

  const score = Math.round((stepScore * 0.5 + activeMinutesScore * 0.5 + workoutBonus) * 0.9);
  return Math.min(score, 100);
}

/**
 * Calculate sleep quality score (0-100)
 * Based on sleep duration and consistency
 */
export function calculateSleepQuality(metrics: HealthMetrics[]): number {
  if (metrics.length === 0) return 0;

  const recentMetrics = metrics.slice(-7); // Last 7 days
  const avgSleep = recentMetrics.reduce((sum, m) => sum + m.sleepHours, 0) / recentMetrics.length;
  
  // Optimal sleep: 7-9 hours
  let sleepScore = 0;
  if (avgSleep >= 7 && avgSleep <= 9) {
    sleepScore = 100;
  } else if (avgSleep >= 6 && avgSleep < 7) {
    sleepScore = 70 + ((avgSleep - 6) * 30);
  } else if (avgSleep > 9 && avgSleep <= 10) {
    sleepScore = 70 + ((10 - avgSleep) * 30);
  } else if (avgSleep >= 5 && avgSleep < 6) {
    sleepScore = 40 + ((avgSleep - 5) * 30);
  } else if (avgSleep > 10 && avgSleep <= 11) {
    sleepScore = 40 + ((11 - avgSleep) * 30);
  } else {
    sleepScore = 20;
  }

  // Consistency bonus (less variation = better)
  const sleepVariation = calculateStandardDeviation(recentMetrics.map(m => m.sleepHours));
  const consistencyBonus = Math.max(0, 20 - (sleepVariation * 10));

  return Math.round(Math.min(sleepScore + consistencyBonus, 100));
}

/**
 * Calculate recovery score (0-100)
 * Based on rest days, heart rate, and training load
 */
export function calculateRecoveryScore(metrics: HealthMetrics[]): number {
  if (metrics.length < 7) return 50; // Default if not enough data

  const recentMetrics = metrics.slice(-7);
  
  // Count rest days (days with < 30 active minutes)
  const restDays = recentMetrics.filter(m => m.activeMinutes < 30).length;
  const restDayScore = Math.min((restDays / 2) * 100, 100); // Target: 2 rest days per week
  
  // Heart rate indicator (lower resting heart rate = better recovery)
  const avgHeartRate = recentMetrics.reduce((sum, m) => sum + m.heartRate, 0) / recentMetrics.length;
  let heartRateScore = 100;
  if (avgHeartRate > 80) heartRateScore = 50;
  else if (avgHeartRate > 70) heartRateScore = 75;
  else heartRateScore = 100;

  // Training load balance
  const trainingLoad = recentMetrics.reduce((sum, m) => sum + m.activeMinutes, 0);
  const avgTrainingLoad = trainingLoad / 7;
  let loadScore = 100;
  if (avgTrainingLoad > 90) loadScore = 60; // Too much
  else if (avgTrainingLoad < 30) loadScore = 70; // Too little
  else loadScore = 100;

  return Math.round((restDayScore * 0.4 + heartRateScore * 0.3 + loadScore * 0.3));
}

/**
 * Calculate consistency score (0-100)
 * Based on how consistent daily activity is
 */
export function calculateConsistency(metrics: HealthMetrics[]): number {
  if (metrics.length < 7) return 50;

  const recentMetrics = metrics.slice(-7);
  
  // Calculate daily activity scores
  const dailyScores = recentMetrics.map(m => {
    const stepScore = Math.min(m.steps / 100, 100);
    const activeScore = Math.min(m.activeMinutes, 100);
    return (stepScore + activeScore) / 2;
  });

  // Calculate standard deviation (lower = more consistent)
  const stdDev = calculateStandardDeviation(dailyScores);
  
  // Convert to score (lower deviation = higher score)
  const consistencyScore = Math.max(0, 100 - (stdDev * 2));

  // Bonus for working out on multiple days
  const activeDays = recentMetrics.filter(m => m.activeMinutes > 20).length;
  const activeDaysBonus = (activeDays / 7) * 20;

  return Math.round(Math.min(consistencyScore + activeDaysBonus, 100));
}

/**
 * Helper: Calculate standard deviation
 */
function calculateStandardDeviation(values: number[]): number {
  if (values.length === 0) return 0;
  
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const squareDiffs = values.map(value => Math.pow(value - avg, 2));
  const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / squareDiffs.length;
  
  return Math.sqrt(avgSquareDiff);
}

/**
 * Get health score interpretation
 */
export function getHealthScoreInterpretation(score: number): {
  label: string;
  description: string;
  color: string;
} {
  if (score >= 80) {
    return {
      label: "Excellent",
      description: "You're doing great! Keep up the excellent work.",
      color: "green",
    };
  } else if (score >= 65) {
    return {
      label: "Good",
      description: "You're on the right track. Small improvements can make a big difference.",
      color: "blue",
    };
  } else if (score >= 50) {
    return {
      label: "Fair",
      description: "There's room for improvement. Focus on consistency and recovery.",
      color: "yellow",
    };
  } else {
    return {
      label: "Needs Attention",
      description: "Your health metrics need attention. Consider consulting a healthcare professional.",
      color: "red",
    };
  }
}

