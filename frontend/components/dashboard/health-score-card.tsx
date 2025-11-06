"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HealthScore } from "@/types";
import { Activity, TrendingUp } from "lucide-react";
import { getHealthScoreColor, getHealthScoreBg } from "@/lib/utils";

interface HealthScoreCardProps {
  healthScore: HealthScore;
}

export function HealthScoreCard({ healthScore }: HealthScoreCardProps) {
  const scoreColor = getHealthScoreColor(healthScore.overallScore);
  const scoreBg = getHealthScoreBg(healthScore.overallScore);

  const getScoreLabel = (score: number): string => {
    if (score >= 80) return "Excellent";
    if (score >= 50) return "Good";
    return "Needs Attention";
  };

  return (
    <Card className="border-2 hover:shadow-lg transition-all">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-blue-900 dark:text-blue-100">Health Score</CardTitle>
          <Activity className={`h-5 w-5 ${scoreColor}`} />
        </div>
        <CardDescription>Overall health assessment</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Main Score Display */}
          <div className="flex items-center gap-4">
            <div className={`flex items-center justify-center h-24 w-24 rounded-full ${scoreBg}`}>
              <div className="text-center">
                <div className={`text-3xl font-bold ${scoreColor}`}>
                  {healthScore.overallScore}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">/ 100</div>
              </div>
            </div>
            <div>
              <div className={`text-xl font-semibold ${scoreColor}`}>
                {getScoreLabel(healthScore.overallScore)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Based on your activity, sleep, and recovery
              </div>
            </div>
          </div>

          {/* Score Breakdown */}
          <div className="space-y-3 pt-4 border-t dark:border-gray-700">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Activity Level</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${healthScore.activityLevel}%` }}
                  />
                </div>
                <span className="font-medium w-8 text-right dark:text-gray-300">{healthScore.activityLevel}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Sleep Quality</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-purple-600 rounded-full"
                    style={{ width: `${healthScore.sleepQuality}%` }}
                  />
                </div>
                <span className="font-medium w-8 text-right dark:text-gray-300">{healthScore.sleepQuality}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Recovery Score</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-600 rounded-full"
                    style={{ width: `${healthScore.recoveryScore}%` }}
                  />
                </div>
                <span className="font-medium w-8 text-right dark:text-gray-300">{healthScore.recoveryScore}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Consistency</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-600 rounded-full"
                    style={{ width: `${healthScore.consistency}%` }}
                  />
                </div>
                <span className="font-medium w-8 text-right dark:text-gray-300">{healthScore.consistency}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

