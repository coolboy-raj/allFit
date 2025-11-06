/**
 * AI Recommendation Engine
 * Generates personalized health recommendations
 */

import { HealthMetrics, AIRecommendation, InjuryRisk, HealthScore } from "@/types";

/**
 * Generate AI recommendations based on health data
 */
export function generateRecommendations(
  metrics: HealthMetrics[],
  healthScore: HealthScore,
  injuryRisk: InjuryRisk,
  userId: string
): AIRecommendation[] {
  const recommendations: AIRecommendation[] = [];
  const today = new Date();

  if (metrics.length === 0) {
    return [{
      id: `rec_${Date.now()}`,
      userId,
      date: today,
      type: "activity",
      title: "Start tracking your activity",
      description: "Begin your fitness journey by tracking daily activities with Google Fit.",
      priority: "medium",
      completed: false,
    }];
  }

  const recentMetrics = metrics.slice(-7);
  const latestMetric = metrics[metrics.length - 1];

  // High priority recommendations (injury warnings)
  if (injuryRisk.level === "HIGH") {
    recommendations.push({
      id: `rec_${Date.now()}_${Math.random()}`,
      userId,
      date: today,
      type: "warning",
      title: "⚠️ High Injury Risk Detected",
      description: "Your training patterns show high injury risk. Consider taking 1-2 rest days and reducing intensity by 30%.",
      priority: "high",
      completed: false,
    });
  }

  // Sleep recommendations
  const avgSleep = recentMetrics.reduce((sum, m) => sum + m.sleepHours, 0) / recentMetrics.length;
  if (avgSleep < 6.5) {
    recommendations.push({
      id: `rec_${Date.now()}_${Math.random()}`,
      userId,
      date: today,
      type: "sleep",
      title: "Improve your sleep",
      description: `You're averaging ${avgSleep.toFixed(1)} hours of sleep. Aim for 7-9 hours to optimize recovery and performance.`,
      priority: "high",
      completed: false,
    });
  } else if (avgSleep >= 7 && avgSleep <= 9) {
    recommendations.push({
      id: `rec_${Date.now()}_${Math.random()}`,
      userId,
      date: today,
      type: "sleep",
      title: "Excellent sleep habits! 😴",
      description: `Your ${avgSleep.toFixed(1)}h average sleep is optimal. This supports recovery and performance.`,
      priority: "low",
      completed: false,
    });
  }

  // Activity recommendations
  if (latestMetric.steps < 5000) {
    recommendations.push({
      id: `rec_${Date.now()}_${Math.random()}`,
      userId,
      date: today,
      type: "activity",
      title: "Increase daily movement",
      description: `You've taken ${latestMetric.steps.toLocaleString()} steps today. Try to reach 8,000-10,000 steps for optimal health.`,
      priority: "medium",
      completed: false,
    });
  } else if (latestMetric.steps > 15000) {
    recommendations.push({
      id: `rec_${Date.now()}_${Math.random()}`,
      userId,
      date: today,
      type: "activity",
      title: "Impressive activity level! 🎉",
      description: `${latestMetric.steps.toLocaleString()} steps today! You're exceeding targets. Great work!`,
      priority: "low",
      completed: false,
    });
  }

  // Rest day recommendations
  const restDays = recentMetrics.filter(m => m.activeMinutes < 30).length;
  if (restDays === 0 && metrics.length >= 6) {
    recommendations.push({
      id: `rec_${Date.now()}_${Math.random()}`,
      userId,
      date: today,
      type: "rest",
      title: "Take a rest day",
      description: "You've been active every day this week. Consider taking a rest day or doing light activity tomorrow to aid recovery.",
      priority: "medium",
      completed: false,
    });
  } else if (restDays >= 2) {
    recommendations.push({
      id: `rec_${Date.now()}_${Math.random()}`,
      userId,
      date: today,
      type: "rest",
      title: "Good recovery balance",
      description: `You took ${restDays} rest days this week. This supports long-term progress and injury prevention.`,
      priority: "low",
      completed: false,
    });
  }

  // Hydration recommendations (based on activity)
  if (latestMetric.activeMinutes > 60) {
    const recommendedWater = Math.ceil(2 + (latestMetric.activeMinutes / 30));
    recommendations.push({
      id: `rec_${Date.now()}_${Math.random()}`,
      userId,
      date: today,
      type: "hydration",
      title: "Stay hydrated",
      description: `With ${latestMetric.activeMinutes} active minutes today, aim for ${recommendedWater}L of water to stay properly hydrated.`,
      priority: "medium",
      completed: false,
    });
  }

  // Consistency recommendations
  if (healthScore.consistency < 50) {
    recommendations.push({
      id: `rec_${Date.now()}_${Math.random()}`,
      userId,
      date: today,
      type: "activity",
      title: "Build consistency",
      description: "Your activity varies significantly day-to-day. Try to maintain more consistent daily activity for better results.",
      priority: "medium",
      completed: false,
    });
  } else if (healthScore.consistency >= 80) {
    recommendations.push({
      id: `rec_${Date.now()}_${Math.random()}`,
      userId,
      date: today,
      type: "activity",
      title: "Excellent consistency! 🌟",
      description: "Your consistent daily routine is building strong healthy habits. Keep it up!",
      priority: "low",
      completed: false,
    });
  }

  // Heart rate recommendations
  if (latestMetric.heartRate > 80) {
    recommendations.push({
      id: `rec_${Date.now()}_${Math.random()}`,
      userId,
      date: today,
      type: "rest",
      title: "Elevated heart rate detected",
      description: "Your resting heart rate is elevated. This may indicate stress or insufficient recovery. Consider meditation or lighter exercise.",
      priority: "medium",
      completed: false,
    });
  }

  // Workout intensity recommendations
  const highIntensityDays = recentMetrics.filter(m => m.activeMinutes > 90).length;
  if (highIntensityDays > 4) {
    recommendations.push({
      id: `rec_${Date.now()}_${Math.random()}`,
      userId,
      date: today,
      type: "warning",
      title: "High training volume",
      description: "You've had multiple high-intensity days. Consider incorporating more moderate-intensity sessions to prevent burnout.",
      priority: "high",
      completed: false,
    });
  }

  // Nutrition recommendations (if calories burned is high)
  if (latestMetric.caloriesBurned > 3000) {
    recommendations.push({
      id: `rec_${Date.now()}_${Math.random()}`,
      userId,
      date: today,
      type: "nutrition",
      title: "Fuel your activity",
      description: `You burned ${latestMetric.caloriesBurned.toLocaleString()} calories today. Ensure adequate protein (1.6-2.2g per kg body weight) and carbohydrates for recovery.`,
      priority: "medium",
      completed: false,
    });
  }

  // Positive reinforcement
  if (healthScore.overallScore >= 80) {
    recommendations.push({
      id: `rec_${Date.now()}_${Math.random()}`,
      userId,
      date: today,
      type: "activity",
      title: "Outstanding health score! 🏆",
      description: `Your health score of ${healthScore.overallScore}/100 is excellent. You're maintaining a great balance of activity, sleep, and recovery.`,
      priority: "low",
      completed: false,
    });
  }

  // Sort by priority (high -> medium -> low)
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  // Return top 5 recommendations
  return recommendations.slice(0, 5);
}

