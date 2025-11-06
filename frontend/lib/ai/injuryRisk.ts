/**
 * AI Injury Risk Detection
 * Predicts injury risk based on training patterns
 */

import { HealthMetrics, InjuryRisk } from "@/types";

/**
 * Calculate injury risk level
 */
export function calculateInjuryRisk(metrics: HealthMetrics[]): InjuryRisk {
  if (metrics.length < 7) {
    return {
      level: "LOW",
      score: 10,
      factors: ["Not enough data to assess risk"],
      recommendations: ["Continue tracking your activity for better insights"],
    };
  }

  const recentMetrics = metrics.slice(-7);
  const riskFactors: string[] = [];
  const recommendations: string[] = [];
  let riskScore = 0;

  // Factor 1: Sudden training spike (>30% increase)
  const spikeRisk = detectTrainingSpike(metrics);
  if (spikeRisk.detected) {
    riskScore += 30;
    riskFactors.push(spikeRisk.description);
    recommendations.push("Reduce training intensity by 20-30% this week");
  }

  // Factor 2: Insufficient rest days
  const restDays = recentMetrics.filter(m => m.activeMinutes < 30).length;
  if (restDays < 1) {
    riskScore += 25;
    riskFactors.push("No rest days in the past week");
    recommendations.push("Take at least 1-2 rest days per week");
  } else if (restDays === 1) {
    riskScore += 10;
    riskFactors.push("Only 1 rest day this week");
    recommendations.push("Consider adding another rest day");
  }

  // Factor 3: Poor recovery indicators
  const recoveryRisk = detectPoorRecovery(recentMetrics);
  if (recoveryRisk.detected) {
    riskScore += 20;
    riskFactors.push(recoveryRisk.description);
    recommendations.push("Prioritize sleep and recovery");
  }

  // Factor 4: Consecutive high-intensity days
  const consecutiveHighIntensity = detectConsecutiveHighIntensity(recentMetrics);
  if (consecutiveHighIntensity > 3) {
    riskScore += 15;
    riskFactors.push(`${consecutiveHighIntensity} consecutive high-intensity days`);
    recommendations.push("Include low-intensity recovery sessions");
  }

  // Factor 5: Sleep deficit
  const avgSleep = recentMetrics.reduce((sum, m) => sum + m.sleepHours, 0) / recentMetrics.length;
  if (avgSleep < 6) {
    riskScore += 20;
    riskFactors.push(`Average sleep: ${avgSleep.toFixed(1)}h (below recommended 7-9h)`);
    recommendations.push("Aim for 7-9 hours of sleep per night");
  } else if (avgSleep < 7) {
    riskScore += 10;
    riskFactors.push(`Sleep could be improved: ${avgSleep.toFixed(1)}h average`);
    recommendations.push("Try to get closer to 8 hours of sleep");
  }

  // Determine risk level
  let level: "LOW" | "MEDIUM" | "HIGH";
  if (riskScore >= 70) {
    level = "HIGH";
  } else if (riskScore >= 40) {
    level = "MEDIUM";
  } else {
    level = "LOW";
  }

  // Add positive factors if risk is low
  if (level === "LOW" && riskFactors.length === 0) {
    riskFactors.push(
      "Good recovery patterns detected",
      "Consistent training schedule",
      "Adequate rest days included"
    );
    recommendations.push(
      "Maintain current training intensity",
      "Continue prioritizing sleep",
      "Stay hydrated during workouts"
    );
  }

  return {
    level,
    score: Math.min(riskScore, 100),
    factors: riskFactors,
    recommendations: recommendations.slice(0, 3), // Top 3 recommendations
  };
}

/**
 * Detect sudden training spike
 */
function detectTrainingSpike(metrics: HealthMetrics[]): { detected: boolean; description: string } {
  if (metrics.length < 14) {
    return { detected: false, description: "" };
  }

  // Compare last week vs previous week
  const lastWeek = metrics.slice(-7);
  const previousWeek = metrics.slice(-14, -7);

  const lastWeekLoad = lastWeek.reduce((sum, m) => sum + m.activeMinutes, 0);
  const previousWeekLoad = previousWeek.reduce((sum, m) => sum + m.activeMinutes, 0);

  if (previousWeekLoad === 0) {
    return { detected: false, description: "" };
  }

  const percentageChange = ((lastWeekLoad - previousWeekLoad) / previousWeekLoad) * 100;

  if (percentageChange > 30) {
    return {
      detected: true,
      description: `Training intensity increased by ${Math.round(percentageChange)}% this week`,
    };
  }

  return { detected: false, description: "" };
}

