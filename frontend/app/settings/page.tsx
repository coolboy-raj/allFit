"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { Activity, User, Bell, Target, LogOut, Save } from "lucide-react";
import { getCurrentUser, logout, isAuthenticated } from "@/lib/api/googleAuth";

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    units: "metric",
    dailyStepGoal: 10000,
    dailyActiveMinutesGoal: 60,
    sleepGoal: 8,
    notifications: true,
    weeklyReports: true,
  });

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      router.push('/');
      return;
    }

    const currentUser = getCurrentUser();
    setUser(currentUser);

    // Load saved settings from localStorage
    const savedSettings = localStorage.getItem('user_settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, [router]);

  const handleSaveSettings = () => {
    setLoading(true);
    
    // Save to localStorage
    localStorage.setItem('user_settings', JSON.stringify(settings));
    
    setTimeout(() => {
      setLoading(false);
      alert('Settings saved successfully!');
    }, 500);
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  const handleChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/20"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-white/5 bg-black/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-6 w-6 text-white" />
              <span className="text-xl font-medium text-white">
                TotalFit
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={() => router.push('/dashboard')}>
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-2xl font-medium text-white mb-2">Settings</h1>
        <p className="text-sm text-white/50 mb-8">Manage your coach profile and platform preferences</p>

        <div className="space-y-6">
          {/* Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-4 w-4 text-white" />
                Coach Profile
              </CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                {user.picture && (
                  <img
                    src={user.picture}
                    alt={user.name}
                    className="h-12 w-12 rounded-full"
                  />
                )}
                <div>
                  <div className="font-medium text-white">{user.name}</div>
                  <div className="text-sm text-white/50">{user.email}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Goals Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-4 w-4 text-white" />
                Default Athlete Goals
              </CardTitle>
              <CardDescription>Set default targets for new athlete profiles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Daily Step Goal
                </label>
                <input
                  type="number"
                  min="1000"
                  max="50000"
                  step="1000"
                  value={settings.dailyStepGoal}
                  onChange={(e) => handleChange('dailyStepGoal', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-white/10 rounded-md focus:ring-1 focus:ring-white/20 focus:border-white/20 text-white bg-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Daily Active Minutes Goal
                </label>
                <input
                  type="number"
                  min="10"
                  max="300"
                  step="5"
                  value={settings.dailyActiveMinutesGoal}
                  onChange={(e) => handleChange('dailyActiveMinutesGoal', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-white/10 rounded-md focus:ring-1 focus:ring-white/20 focus:border-white/20 text-white bg-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Sleep Goal (hours)
                </label>
                <input
                  type="number"
                  min="4"
                  max="12"
                  step="0.5"
                  value={settings.sleepGoal}
                  onChange={(e) => handleChange('sleepGoal', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-white/10 rounded-md focus:ring-1 focus:ring-white/20 focus:border-white/20 text-white bg-black"
                />
              </div>
            </CardContent>
          </Card>

          {/* Preferences Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-white" />
                Preferences
              </CardTitle>
              <CardDescription>Customize your experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Units
                </label>
                <select
                  value={settings.units}
                  onChange={(e) => handleChange('units', e.target.value)}
                  className="w-full px-3 py-2 border border-white/10 rounded-md focus:ring-1 focus:ring-white/20 focus:border-white/20 text-white bg-black"
                >
                  <option value="metric">Metric (km, kg)</option>
                  <option value="imperial">Imperial (miles, lbs)</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3 bg-white/[0.02] rounded-md border border-white/5">
                <div>
                  <div className="font-medium text-white text-sm">Daily Notifications</div>
                  <div className="text-xs text-white/40">
                    Receive reminders to log your data
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications}
                  onChange={(e) => handleChange('notifications', e.target.checked)}
                  className="h-4 w-4 rounded border-white/10"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-white/[0.02] rounded-md border border-white/5">
                <div>
                  <div className="font-medium text-white text-sm">Weekly Reports</div>
                  <div className="text-xs text-white/40">
                    Get weekly health summaries via email
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.weeklyReports}
                  onChange={(e) => handleChange('weeklyReports', e.target.checked)}
                  className="h-4 w-4 rounded border-white/10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={handleSaveSettings}
              disabled={loading}
              className="flex-1 gap-2"
            >
              <Save className="h-4 w-4" />
              {loading ? 'Saving...' : 'Save Settings'}
            </Button>

            <Button
              variant="outline"
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

