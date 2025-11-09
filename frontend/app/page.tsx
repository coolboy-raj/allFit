"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { Activity, Heart, TrendingUp, Shield, Brain, Zap } from "lucide-react";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header/Navigation - Floating over video */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-black/80 backdrop-blur-md border-b border-white/10' 
          : 'bg-transparent border-b border-transparent'
      }`}>
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-white drop-shadow-lg" />
            <span className="text-xl font-medium text-white drop-shadow-lg">
              TotalFit
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={handleGoogleConnect}>
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section with Video Background */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
        
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-5xl md:text-7xl font-medium leading-tight text-white drop-shadow-2xl">
              Manage Your Athletes With
              <br />
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent animate-gradient-shimmer bg-[length:200%_auto]">
                  Probabilistic Algorithmic Calculations
                </span>
                <span className="absolute inset-0 blur-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 animate-gradient-shimmer" />
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto drop-shadow-lg">
              Prevent injuries. Optimize performance.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-8">
              <Button 
                size="lg" 
                onClick={handleGoogleConnect}
                className="gap-2"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.30-4.53 6.16-4.53z"/>
                </svg>
                Get Started Free
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="backdrop-blur-md bg-white/5 h-[44px]"
                onClick={scrollToFeatures}
              >
                Learn More
              </Button>
            </div>

            <div className="pt-12 flex items-center justify-center gap-8 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>Privacy First</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                <span>Zero Setup</span>
              </div>
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                <span>AI-Powered</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-2 bg-white/30 rounded-full" />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-medium text-white mb-4">
            Everything You Need to Manage Your Team
          </h2>
          <p className="text-base text-white/50 max-w-2xl mx-auto">
            Professional athlete management platform. Track multiple athletes, prevent injuries, and optimize performance.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
          <Card className="hover:border-white/10 transition-colors group">
            <CardHeader>
              <div className="h-10 w-10 bg-blue-500/10 rounded-md flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                <Activity className="h-5 w-5 text-blue-400" />
              </div>
              <CardTitle>Athlete Dashboard</CardTitle>
              <CardDescription>
                Comprehensive dashboard for each athlete showing performance metrics, health scores, and training load.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:border-white/10 transition-colors group">
            <CardHeader>
              <div className="h-10 w-10 bg-red-500/10 rounded-md flex items-center justify-center mb-4 group-hover:bg-red-500/20 transition-colors">
                <Shield className="h-5 w-5 text-red-400" />
              </div>
              <CardTitle>Injury Risk Detection</CardTitle>
              <CardDescription>
                AI analyzes training patterns for each athlete to predict and prevent injuries before they happen.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:border-white/10 transition-colors group">
            <CardHeader>
              <div className="h-10 w-10 bg-purple-500/10 rounded-md flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
                <Brain className="h-5 w-5 text-purple-400" />
              </div>
              <CardTitle>Personalized Recommendations</CardTitle>
              <CardDescription>
                Personalized training recommendations for each athlete based on workload, recovery, and performance data.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:border-white/10 transition-colors group">
            <CardHeader>
              <div className="h-10 w-10 bg-green-500/10 rounded-md flex items-center justify-center mb-4 group-hover:bg-green-500/20 transition-colors">
                <Heart className="h-5 w-5 text-green-400" />
              </div>
              <CardTitle>Multi-Athlete Management</CardTitle>
              <CardDescription>
                Manage entire rosters, teams, or individual clients. Switch between athletes seamlessly.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:border-white/10 transition-colors group">
            <CardHeader>
              <div className="h-10 w-10 bg-amber-500/10 rounded-md flex items-center justify-center mb-4 group-hover:bg-amber-500/20 transition-colors">
                <TrendingUp className="h-5 w-5 text-amber-400" />
              </div>
              <CardTitle>Performance Analytics</CardTitle>
              <CardDescription>
                Beautiful charts showing training load, workload distribution, and body part stress over time.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:border-white/10 transition-colors group">
            <CardHeader>
              <div className="h-10 w-10 bg-yellow-500/10 rounded-md flex items-center justify-center mb-4 group-hover:bg-yellow-500/20 transition-colors">
                <Zap className="h-5 w-5 text-yellow-400" />
              </div>
              <CardTitle>Smart Alerts</CardTitle>
              <CardDescription>
                Instant notifications when any athlete's injury risk is elevated or needs attention.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-[#0a0a0a] border-y border-white/5 py-20 my-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-medium text-white mb-4">
              How It Works
            </h2>
            <p className="text-base text-white/50">
              Get started in just 2 minutes
            </p>
          </div>

          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
            <Card className="group hover:border-white/10 transition-colors">
              <CardHeader className="text-center pb-4">
                <div className="h-14 w-14 bg-blue-500/10 text-blue-400 rounded-md flex items-center justify-center text-2xl font-medium mx-auto mb-4 group-hover:bg-blue-500/20 transition-colors">
                  1
                </div>
                <CardTitle className="text-lg">Setup Your Profile</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription>
                  Create your coach account and set up your profile in minutes.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:border-white/10 transition-colors">
              <CardHeader className="text-center pb-4">
                <div className="h-14 w-14 bg-purple-500/10 text-purple-400 rounded-md flex items-center justify-center text-2xl font-medium mx-auto mb-4 group-hover:bg-purple-500/20 transition-colors">
                  2
                </div>
                <CardTitle className="text-lg">Add Your Athletes</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription>
                  Create athlete profiles and log their training activities and sports data.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:border-white/10 transition-colors">
              <CardHeader className="text-center pb-4">
                <div className="h-14 w-14 bg-green-500/10 text-green-400 rounded-md flex items-center justify-center text-2xl font-medium mx-auto mb-4 group-hover:bg-green-500/20 transition-colors">
                  3
                </div>
                <CardTitle className="text-lg">Get Mathematical Insights</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription>
                  Receive injury predictions, workload analysis, and training recommendations.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-black">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Activity className="h-5 w-5 text-white" />
              <span className="text-base font-medium text-white">
                TotalFit
              </span>
            </div>
            <p className="text-sm text-white/30">
              © 2025 TotalFit. AI-Powered Health Tracking & Insights.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
