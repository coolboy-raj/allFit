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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/20 mx-auto mb-4"></div>
          <p className="text-white/50">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header/Navigation */}
      <header className="border-b border-white/5 bg-black/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-6 w-6 text-white" />
              <span className="text-xl font-medium text-white">
                TotalFit
              </span>
            </div>

            <div className="flex items-center gap-2">
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
            <div className="mt-6 flex items-center justify-between py-6 px-6 bg-white/[0.03] rounded-lg border border-white/10">
              <div className="flex items-center gap-4">
                {user.picture ? (
                  <img src={user.picture} alt={user.name} className="h-14 w-14 rounded-full ring-2 ring-white/10" />
                ) : (
                  <div className="h-14 w-14 bg-white/10 rounded-full flex items-center justify-center text-white text-xl font-medium ring-2 ring-white/10">
                    {user.name?.charAt(0) || 'C'}
                  </div>
                )}
                <div>
                  <div className="font-medium text-white text-lg mb-0.5">
                    Coach {user.name}
                  </div>
                  <div className="text-sm text-white/50">
                    Professional Athlete Management Dashboard
                  </div>
                </div>
              </div>
              <div className="text-sm text-white/50 font-medium">
                {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
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
            <h2 className="text-xl font-medium text-white mb-4">Quick Access</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Injury Analysis - ACTIVE */}
              <Card 
                className="group hover:border-white/10 transition-colors cursor-pointer border-red-500/20"
                onClick={() => router.push('/injury-analysis')}
              >
                <CardHeader>
                  <div className="h-10 w-10 bg-red-500/10 rounded-md flex items-center justify-center mb-4 group-hover:bg-red-500/20 transition-colors">
                    <Shield className="h-5 w-5 text-red-400" />
                  </div>
                  <CardTitle>Injury Analysis</CardTitle>
                  <CardDescription>
                    AI-powered injury prediction and prevention
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-green-500/10 border border-green-500/20 rounded-md">
                    <div className="h-1.5 w-1.5 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium text-green-400">Active</span>
                  </div>
                </CardContent>
              </Card>

              {/* Athlete Roster - ACTIVE */}
              <Card 
                className="group hover:border-white/10 transition-colors cursor-pointer border-blue-500/20"
                onClick={() => router.push('/athlete-roster')}
              >
                <CardHeader>
                  <div className="h-10 w-10 bg-blue-500/10 rounded-md flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                    <Users className="h-5 w-5 text-blue-400" />
                  </div>
                  <CardTitle>Athlete Roster</CardTitle>
                  <CardDescription>
                    Manage all your athletes in one place
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-green-500/10 border border-green-500/20 rounded-md">
                    <div className="h-1.5 w-1.5 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium text-green-400">Active</span>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Analysis - ACTIVE */}
              <Card 
                className="group hover:border-white/10 transition-colors cursor-pointer border-purple-500/20"
                onClick={() => router.push('/performance-analysis')}
              >
                <CardHeader>
                  <div className="h-10 w-10 bg-purple-500/10 rounded-md flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
                    <TrendingUp className="h-5 w-5 text-purple-400" />
                  </div>
                  <CardTitle>Performance Analysis</CardTitle>
                  <CardDescription>
                    Track performance metrics and optimize training
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-green-500/10 border border-green-500/20 rounded-md">
                    <div className="h-1.5 w-1.5 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium text-green-400">Active</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Developer Tools */}
          <div>
            <h2 className="text-xl font-medium text-white mb-4">Developer Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Charts Demo */}
              <Card 
                className="group hover:border-white/10 transition-colors cursor-pointer"
                onClick={() => router.push('/charts-demo')}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 bg-blue-500/10 rounded-md flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                      <BarChart3 className="h-4 w-4 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base">Charts Showcase</CardTitle>
                        <div className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded text-[10px] font-medium text-blue-400">
                          <Activity className="h-2.5 w-2.5" />
                          Demo
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-white/60">
                    View all available chart types and styling options
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Coming Soon Features */}
          <div>
            <h2 className="text-xl font-medium text-white mb-4">Coming Soon</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Schedule Management */}
              <Card className="group hover:border-white/10 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 bg-green-500/10 rounded-md flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                      <Calendar className="h-4 w-4 text-green-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base">Schedule Management</CardTitle>
                        <div className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] font-medium text-white/50">
                          <Clock className="h-2.5 w-2.5" />
                          Soon
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-white/60">
                    Manage training schedules, competitions, and recovery periods
                  </p>
                </CardContent>
              </Card>

              {/* Nutrition Planning */}
              <Card className="group hover:border-white/10 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 bg-amber-500/10 rounded-md flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
                      <Award className="h-4 w-4 text-amber-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base">Nutrition Planning</CardTitle>
                        <div className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] font-medium text-white/50">
                          <Clock className="h-2.5 w-2.5" />
                          Soon
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-white/60">
                    Create personalized nutrition plans for optimal performance
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-black mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between text-xs text-white/30">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span className="font-medium text-white/50">TotalFit</span>
              <span>|</span>
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
