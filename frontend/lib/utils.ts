import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Gradient variant for buttons
export const buttonVariants = {
  variants: {
    variant: {
      gradient: "bg-gradient-to-r from-blue-600 to-purple-600 text-white",
    },
  },
};

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function calculateHealthScore(metrics: {
  activityLevel: number;
  sleepQuality: number;
  recoveryScore: number;
  consistency: number;
}): number {
  const weights = {
    activityLevel: 0.3,
    sleepQuality: 0.25,
    recoveryScore: 0.3,
    consistency: 0.15,
  };

  return Math.round(
    metrics.activityLevel * weights.activityLevel +
      metrics.sleepQuality * weights.sleepQuality +
      metrics.recoveryScore * weights.recoveryScore +
      metrics.consistency * weights.consistency
  );
}

export function getHealthScoreColor(score: number): string {
  if (score >= 80) return "text-green-600";
  if (score >= 50) return "text-yellow-600";
  return "text-red-600";
}

export function getHealthScoreBg(score: number): string {
  if (score >= 80) return "bg-green-100";
  if (score >= 50) return "bg-yellow-100";
  return "bg-red-100";
}

export function getRiskLevel(score: number): "LOW" | "MEDIUM" | "HIGH" {
  if (score <= 30) return "LOW";
  if (score <= 70) return "MEDIUM";
  return "HIGH";
}

export function getRiskColor(level: "LOW" | "MEDIUM" | "HIGH"): string {
  switch (level) {
    case "LOW":
      return "text-green-600";
    case "MEDIUM":
      return "text-yellow-600";
    case "HIGH":
      return "text-red-600";
  }
}