/**
 * Detect poor recovery indicators
 */
function detectPoorRecovery(metrics: HealthMetrics[]): { detected: boolean; description: string } {
  const avgHeartRate = metrics.reduce((sum, m) => sum + m.heartRate, 0) / metrics.length;
  const avgSleep = metrics.reduce((sum, m) => sum + m.sleepHours, 0) / metrics.length;

  // High resting heart rate + poor sleep = poor recovery
  if (avgHeartRate > 80 && avgSleep < 6.5) {
    return {
      detected: true,
      description: "Elevated heart rate and insufficient sleep indicate poor recovery",
    };
  }

  // Check for declining sleep trend
  const firstHalf = metrics.slice(0, Math.floor(metrics.length / 2));
  const secondHalf = metrics.slice(Math.floor(metrics.length / 2));
  
  const firstHalfSleep = firstHalf.reduce((sum, m) => sum + m.sleepHours, 0) / firstHalf.length;
  const secondHalfSleep = secondHalf.reduce((sum, m) => sum + m.sleepHours, 0) / secondHalf.length;

  if (firstHalfSleep - secondHalfSleep > 1) {
    return {
      detected: true,
      description: "Sleep quality declining over the week",
    };
  }

  return { detected: false, description: "" };
}

/**
 * Detect consecutive high-intensity days
 */
function detectConsecutiveHighIntensity(metrics: HealthMetrics[]): number {
  let maxConsecutive = 0;
  let currentConsecutive = 0;

  for (const metric of metrics) {
    // High intensity = more than 60 active minutes or multiple workouts
    if (metric.activeMinutes > 60 || metric.workoutSessions.length > 1) {
      currentConsecutive++;
      maxConsecutive = Math.max(maxConsecutive, currentConsecutive);
    } else {
      currentConsecutive = 0;
    }
  }

  return maxConsecutive;
}

/**
 * Get injury risk color and icon
 */
export function getInjuryRiskDisplay(level: "LOW" | "MEDIUM" | "HIGH"): {
  color: string;
  bgColor: string;
  textColor: string;
  icon: string;
} {
  switch (level) {
    case "LOW":
      return {
        color: "green",
        bgColor: "bg-green-100",
        textColor: "text-green-600",
        icon: "✓",
      };
    case "MEDIUM":
      return {
        color: "yellow",
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-600",
        icon: "⚠",
      };
    case "HIGH":
      return {
        color: "red",
        bgColor: "bg-red-100",
        textColor: "text-red-600",
        icon: "⚠",
      };
  }
}

/**
 * Predict injury risk for next 7 days
 */
export function predictFutureRisk(metrics: HealthMetrics[]): {
  nextWeekRisk: "LOW" | "MEDIUM" | "HIGH";
  confidence: number;
  reasoning: string;
} {
  const currentRisk = calculateInjuryRisk(metrics);
  
  // Analyze trends
  if (metrics.length < 14) {
    return {
      nextWeekRisk: currentRisk.level,
      confidence: 50,
      reasoning: "Not enough historical data for accurate prediction",
    };
  }

  const recentWeek = metrics.slice(-7);
  const previousWeek = metrics.slice(-14, -7);

  const recentLoad = recentWeek.reduce((sum, m) => sum + m.activeMinutes, 0);
  const previousLoad = previousWeek.reduce((sum, m) => sum + m.activeMinutes, 0);

  // If increasing load rapidly, risk increases
  if (recentLoad > previousLoad * 1.3) {
    return {
      nextWeekRisk: "HIGH",
      confidence: 75,
      reasoning: "Rapidly increasing training load suggests elevated future risk",
    };
  }

  // If current risk is high and not taking rest
  const restDays = recentWeek.filter(m => m.activeMinutes < 30).length;
  if (currentRisk.level === "HIGH" && restDays === 0) {
    return {
      nextWeekRisk: "HIGH",
      confidence: 85,
      reasoning: "High current risk without adequate rest",
    };
  }

  // If improving (more rest, better sleep)
  const recentSleep = recentWeek.reduce((sum, m) => sum + m.sleepHours, 0) / 7;
  const previousSleep = previousWeek.reduce((sum, m) => sum + m.sleepHours, 0) / 7;

  if (recentSleep > previousSleep + 0.5 && restDays >= 2) {
    return {
      nextWeekRisk: "LOW",
      confidence: 70,
      reasoning: "Improving sleep and adequate rest days",
    };
  }

  return {
    nextWeekRisk: currentRisk.level,
    confidence: 60,
    reasoning: "Maintaining current patterns",
  };
}