/**
 * Generate weekly summary recommendations
 */
export function generateWeeklySummary(metrics: HealthMetrics[]): string {
  if (metrics.length < 7) {
    return "Not enough data for weekly summary. Keep tracking!";
  }

  const weekMetrics = metrics.slice(-7);
  const totalSteps = weekMetrics.reduce((sum, m) => sum + m.steps, 0);
  const totalActiveMinutes = weekMetrics.reduce((sum, m) => sum + m.activeMinutes, 0);
  const avgSleep = weekMetrics.reduce((sum, m) => sum + m.sleepHours, 0) / 7;
  const workoutDays = weekMetrics.filter(m => m.workoutSessions.length > 0).length;

  let summary = `This week:\n`;
  summary += `• ${totalSteps.toLocaleString()} total steps (${Math.round(totalSteps / 7).toLocaleString()}/day avg)\n`;
  summary += `• ${totalActiveMinutes} active minutes\n`;
  summary += `• ${avgSleep.toFixed(1)}h average sleep\n`;
  summary += `• ${workoutDays} workout days\n\n`;

  if (totalSteps >= 70000) {
    summary += "🎉 Excellent step count!";
  } else if (totalSteps >= 50000) {
    summary += "👍 Good activity level!";
  } else {
    summary += "💪 Let's increase activity next week!";
  }

  return summary;
}

/**
 * Generate goal-based recommendations
 */
export function generateGoalRecommendations(
  goal: "weight_loss" | "muscle_gain" | "endurance" | "general_health",
  metrics: HealthMetrics[]
): AIRecommendation[] {
  const userId = "";
  const today = new Date();
  const recommendations: AIRecommendation[] = [];

  const latestMetric = metrics[metrics.length - 1];

  switch (goal) {
    case "weight_loss":
      recommendations.push({
        id: `rec_${Date.now()}_goal`,
        userId,
        date: today,
        type: "activity",
        title: "Optimize for weight loss",
        description: "Aim for 300+ active minutes per week with a mix of cardio and strength training. Maintain a slight calorie deficit.",
        priority: "medium",
        completed: false,
      });
      break;

    case "muscle_gain":
      recommendations.push({
        id: `rec_${Date.now()}_goal`,
        userId,
        date: today,
        type: "nutrition",
        title: "Support muscle growth",
        description: "Focus on 3-4 strength training sessions per week. Ensure 1.6-2.2g protein per kg body weight and adequate rest between sessions.",
        priority: "medium",
        completed: false,
      });
      break;

    case "endurance":
      recommendations.push({
        id: `rec_${Date.now()}_goal`,
        userId,
        date: today,
        type: "activity",
        title: "Build endurance",
        description: "Gradually increase your long-session duration by 10% each week. Include 1-2 recovery days with light activity.",
        priority: "medium",
        completed: false,
      });
      break;

    case "general_health":
      recommendations.push({
        id: `rec_${Date.now()}_goal`,
        userId,
        date: today,
        type: "activity",
        title: "Maintain balanced health",
        description: "Aim for 150+ active minutes per week, 7-9 hours sleep, and 8,000+ steps daily for optimal general health.",
        priority: "medium",
        completed: false,
      });
      break;
  }

  return recommendations;
}

