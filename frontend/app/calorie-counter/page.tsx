"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { Activity, ArrowLeft, Flame, Camera, Utensils, TrendingUp, Plus, Send } from "lucide-react";
import Image from 'next/image';


// Mock data for the daily log
const initialLog = [
  { id: 1, name: 'Coffee', calories: 5, time: '8:00 AM' },
  { id: 2, name: 'Oats with berries', calories: 350, time: '8:05 AM' },
  { id: 3, name: 'Grilled Chicken Salad', calories: 450, time: '1:00 PM' },
];

// Mock AI analysis function
const analyzeImage = async (image: File) => {
  return new Promise(resolve => {
    setTimeout(() => {
      const items = [
        { name: 'Apple', calories: 95 },
        { name: 'Banana', calories: 105 },
        { name: 'Pizza Slice', calories: 285 },
        { name: 'Burger', calories: 500 },
        { name: 'Salad', calories: 150 },
      ];
      const randomItem = items[Math.floor(Math.random() * items.length)];
      resolve(randomItem);
    }, 1500);
  });
};


export default function CalorieCounterPage() {
  const router = useRouter();

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<{ name: string; calories: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dailyLog, setDailyLog] = useState(initialLog);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setAnalysisResult(null);
    }
  };

  const handleAnalyzeClick = async () => {
    if (!imageFile) return;
    setIsLoading(true);
    const result = await analyzeImage(imageFile) as { name: string; calories: number };
    setAnalysisResult(result);
    setIsLoading(false);
  };

  const handleAddToLog = () => {
    if (!analysisResult) return;
    const newLogEntry = {
      id: dailyLog.length + 1,
      name: analysisResult.name,
      calories: analysisResult.calories,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };
    setDailyLog([...dailyLog, newLogEntry]);
    setAnalysisResult(null);
    setImagePreview(null);
    setImageFile(null);
  };
  
  const totalCalories = dailyLog.reduce((sum, item) => sum + item.calories, 0);


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
            <Flame className="h-8 w-8 text-orange-600" />
            Calorie Counter
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Track your daily calorie intake and burn with AI-powered food recognition
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left Column: Image Upload and Analysis */}
          <div className="lg:col-span-3">
            <Card className="border-2 shadow-lg h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
                  <Camera className="h-6 w-6" />
                  Log Your Meal
                </CardTitle>
                <CardDescription>Upload a photo of your food to analyze its calorie content.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label htmlFor="food-upload" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Upload Image
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="flex text-sm text-gray-600 dark:text-gray-400">
                        <label htmlFor="food-upload" className="relative cursor-pointer bg-white dark:bg-slate-800 rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                          <span>Upload a file</span>
                          <input id="food-upload" name="food-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
                </div>

                {imagePreview && (
                  <div className="space-y-4">
                    <div className="w-full h-64 relative rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                      <Image src={imagePreview} alt="Food preview" layout="fill" objectFit="cover" />
                    </div>
                    <Button onClick={handleAnalyzeClick} disabled={isLoading} className="w-full" variant="gradient">
                      {isLoading ? 'Analyzing...' : 'Analyze Food'}
                      <Send className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                )}
                
                {analysisResult && (
                  <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                    <CardHeader>
                      <CardTitle className="text-lg">Analysis Result</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-800 dark:text-gray-200">Food:</span>
                        <span className="font-bold text-lg text-green-700 dark:text-green-300">{analysisResult.name}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-800 dark:text-gray-200">Calories:</span>
                        <span className="font-bold text-lg text-green-700 dark:text-green-300">{analysisResult.calories} kcal</span>
                      </div>
                      <Button onClick={handleAddToLog} className="w-full mt-4" variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Add to Daily Log
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Daily Log */}
          <div className="lg:col-span-2">
            <Card className="border-2 shadow-lg h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
                  <Utensils className="h-6 w-6" />
                  Today's Log
                </CardTitle>
                <CardDescription>Your calorie intake for today.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dailyLog.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-gray-200">{item.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{item.time}</p>
                      </div>
                      <span className="font-bold text-gray-900 dark:text-gray-100">{item.calories} kcal</span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t-2 border-dashed dark:border-gray-700 mt-6 pt-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span className="text-gray-800 dark:text-gray-200">Total Today:</span>
                    <span className="text-indigo-600 dark:text-indigo-400">{totalCalories} kcal</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

