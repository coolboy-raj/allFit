"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Activity, 
  LogOut, 
  Settings, 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  Calendar, 
  FileText, 
  BarChart3,
  Shield,
  Target,
  Clock,
  Award
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { getCurrentUser, logout, isAuthenticated } from "@/lib/api/googleAuth";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      router.push('/');
      return;
    }

    const currentUser = getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      logout();
    }
  };

  if (isLoading) {
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
                    {user.name?.charAt(0) || 'C'}
                  </div>
                )}
                <div>
                  <div className="font-semibold text-gray-900 dark:text-gray-100">
                    Welcome, Coach {user.name}!
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Professional Athlete Management Dashboard
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Quick Access Cards */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Quick Access</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Injury Analysis - ACTIVE */}
              <Card 
                className="border-2 border-red-300 dark:border-red-700 hover:border-red-400 dark:hover:border-red-600 transition-all cursor-pointer hover:shadow-lg bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30"
                onClick={() => router.push('/injury-analysis')}
              >
                <CardHeader>
                  <div className="h-12 w-12 bg-red-500 text-white rounded-lg flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-red-900 dark:text-red-100">Injury Analysis</CardTitle>
                  <CardDescription className="text-red-700 dark:text-red-300">
                    AI-powered injury prediction and prevention
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm font-semibold text-red-600 dark:text-red-400">
                    ✓ ACTIVE
                  </div>
                </CardContent>
              </Card>

              {/* Athlete Roster - Coming Soon */}
              <Card className="border-2 border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600 transition-all cursor-pointer hover:shadow-lg opacity-60">
                <CardHeader>
                  <div className="h-12 w-12 bg-gray-400 text-white rounded-lg flex items-center justify-center mb-4">
                    <Users className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-gray-900 dark:text-gray-100">Athlete Roster</CardTitle>
                  <CardDescription>
                    Manage all your athletes in one place
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                    Coming Soon
                  </div>
                </CardContent>
              </Card>

              {/* Recovery Monitoring - Coming Soon */}
              <Card className="border-2 border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600 transition-all cursor-pointer hover:shadow-lg opacity-60">
                <CardHeader>
                  <div className="h-12 w-12 bg-gray-400 text-white rounded-lg flex items-center justify-center mb-4">
                    <Clock className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-gray-900 dark:text-gray-100">Recovery Monitoring</CardTitle>
                  <CardDescription>
                    Track recovery metrics and optimize rest periods
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                    Coming Soon
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Coming Soon Features */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Coming Soon</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Schedule Management */}
              <Card className="border-2 border-gray-200 dark:border-gray-800 opacity-60">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Schedule Management</CardTitle>
                      <CardDescription className="text-sm">Coming Soon</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Manage training schedules, competitions, and recovery periods
                  </p>
                </CardContent>
              </Card>

              {/* Nutrition Planning */}
              <Card className="border-2 border-gray-200 dark:border-gray-800 opacity-60">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                      <Award className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Nutrition Planning</CardTitle>
                      <CardDescription className="text-sm">Coming Soon</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Create personalized nutrition plans for optimal performance
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-indigo-100 dark:border-indigo-900/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="font-semibold text-gray-900 dark:text-gray-100">TotalFit</span>
              <span className="text-gray-400 dark:text-gray-500">|</span>
              <span>Professional Athlete Management</span>
            </div>
            <div className="mt-2 md:mt-0">
              <span>Your athletes' data is private and secure</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
