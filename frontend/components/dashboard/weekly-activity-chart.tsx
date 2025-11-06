"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HealthMetrics } from "@/types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { TrendingUp } from "lucide-react";

interface WeeklyActivityChartProps {
  weeklyMetrics: HealthMetrics[];
}

export function WeeklyActivityChart({ weeklyMetrics }: WeeklyActivityChartProps) {
  // Prepare data for charts
  const chartData = weeklyMetrics.map((metric) => ({
    day: new Date(metric.date).toLocaleDateString("en-US", { weekday: "short" }),
    steps: metric.steps,
    activeMinutes: metric.activeMinutes,
    sleep: metric.sleepHours,
    calories: metric.caloriesBurned,
  }));

  // Calculate averages
  const avgSteps = Math.round(
    weeklyMetrics.reduce((sum, m) => sum + m.steps, 0) / weeklyMetrics.length
  );
  const avgActiveMinutes = Math.round(
    weeklyMetrics.reduce((sum, m) => sum + m.activeMinutes, 0) / weeklyMetrics.length
  );
  const avgSleep = (
    weeklyMetrics.reduce((sum, m) => sum + m.sleepHours, 0) / weeklyMetrics.length
  ).toFixed(1);

  return (
    <Card className="border-2 hover:shadow-lg transition-all">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-blue-900 dark:text-blue-100">Weekly Activity</CardTitle>
          <TrendingUp className="h-5 w-5 text-blue-600" />
        </div>
        <CardDescription>Last 7 days performance overview</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{avgSteps.toLocaleString()}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Avg Steps/Day</div>
            </div>
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{avgActiveMinutes}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Avg Active Min</div>
            </div>
            <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{avgSleep}h</div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Avg Sleep</div>
            </div>
          </div>

          {/* Steps Chart */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Daily Steps</h4>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="day" 
                  tick={{ fontSize: 12 }}
                  stroke="#666"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  stroke="#666"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e5e5',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Bar 
                  dataKey="steps" 
                  fill="#3b82f6" 
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Sleep & Active Minutes Trend */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Sleep & Activity Trends</h4>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="day" 
                  tick={{ fontSize: 12 }}
                  stroke="#666"
                />
                <YAxis 
                  yAxisId="left"
                  tick={{ fontSize: 12 }}
                  stroke="#666"
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 12 }}
                  stroke="#666"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e5e5',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '12px' }}
                />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="sleep" 
                  stroke="#9333ea" 
                  strokeWidth={2}
                  dot={{ fill: '#9333ea', r: 4 }}
                  name="Sleep (hours)"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="activeMinutes" 
                  stroke="#16a34a" 
                  strokeWidth={2}
                  dot={{ fill: '#16a34a', r: 4 }}
                  name="Active Minutes"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

