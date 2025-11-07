"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export function InjuryAnalysisCard() {
  const router = useRouter();

  return (
    <Card className="border-2 hover:shadow-lg transition-all cursor-pointer" onClick={() => router.push('/injury-analysis')}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-blue-900 dark:text-blue-100 flex items-center gap-2">
            <Activity className="h-5 w-5 text-red-600" />
            Injury Analysis
          </CardTitle>
          <ArrowRight className="h-5 w-5 text-gray-400" />
        </div>
        <CardDescription>AI-powered injury risk detection and prevention</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-center h-32 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-lg">
            <Activity className="h-16 w-16 text-red-600 dark:text-red-400 opacity-50" />
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Get comprehensive injury risk analysis based on your training patterns and activity levels.
          </p>

          <Button 
            variant="outline" 
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              router.push('/injury-analysis');
            }}
          >
            View Analysis
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}






