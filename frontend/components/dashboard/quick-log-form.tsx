"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Moon, Heart, Flame, TrendingUp } from "lucide-react";

interface QuickLogFormProps {
  onSubmit: (data: QuickLogData) => Promise<void>;
  onClose: () => void;
}

export interface QuickLogData {
  date: Date;
  steps: number;
  activeMinutes: number;
  sleepHours: number;
  heartRate?: number;
  caloriesBurned?: number;
  notes?: string;
}

export function QuickLogForm({ onSubmit, onClose }: QuickLogFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<QuickLogData>({
    date: new Date(),
    steps: 0,
    activeMinutes: 0,
    sleepHours: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Failed to log data:", error);
      alert("Failed to save data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof QuickLogData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
            <Activity className="h-5 w-5 text-blue-600" />
            Log Today's Activity
          </CardTitle>
          <CardDescription>
            Enter your health data for{" "}
            {new Date(formData.date).toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date
              </label>
              <input
                type="date"
                value={formData.date.toISOString().split("T")[0]}
                onChange={(e) => handleChange("date", new Date(e.target.value))}
                max={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700"
              />
            </div>

            {/* Steps */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                Steps
              </label>
              <input
                type="number"
                min="0"
                max="100000"
                value={formData.steps || ""}
                onChange={(e) => handleChange("steps", parseInt(e.target.value) || 0)}
                placeholder="e.g., 8000"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700"
                required
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Target: 8,000 - 10,000 steps per day
              </p>
            </div>

            {/* Active Minutes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Activity className="h-4 w-4 text-green-600" />
                Active Minutes
              </label>
              <input
                type="number"
                min="0"
                max="1440"
                value={formData.activeMinutes || ""}
                onChange={(e) => handleChange("activeMinutes", parseInt(e.target.value) || 0)}
                placeholder="e.g., 45"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700"
                required
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Target: 30-60 minutes per day
              </p>
            </div>

            {/* Sleep Hours */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Moon className="h-4 w-4 text-purple-600" />
                Sleep Hours (last night)
              </label>
              <input
                type="number"
                min="0"
                max="24"
                step="0.5"
                value={formData.sleepHours || ""}
                onChange={(e) => handleChange("sleepHours", parseFloat(e.target.value) || 0)}
                placeholder="e.g., 7.5"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700"
                required
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Target: 7-9 hours per night
              </p>
            </div>

            {/* Optional: Heart Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-600" />
                Resting Heart Rate (optional)
              </label>
              <input
                type="number"
                min="30"
                max="200"
                value={formData.heartRate || ""}
                onChange={(e) => handleChange("heartRate", parseInt(e.target.value) || undefined)}
                placeholder="e.g., 72"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Measure when you wake up, before getting out of bed
              </p>
            </div>

            {/* Optional: Calories */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Flame className="h-4 w-4 text-orange-600" />
                Calories Burned (optional)
              </label>
              <input
                type="number"
                min="0"
                max="10000"
                value={formData.caloriesBurned || ""}
                onChange={(e) => handleChange("caloriesBurned", parseInt(e.target.value) || undefined)}
                placeholder="e.g., 2500"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700"
              />
            </div>

            {/* Optional: Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notes (optional)
              </label>
              <textarea
                value={formData.notes || ""}
                onChange={(e) => handleChange("notes", e.target.value)}
                placeholder="How did you feel today? Any workouts?"
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                variant="gradient"
                className="flex-1"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Data"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

