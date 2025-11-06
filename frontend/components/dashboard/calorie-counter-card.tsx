"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flame, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export function CalorieCounterCard() {
  const router = useRouter();

  return (
    <Card className="border-2 hover:shadow-lg transition-all cursor-pointer" onClick={() => window.location.href = '/calorie-calculator.html'}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-blue-900 dark:text-blue-100 flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-600" />
            Calorie Counter
          </CardTitle>
          <ArrowRight className="h-5 w-5 text-gray-400" />
        </div>
        <CardDescription>Track your daily calorie intake and burn</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-center h-32 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg">
            <Flame className="h-16 w-16 text-orange-600 dark:text-orange-400 opacity-50" />
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Monitor your calorie balance with AI-powered food recognition and personalized recommendations.
          </p>

          <Button 
            variant="outline" 
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = '/calorie-calculator.html';
            }}
          >
            Track Calories
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}


