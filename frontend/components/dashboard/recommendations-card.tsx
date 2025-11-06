"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AIRecommendation } from "@/types";
import { Brain, CheckCircle, AlertCircle, Info, Droplets, Moon, Activity } from "lucide-react";

interface RecommendationsCardProps {
  recommendations: AIRecommendation[];
}

export function RecommendationsCard({ recommendations }: RecommendationsCardProps) {
  const getIcon = (type: AIRecommendation["type"]) => {
    switch (type) {
      case "rest":
        return <Moon className="h-5 w-5 text-purple-600" />;
      case "activity":
        return <Activity className="h-5 w-5 text-blue-600" />;
      case "nutrition":
        return <Info className="h-5 w-5 text-green-600" />;
      case "hydration":
        return <Droplets className="h-5 w-5 text-cyan-600" />;
      case "sleep":
        return <Moon className="h-5 w-5 text-indigo-600" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Info className="h-5 w-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: AIRecommendation["priority"]) => {
    switch (priority) {
      case "high":
        return "border-l-red-500 bg-red-50";
      case "medium":
        return "border-l-yellow-500 bg-yellow-50";
      case "low":
        return "border-l-green-500 bg-green-50";
    }
  };

  const getPriorityBadge = (priority: AIRecommendation["priority"]) => {
    switch (priority) {
      case "high":
        return <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full font-medium">High</span>;
      case "medium":
        return <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full font-medium">Medium</span>;
      case "low":
        return <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">Low</span>;
    }
  };

  return (
    <Card className="border-2 hover:shadow-lg transition-all">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-blue-900 dark:text-blue-100 flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            AI Recommendations
          </CardTitle>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {recommendations.length} insights
          </span>
        </div>
        <CardDescription>Personalized advice based on your data</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recommendations.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Brain className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No recommendations yet. Keep tracking your activity!</p>
            </div>
          ) : (
            recommendations.map((rec) => (
              <div
                key={rec.id}
                className={`p-4 rounded-lg border-l-4 ${getPriorityColor(rec.priority)} transition-all hover:shadow-md`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {getIcon(rec.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {rec.title}
                      </h4>
                      {getPriorityBadge(rec.priority)}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {rec.description}
                    </p>
                    {!rec.completed && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 h-8 text-xs"
                        onClick={() => {
                          // Mark as completed
                          console.log("Mark as completed:", rec.id);
                        }}
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Mark as Done
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </CardContent>
    </Card>
  );
}

