"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dumbbell, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export function TrackWorkoutCard() {
  const router = useRouter();

  return (
    <Card className="border-2 hover:shadow-lg transition-all cursor-pointer" onClick={() => router.push('/track-workout')}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-blue-900 dark:text-blue-100 flex items-center gap-2">
            <Dumbbell className="h-5 w-5 text-green-600" />
            Track Workout
          </CardTitle>
          <ArrowRight className="h-5 w-5 text-gray-400" />
        </div>
        <CardDescription>AI-powered workout tracking and analytics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-center h-32 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
            <Dumbbell className="h-16 w-16 text-green-600 dark:text-green-400 opacity-50" />
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Track your workouts, monitor progress, and get AI-powered insights to optimize your training.
          </p>

          <Button 
            variant="outline" 
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              router.push('/track-workout');
            }}
          >
            Start Tracking
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}




