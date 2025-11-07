"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { Activity, Heart, TrendingUp, Shield, Brain, Zap } from "lucide-react";

export default function Home() {
  const handleGoogleConnect = () => {
    // Check if environment variables are configured
    if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 
        process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID === '' ||
        process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID === 'your_google_client_id_here') {
      alert("Google OAuth is not configured yet. Please add your credentials to .env.local\n\nFor demo purposes, you'll be redirected to the dashboard where you can manually enter your health data.");
      window.location.href = "/dashboard";
      return;
    }

    // Initiate Google Sign-In OAuth flow (for authentication only)
    const { initiateGoogleAuth } = require("@/lib/api/googleAuth");
    initiateGoogleAuth();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header/Navigation */}
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TotalFit
            </span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="outline" size="sm" onClick={handleGoogleConnect}>
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-4">
            <Zap className="h-4 w-4" />
            <span>AI-Powered Health Insights</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold leading-tight text-gray-900 dark:text-gray-100">
            Manage Your Athletes With
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}AI-Powered Insights
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Professional athlete management platform for coaches and trainers. Track performance, 
            prevent injuries, and optimize training with AI-powered analysis.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button 
              variant="gradient" 
              size="xl" 
              onClick={handleGoogleConnect}
              className="gap-3"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Get Started Free
            </Button>
            <Button variant="outline" size="xl">
              Learn More
            </Button>
          </div>

          <div className="pt-8 flex items-center justify-center gap-8 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-600" />
              <span>Privacy First</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-blue-600" />
              <span>Zero Setup</span>
            </div>
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-purple-600" />
              <span>AI-Powered</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Everything You Need to Manage Your Team
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Professional athlete management platform. Track multiple athletes, prevent injuries, and optimize performance.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="border-2 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
            <CardHeader>
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                <Activity className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-blue-900 dark:text-blue-100">Athlete Dashboard</CardTitle>
              <CardDescription>
                Comprehensive dashboard for each athlete showing performance metrics, health scores, and training load.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-red-300 dark:hover:border-red-700 transition-colors">
            <CardHeader>
              <div className="h-12 w-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <CardTitle className="text-blue-900 dark:text-blue-100">Injury Risk Detection</CardTitle>
              <CardDescription>
                AI analyzes training patterns for each athlete to predict and prevent injuries before they happen.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-purple-300 dark:hover:border-purple-700 transition-colors">
            <CardHeader>
              <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle className="text-blue-900 dark:text-blue-100">AI Recommendations</CardTitle>
              <CardDescription>
                Personalized training recommendations for each athlete based on workload, recovery, and performance data.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-green-300 dark:hover:border-green-700 transition-colors">
            <CardHeader>
              <div className="h-12 w-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-blue-900 dark:text-blue-100">Multi-Athlete Management</CardTitle>
              <CardDescription>
                Manage entire rosters, teams, or individual clients. Switch between athletes seamlessly.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-yellow-300 dark:hover:border-yellow-700 transition-colors">
            <CardHeader>
              <div className="h-12 w-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <CardTitle className="text-blue-900 dark:text-blue-100">Performance Analytics</CardTitle>
              <CardDescription>
                Beautiful charts showing training load, workload distribution, and body part stress over time.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
            <CardHeader>
              <div className="h-12 w-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <CardTitle className="text-blue-900 dark:text-blue-100">Smart Alerts</CardTitle>
              <CardDescription>
                Instant notifications when any athlete's injury risk is elevated or needs attention.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-3xl my-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Get started in just 2 minutes
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="h-16 w-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              1
            </div>
            <h3 className="text-xl font-semibold mb-2 dark:text-gray-100">Setup Your Profile</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Create your coach account and set up your profile in minutes.
            </p>
          </div>

          <div className="text-center">
            <div className="h-16 w-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              2
            </div>
            <h3 className="text-xl font-semibold mb-2 dark:text-gray-100">Add Your Athletes</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Create athlete profiles and log their training activities and sports data.
            </p>
          </div>

          <div className="text-center">
            <div className="h-16 w-16 bg-pink-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="text-xl font-semibold mb-2 dark:text-gray-100">Get AI Insights</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Receive injury predictions, workload analysis, and training recommendations.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Optimize Your Athletes' Performance?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join professional coaches and trainers using TotalFit to prevent injuries and maximize athletic performance.
          </p>
          <Button 
            size="xl" 
            className="bg-white text-blue-600 hover:bg-gray-100"
            onClick={handleGoogleConnect}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.30-4.53 6.16-4.53z"/>
            </svg>
            Start Tracking - It's Free
          </Button>
          <p className="mt-4 text-sm text-blue-100">
            No credit card required • Cancel anytime • Privacy first
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Activity className="h-6 w-6 text-blue-600" />
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TotalFit
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              © 2025 TotalFit. AI-Powered Health Tracking & Insights.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
