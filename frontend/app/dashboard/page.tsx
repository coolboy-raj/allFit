"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Activity, LogOut, RefreshCw, Settings, Plus, AlertCircle } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { HealthScoreCard } from "@/components/dashboard/health-score-card";
import { CalorieCounterCard } from "@/components/dashboard/calorie-counter-card";
import { InjuryAnalysisCard } from "@/components/dashboard/injury-analysis-card";
import { TrackWorkoutCard } from "@/components/dashboard/track-workout-card";
import { WeeklyActivityChart } from "@/components/dashboard/weekly-activity-chart";
import { RecommendationsCard } from "@/components/dashboard/recommendations-card";
import { QuickLogForm, QuickLogData } from "@/components/dashboard/quick-log-form";
import { DashboardData, HealthMetrics } from "@/types";
import { getCurrentUser, logout, isAuthenticated } from "@/lib/api/googleAuth";
import { getHealthMetrics as getSupabaseMetrics, upsertHealthMetrics as saveSupabaseMetrics, getLatestHealthScore as getSupabaseScore, upsertHealthScore as saveSupabaseScore, getLatestInjuryRisk as getSupabaseRisk, insertInjuryRisk as saveSupabaseRisk, getLatestRecommendations as getSupabaseRecs, insertRecommendations as saveSupabaseRecs } from "@/lib/supabase/database";
import { getHealthMetrics as getLocalMetrics, saveHealthMetrics as saveLocalMetrics, getLatestHealthScore as getLocalScore, saveHealthScore as saveLocalScore, getLatestInjuryRisk as getLocalRisk, saveInjuryRisk as saveLocalRisk, getLatestRecommendations as getLocalRecs, saveRecommendations as saveLocalRecs, isSupabaseConfigured } from "@/lib/storage/localStorage";
import { calculateHealthScore } from "@/lib/ai/healthScoring";
import { calculateInjuryRisk } from "@/lib/ai/injuryRisk";
import { generateRecommendations } from "@/lib/ai/recommendations";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLogForm, setShowLogForm] = useState(false);
  const [lastSync, setLastSync] = useState(new Date());
  const [hasData, setHasData] = useState(false);
  const [useLocalStorage, setUseLocalStorage] = useState(false);

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      router.push('/');
      return;
    }

    const currentUser = getCurrentUser();
    setUser(currentUser);
    
    // Check if Supabase is configured
    const supabaseConfigured = isSupabaseConfigured();
    setUseLocalStorage(!supabaseConfigured);
    
    if (!supabaseConfigured) {
      console.log('ℹ️ Supabase not configured - using localStorage');
      console.log('📝 To enable cloud storage, set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
    } else {
      console.log('☁️ Supabase configured - using cloud storage');
    }
    
    // Load dashboard data
    console.log('[Dashboard] 📊 Loading dashboard data for user:', currentUser?.id?.substring(0, 8) + '...');
    loadDashboardData(currentUser?.id);
  }, [router]);

  const loadDashboardData = async (userId: string | undefined) => {
    if (!userId) {
      console.log('[Dashboard] ⚠️ No userId provided, skipping data load');
      return;
    }
    
    console.log('[Dashboard] 🔄 Loading dashboard data...');
    setIsLoading(true);
    try {
      let weeklyMetrics: HealthMetrics[] = [];
      let latestHealthScore: any = null;
      let latestInjuryRisk: any = null;
      let recommendations: any[] = [];

      if (useLocalStorage) {
        console.log('[Dashboard] 💾 Using localStorage for data');
        // Load from localStorage
        const localMetrics = getLocalMetrics(userId, 7);
        
        if (localMetrics && localMetrics.length > 0) {
          console.log('[Dashboard] ✅ Found', localMetrics.length, 'records in localStorage');
          setHasData(true);
          weeklyMetrics = localMetrics.slice(0, 7);
          latestHealthScore = getLocalScore(userId);
          latestInjuryRisk = getLocalRisk(userId);
          recommendations = getLocalRecs(userId, 5);
        } else {
          console.log('[Dashboard] ℹ️ No data in localStorage');
          setHasData(false);
        }
      } else {
        console.log('[Dashboard] ☁️ Using Supabase for data');
        // Load from Supabase
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);

        const metricsData = await getSupabaseMetrics(userId, startDate, endDate);
        
        if (metricsData && metricsData.length > 0) {
          console.log('[Dashboard] ✅ Found', metricsData.length, 'records in Supabase');
          setHasData(true);
          
          // Convert to HealthMetrics format
          weeklyMetrics = metricsData.map((record) => ({
            date: new Date(record.date),
            steps: record.steps,
            activeMinutes: record.active_minutes,
            heartRate: record.heart_rate_avg,
            sleepHours: record.sleep_hours,
            caloriesBurned: record.calories_burned,
            workoutSessions: [],
          }));

          // Get AI-generated data
          const [score, risk, recs] = await Promise.all([
            getSupabaseScore(userId).catch(() => null),
            getSupabaseRisk(userId).catch(() => null),
            getSupabaseRecs(userId, 5).catch(() => []),
          ]);
          
          latestHealthScore = score;
          latestInjuryRisk = risk;
          recommendations = recs;
        } else {
          console.log('[Dashboard] ℹ️ No data in Supabase');
          setHasData(false);
        }
      }

      if (weeklyMetrics.length > 0) {
        console.log('[Dashboard] 📈 Building dashboard with', weeklyMetrics.length, 'metrics');
        setDashboardData({
          user: {
            id: userId,
            email: user?.email || "",
            name: user?.name || "",
            googleId: userId,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          healthScore: latestHealthScore ? (useLocalStorage ? latestHealthScore : {
            id: latestHealthScore.id,
            userId: latestHealthScore.user_id,
            date: new Date(latestHealthScore.date),
            overallScore: latestHealthScore.overall_score,
            activityLevel: latestHealthScore.activity_level,
            sleepQuality: latestHealthScore.sleep_quality,
            recoveryScore: latestHealthScore.recovery_score,
            consistency: latestHealthScore.consistency,
          }) : calculateHealthScore(weeklyMetrics),
          injuryRisk: latestInjuryRisk || calculateInjuryRisk(weeklyMetrics),
          weeklyMetrics,
          recommendations: useLocalStorage ? recommendations : recommendations.map((rec) => ({
            id: rec.id,
            userId: rec.user_id,
            date: new Date(rec.date),
            type: rec.type as any,
            title: rec.title,
            description: rec.description,
            priority: rec.priority as any,
            completed: rec.completed,
          })),
        });
      }
    } catch (error) {
      console.error('[Dashboard] ❌ Error loading dashboard data:', error);
      console.error('[Dashboard] 💡 Check that Supabase is configured correctly');
      setHasData(false);
    } finally {
      console.log('[Dashboard] ✅ Dashboard load complete. Has data:', hasData);
      setIsLoading(false);
    }
  };

  const handleLogData = async (data: QuickLogData) => {
    if (!user?.id) {
      console.log('[Dashboard] ⚠️ No user ID, cannot log data');
      return;
    }

    console.log('[Dashboard] 📝 Logging new data:', {
      date: data.date,
      steps: data.steps,
      activeMinutes: data.activeMinutes,
      sleepHours: data.sleepHours,
    });

    try {
      // Convert QuickLogData to HealthMetrics
      const metrics: HealthMetrics = {
        date: data.date,
        steps: data.steps,
        activeMinutes: data.activeMinutes,
        heartRate: data.heartRate || 0,
        sleepHours: data.sleepHours,
        caloriesBurned: data.caloriesBurned || 0,
        workoutSessions: [],
      };

      if (useLocalStorage) {
        console.log('[Dashboard] 💾 Saving to localStorage...');
        // Save to localStorage
        saveLocalMetrics(user.id, metrics);
        console.log('[Dashboard] ✅ Saved to localStorage');
      } else {
        console.log('[Dashboard] ☁️ Saving to Supabase...');
        
        try {
          // Save to Supabase
          await saveSupabaseMetrics(user.id, metrics);
          console.log('[Dashboard] ✅ Saved to Supabase');
        } catch (error: any) {
          // Check if it's a foreign key error (user doesn't exist)
          if (error?.code === '23503' || error?.message?.includes('foreign key')) {
            console.log('[Dashboard] 🔧 User not found in database, creating user...');
            
            // Create the user in Supabase
            try {
              await fetch('/api/users/upsert', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  googleId: user.id,
                  email: user.email,
                  name: user.name,
                  pictureUrl: user.picture,
                }),
              });
              
              console.log('[Dashboard] ✅ User created, retrying save...');
              
              // Retry saving metrics
              await saveSupabaseMetrics(user.id, metrics);
              console.log('[Dashboard] ✅ Saved to Supabase after user creation');
            } catch (retryError) {
              console.error('[Dashboard] ❌ Failed to create user and save:', retryError);
              throw retryError;
            }
          } else {
            throw error;
          }
        }
      }

      // Recalculate AI scores
      console.log('[Dashboard] 🤖 Recalculating AI scores...');
      await handleSync();

      console.log('[Dashboard] ✅ Data logged successfully!');
      alert("Data logged successfully!");
    } catch (error) {
      console.error('[Dashboard] ❌ Error logging data:', error);
      console.error('[Dashboard] 💡 Full error details:', JSON.stringify(error, null, 2));
      throw error;
    }
  };

  const handleSync = async () => {
    if (!user?.id) {
      console.log('[Dashboard] ⚠️ No user ID, cannot sync');
      return;
    }
    
    console.log('[Dashboard] 🔄 Starting sync/recalculation...');
    setIsLoading(true);
    try {
      let weeklyMetrics: HealthMetrics[] = [];

      if (useLocalStorage) {
        console.log('[Dashboard] 💾 Getting data from localStorage...');
        // Get from localStorage
        weeklyMetrics = getLocalMetrics(user.id, 7).slice(0, 7);
        console.log('[Dashboard] ✅ Got', weeklyMetrics.length, 'records from localStorage');
      } else {
        console.log('[Dashboard] ☁️ Getting data from Supabase...');
        // Get from Supabase
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);

        const metricsData = await getSupabaseMetrics(user.id, startDate, endDate);
        
        if (metricsData) {
          weeklyMetrics = metricsData.map((record) => ({
            date: new Date(record.date),
            steps: record.steps,
            activeMinutes: record.active_minutes,
            heartRate: record.heart_rate_avg,
            sleepHours: record.sleep_hours,
            caloriesBurned: record.calories_burned,
            workoutSessions: [],
          }));
        }
      }
      
      if (weeklyMetrics.length > 0) {
        console.log('[Dashboard] 🧮 Calculating AI scores for', weeklyMetrics.length, 'days of data...');
        
        // Calculate AI scores
        const healthScore = calculateHealthScore(weeklyMetrics);
        console.log('[Dashboard] 💯 Health score calculated:', healthScore.overallScore);
        
        const injuryRisk = calculateInjuryRisk(weeklyMetrics);
        console.log('[Dashboard] ⚠️ Injury risk calculated:', injuryRisk.level, '(' + injuryRisk.score + ')');
        
        const recommendations = generateRecommendations(
          weeklyMetrics,
          healthScore,
          injuryRisk,
          user.id
        );
        console.log('[Dashboard] 🤖 Generated', recommendations.length, 'recommendations');

        if (useLocalStorage) {
          console.log('[Dashboard] 💾 Saving AI results to localStorage...');
          // Save to localStorage
          saveLocalScore(user.id, healthScore);
          saveLocalRisk(user.id, injuryRisk);
          saveLocalRecs(user.id, recommendations);
          console.log('[Dashboard] ✅ AI results saved to localStorage');
        } else {
          console.log('[Dashboard] ☁️ Saving AI results to Supabase...');
          // Save to Supabase
          await Promise.all([
            saveSupabaseScore(user.id, healthScore),
            saveSupabaseRisk(user.id, injuryRisk),
            saveSupabaseRecs(user.id, recommendations),
          ]);
          console.log('[Dashboard] ✅ AI results saved to Supabase');
        }

        // Reload dashboard
        console.log('[Dashboard] 🔄 Reloading dashboard with new data...');
        await loadDashboardData(user.id);
        setLastSync(new Date());
        console.log('[Dashboard] ✅ Sync complete!');
      } else {
        console.log('[Dashboard] ℹ️ No metrics to sync');
      }
    } catch (error) {
      console.error('[Dashboard] ❌ Error syncing data:', error);
      console.error('[Dashboard] 💡 Full error details:', JSON.stringify(error, null, 2));
      alert("Failed to sync data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      logout();
    }
  };

  if (isLoading && !dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      {/* Quick Log Form Modal */}
      {showLogForm && (
        <QuickLogForm
          onSubmit={handleLogData}
          onClose={() => setShowLogForm(false)}
        />
      )}

      {/* Header/Navigation */}
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
              <Button
                variant="gradient"
                size="sm"
                onClick={() => setShowLogForm(true)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Log Data
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleSync}
                disabled={isLoading}
                className="gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Syncing...' : 'Refresh'}
              </Button>
              
              <ThemeToggle />
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-2"
                onClick={() => router.push('/settings')}
              >
                <Settings className="h-4 w-4" />
                Settings
              </Button>

              <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>

          {/* User Info Bar */}
          {user && (
            <div className="mt-4 flex items-center justify-between py-3 px-4 bg-gradient-to-r from-indigo-100 via-blue-100 to-purple-100 dark:from-indigo-900/40 dark:via-blue-900/40 dark:to-purple-900/40 rounded-xl border border-indigo-200/50 dark:border-indigo-700/30 shadow-sm">
              <div className="flex items-center gap-3">
                {user.picture ? (
                  <img src={user.picture} alt={user.name} className="h-10 w-10 rounded-full" />
                ) : (
                  <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {user.name?.charAt(0) || 'U'}
                  </div>
                )}
                <div>
                  <div className="font-semibold text-gray-900 dark:text-gray-100">
                    Welcome back, {user.name}!
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {hasData ? `Last synced: ${lastSync.toLocaleTimeString()}` : 'No data logged yet'}
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {useLocalStorage ? 'Local Storage Mode' : 'Cloud Storage'} 
                </span> ✓
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className="container mx-auto px-4 py-8">
        {!hasData || !dashboardData ? (
          /* Empty State */
          <div className="max-w-2xl mx-auto text-center py-20">
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-2xl p-12 shadow-xl border-2 border-dashed border-indigo-300 dark:border-indigo-700">
              <AlertCircle className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                No Data Yet
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Start your health journey by logging your first day of activity data.
                Track your steps, sleep, and exercise to get personalized AI insights!
              </p>
              <Button
                variant="gradient"
                size="lg"
                onClick={() => setShowLogForm(true)}
                className="gap-2"
              >
                <Plus className="h-5 w-5" />
                Log Your First Day
              </Button>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">
                💡 Tip: Log at least 3 days of data to get AI-powered health insights and recommendations
              </p>
            </div>
          </div>
        ) : (
          /* Dashboard with Data */
          <div className="space-y-8">
            {/* Top Section: Health Score */}
            <div className="grid lg:grid-cols-1 gap-6">
              <HealthScoreCard healthScore={dashboardData.healthScore} />
            </div>

            {/* Feature Cards Section */}
            <div className="grid lg:grid-cols-3 gap-6">
              <CalorieCounterCard />
              <InjuryAnalysisCard />
              <TrackWorkoutCard />
            </div>

            {/* Middle Section: Weekly Activity Chart */}
            <div className="grid lg:grid-cols-1 gap-6">
              <WeeklyActivityChart weeklyMetrics={dashboardData.weeklyMetrics} />
            </div>

            {/* Bottom Section: AI Recommendations */}
            <div className="grid lg:grid-cols-1 gap-6">
              <RecommendationsCard recommendations={dashboardData.recommendations} />
            </div>

            {/* Quick Stats Footer */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 p-5 rounded-xl border border-blue-200 dark:border-blue-800/50 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {dashboardData.weeklyMetrics[dashboardData.weeklyMetrics.length - 1]?.steps.toLocaleString() || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Steps Today</div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 p-5 rounded-xl border border-green-200 dark:border-green-800/50 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {dashboardData.weeklyMetrics[dashboardData.weeklyMetrics.length - 1]?.activeMinutes || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Active Minutes</div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 p-5 rounded-xl border border-purple-200 dark:border-purple-800/50 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {dashboardData.weeklyMetrics[dashboardData.weeklyMetrics.length - 1]?.sleepHours || 0}h
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Sleep Last Night</div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/50 dark:to-amber-950/50 p-5 rounded-xl border border-orange-200 dark:border-orange-800/50 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {dashboardData.weeklyMetrics[dashboardData.weeklyMetrics.length - 1]?.caloriesBurned.toLocaleString() || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Calories Burned</div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-indigo-100 dark:border-indigo-900/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="font-semibold text-gray-900 dark:text-gray-100">TotalFit</span>
            </div>
            <div className="mt-2 md:mt-0">
              <span>Your data is private and secure</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

