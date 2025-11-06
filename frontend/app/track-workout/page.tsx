"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { Activity, ArrowLeft, Dumbbell, Target, TrendingUp, BarChart } from "lucide-react";

export default function TrackWorkoutPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      {/* Header */}
      <header className="border-b border-indigo-100 dark:border-indigo-900/50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TotalFit
              </span>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Button variant="outline" size="sm" onClick={() => router.push('/dashboard')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-3">
            <Dumbbell className="h-8 w-8 text-green-600" />
            Track Workout
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            AI-powered workout tracking and performance analytics
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Coming Soon Card */}
          <Card className="lg:col-span-2 border-2">
            <CardHeader>
              <CardTitle className="text-blue-900 dark:text-blue-100">Feature Coming Soon</CardTitle>
              <CardDescription>We're building something amazing for you</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-center h-64 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
                  <div className="text-center">
                    <Dumbbell className="h-24 w-24 text-green-600 dark:text-green-400 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      Workout Tracking Module
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                      This feature is currently under development. Soon you'll be able to track your workouts with detailed performance analytics and AI-powered insights.
                    </p>
                  </div>
                </div>

                <div className="border-t dark:border-gray-700 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    What to Expect:
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex gap-3">
                      <Target className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">Exercise Tracking</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Log sets, reps, and weights for every exercise
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <BarChart className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">Performance Analytics</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Visualize your progress over time
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <TrendingUp className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">AI Insights</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Get personalized workout recommendations
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Dumbbell className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">Custom Programs</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Create and follow workout programs
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Info Sidebar */}
          <div className="space-y-6">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-blue-900 dark:text-blue-100">Track Your Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <p>
                  Consistent tracking is key to achieving your fitness goals. Our workout tracking system will help you stay accountable.
                </p>
                <p>
                  Monitor your strength gains, endurance improvements, and overall fitness progression with data-driven insights.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
              <CardHeader>
                <CardTitle className="text-blue-900 dark:text-blue-100">Stay Tuned</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  We're working hard to bring you this feature. Check back soon for updates!
                </p>
                <Button variant="gradient" className="w-full" onClick={() => router.push('/dashboard')}>
                  Return to Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

