"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { Activity, ArrowLeft, Users } from "lucide-react";

export default function PostureWorkoutPage() {
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
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => router.push('/dashboard')}
              >
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
            <Users className="h-8 w-8 text-indigo-600" />
            Posture Workout
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            AI-powered real-time form tracking and feedback
          </p>
        </div>

        <Card>
            <CardHeader>
              <CardTitle className="text-blue-900 dark:text-blue-100">Feature Coming Soon</CardTitle>
              <CardDescription>We're building something amazing for you</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-center h-64 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg">
                  <div className="text-center">
                    <Users className="h-24 w-24 text-indigo-600 dark:text-indigo-400 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      Posture Workout Module
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                      This feature is currently under development. Soon you'll be able to get real-time feedback on your exercise form.
                    </p>
                  </div>
                </div>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}

