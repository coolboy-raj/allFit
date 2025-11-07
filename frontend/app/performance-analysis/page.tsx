"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowLeft,
  TrendingUp,
  Activity,
  Flame,
  Heart,
  Timer,
  Target,
  BarChart3,
  AlertTriangle,
  Trophy,
  Zap,
  TrendingDown,
  Calendar,
  CheckCircle,
  Plus
} from "lucide-react";
import { getCurrentUser, isAuthenticated } from "@/lib/api/googleAuth";
import { AthleteSelector } from "@/components/injury-analysis/athlete-selector";
import type { Athlete } from "@/lib/injury-analysis/database";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

import { Line, Bar } from 'react-chartjs-2';
import {
  createLineChartData,
  createBarChartData,
  createMultiLineChartData,
  createMultiBarChartData,
  lineChartOptions,
  barChartOptions,
  multiLineChartOptions,
  multiBarChartOptions,
  CHART_COLORS,
} from '@/lib/performance-charts';

import { allExamples } from '@/lib/chart-examples';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function PerformanceAnalysisPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activities, setActivities] = useState<any[]>([]);
  const [injuryRiskHistory, setInjuryRiskHistory] = useState<any[]>([]);
  const [bodyPartWorkloads, setBodyPartWorkloads] = useState<any[]>([]);

  // Chart refs
  const dailyChartRef = useRef<ChartJS<'line'>>(null);
  const weeklyChartRef = useRef<ChartJS<'bar'>>(null);
  const riskChartRef = useRef<ChartJS<'line'>>(null);
  const bodyPartChartRef = useRef<ChartJS<'bar'>>(null);

  // Chart refs
  const chart1Ref = useRef<ChartJS<'line'>>(null);
  const chart2Ref = useRef<ChartJS<'bar'>>(null);
  const chart3Ref = useRef<ChartJS<'line'>>(null);
  const chart4Ref = useRef<ChartJS<'line'>>(null);
  const chart5Ref = useRef<ChartJS<'bar'>>(null);
  const chart6Ref = useRef<ChartJS<'line'>>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/');
      return;
    }

    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push('/');
      return;
    }

    setUser(currentUser);
    loadAthletes(currentUser.id);
  }, [router]);

  useEffect(() => {
    if (selectedAthlete) {
      loadAthletePerformanceData(selectedAthlete.id);
    }
  }, [selectedAthlete]);

  async function loadAthletes(userId: string) {
    try {
      setIsLoading(true);
      const { getUserAthletes } = await import('@/lib/injury-analysis/database');
      const userAthletes = await getUserAthletes(userId);
      setAthletes(userAthletes);
      
      if (userAthletes.length > 0) {
        setSelectedAthlete(userAthletes[0]);
      }
    } catch (error) {
      console.error('Error loading athletes:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function loadAthletePerformanceData(athleteId: string) {
    try {
      setIsLoading(true);
      const { getActivityHistory } = await import('@/lib/injury-analysis/database');
      
      const athleteActivities = await getActivityHistory(athleteId, 100, 0);
      setActivities(athleteActivities);

      try {
        const response = await fetch(`http://localhost:5000/api/athletes/${athleteId}/body-part-workloads`);
        if (response.ok) {
          const result = await response.json();
          setBodyPartWorkloads(result.data || []);
        }
      } catch (e) {
        console.log('Body part workloads not available');
      }

      try {
        const riskResponse = await fetch(`http://localhost:5000/api/athletes/${athleteId}/injury-risk-history`);
        if (riskResponse.ok) {
          const riskResult = await riskResponse.json();
          setInjuryRiskHistory(riskResult.data || []);
        }
      } catch (e) {
        console.log('Injury risk history not available');
      }
    } catch (error) {
      console.error('Error loading performance data:', error);
    } finally {
      setIsLoading(false);
    }
  }

  // Daily activity data
  const dailyActivityData = useMemo(() => {
    if (!activities.length) return { labels: [], data: [] };

    const last30Days: any[] = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayActivities = activities.filter(a => a.date === dateStr);

      last30Days.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        count: dayActivities.length,
      });
    }

    return {
      labels: last30Days.map(d => d.date),
      data: last30Days.map(d => d.count),
    };
  }, [activities]);

  // Weekly volume data
  const weeklyVolumeData = useMemo(() => {
    if (!activities.length) return { labels: [], workouts: [], sports: [] };

    const weeklyData: { [key: string]: { workouts: number; sports: number } } = {};
    
    activities.forEach(activity => {
      const date = new Date(activity.date);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekKey = weekStart.toISOString().split('T')[0];

      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = { workouts: 0, sports: 0 };
      }

      if (activity.activity_type === 'workout') {
        weeklyData[weekKey].workouts++;
      } else {
        weeklyData[weekKey].sports++;
      }
    });

    const sorted = Object.entries(weeklyData)
      .map(([date, data]) => ({
        week: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        workouts: data.workouts,
        sports: data.sports,
      }))
      .slice(-12);

    return {
      labels: sorted.map(d => d.week),
      workouts: sorted.map(d => d.workouts),
      sports: sorted.map(d => d.sports),
    };
  }, [activities]);

  // Risk and load data
  const riskLoadData = useMemo(() => {
    if (!injuryRiskHistory.length) return { labels: [], risk: [], trainingLoad: [], recovery: [] };

    const data = injuryRiskHistory
      .slice(-20)
      .reverse()
      .map((snapshot: any) => ({
        date: new Date(snapshot.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        risk: snapshot.overall_risk_score,
        trainingLoad: Math.round(snapshot.training_load_score || 0),
        recovery: Math.round(snapshot.recovery_score || 100),
      }));

    return {
      labels: data.map(d => d.date),
      risk: data.map(d => d.risk),
      trainingLoad: data.map(d => d.trainingLoad),
      recovery: data.map(d => d.recovery),
    };
  }, [injuryRiskHistory]);

  // Body part data
  const bodyPartData = useMemo(() => {
    if (!bodyPartWorkloads.length) return { labels: [], risk: [] };

    const latestWorkloads: { [key: string]: any } = {};
    
    bodyPartWorkloads.forEach(workload => {
      const part = workload.body_part;
      if (!latestWorkloads[part] || new Date(workload.date) > new Date(latestWorkloads[part].date)) {
        latestWorkloads[part] = workload;
      }
    });

    const sorted = Object.values(latestWorkloads)
      .map((w: any) => ({
        name: w.body_part.replace('-', ' ').split(' ').map((word: string) => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' '),
        risk: w.injury_risk_percentage,
      }))
      .sort((a, b) => b.risk - a.risk)
      .slice(0, 8);

    return {
      labels: sorted.map(d => d.name),
      risk: sorted.map(d => d.risk),
    };
  }, [bodyPartWorkloads]);

  // Performance metrics
  const metrics = useMemo(() => {
    if (!activities.length) return null;

    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const recentActivities = activities.filter(a => new Date(a.date) >= last30Days);
    const lastWeekActivities = activities.filter(a => new Date(a.date) >= last7Days);
    
    const totalDuration = activities.reduce((sum, a) => sum + (a.duration || 0), 0);
    const totalCalories = activities.reduce((sum, a) => sum + (a.calories_burned || 0), 0);
    
    const activitiesWithHR = activities.filter(a => a.heart_rate_avg);
    const avgHeartRate = activitiesWithHR.length > 0
      ? Math.round(activitiesWithHR.reduce((sum, a) => sum + (a.heart_rate_avg || 0), 0) / activitiesWithHR.length)
      : 0;

    const maxHeartRate = Math.max(...activities.map(a => a.heart_rate_max || 0));

    const prevWeekStart = new Date();
    prevWeekStart.setDate(prevWeekStart.getDate() - 14);
    const prevWeekEnd = new Date();
    prevWeekEnd.setDate(prevWeekEnd.getDate() - 7);
    const prevWeekActivities = activities.filter(a => {
      const date = new Date(a.date);
      return date >= prevWeekStart && date < prevWeekEnd;
    });

    const activityTrend = lastWeekActivities.length - prevWeekActivities.length;
    const durationTrend = lastWeekActivities.reduce((s, a) => s + (a.duration || 0), 0) - 
                          prevWeekActivities.reduce((s, a) => s + (a.duration || 0), 0);

    return {
      totalActivities: activities.length,
      recentCount: recentActivities.length,
      lastWeekCount: lastWeekActivities.length,
      totalDuration: Math.round(totalDuration / 60),
      avgDuration: Math.round(totalDuration / activities.length),
      totalCalories,
      avgCalories: Math.round(totalCalories / activities.length),
      avgHeartRate,
      maxHeartRate,
      activityTrend,
      durationTrend: Math.round(durationTrend / 60),
      workoutCount: activities.filter(a => a.activity_type === 'workout').length,
      sportsCount: activities.filter(a => a.activity_type === 'sports').length,
    };
  }, [activities]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-blue-600/30 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
          </div>
          <p className="text-white font-semibold">Loading performance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1e1e2e]">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#27293d] sticky top-0 z-50">
        <div className="container mx-auto px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20">
                <TrendingUp className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-white tracking-tight">
                  Performance Analysis
                </h1>
                <p className="text-sm text-white/50 mt-0.5">Advanced metrics and insights dashboard</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => router.push('/dashboard')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-8 py-8 max-w-[1600px]">
        {/* Athlete Selector */}
        <div className="mb-8">
          <div className="max-w-md">
            <AthleteSelector
              athletes={athletes}
              selectedAthlete={selectedAthlete}
              onSelectAthlete={(athlete) => setSelectedAthlete(athlete)}
              onCreateAthlete={() => router.push('/athlete-roster')}
              onEditAthlete={() => router.push('/athlete-roster')}
              onDeleteAthlete={() => {}}
            />
          </div>
        </div>

        {!selectedAthlete ? (
          <Card className="border-white/10 bg-[#27293d]">
            <CardContent className="py-20 text-center">
              <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center mx-auto mb-6 border border-blue-500/20">
                <TrendingUp className="h-12 w-12 text-blue-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">
                Select an Athlete
              </h3>
              <p className="text-white/50 mb-8 max-w-md mx-auto">
                Choose an athlete from the dropdown to view their comprehensive performance analysis
              </p>
            </CardContent>
          </Card>
        ) : !metrics ? (
          <Card className="border-white/10 bg-[#27293d]">
            <CardContent className="py-20 text-center">
              <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 flex items-center justify-center mx-auto mb-6 border border-amber-500/20">
                <Activity className="h-12 w-12 text-amber-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">
                No Activity Data
              </h3>
              <p className="text-white/50 mb-8 max-w-md mx-auto">
                {selectedAthlete.name} hasn't logged any activities yet. Start tracking to see detailed performance metrics.
              </p>
              <Button onClick={() => router.push('/injury-analysis')} size="lg">
                <Plus className="h-5 w-5 mr-2" />
                Log First Activity
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Key Performance Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Activities */}
              <Card className="border-white/10 bg-gradient-to-br from-[#27293d] to-[#1e1e2e]">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                      <Activity className="h-6 w-6 text-blue-400" />
                    </div>
                    {metrics.activityTrend !== 0 && (
                      <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                        metrics.activityTrend > 0 
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {metrics.activityTrend > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {Math.abs(metrics.activityTrend)}
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-4xl font-bold text-white tracking-tight">{metrics.lastWeekCount}</p>
                    <p className="text-sm text-white/60 font-medium">This Week</p>
                    <p className="text-xs text-white/40">{metrics.totalActivities} total logged</p>
                  </div>
                </CardContent>
              </Card>

              {/* Training Volume */}
              <Card className="border-white/10 bg-gradient-to-br from-[#27293d] to-[#1e1e2e]">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
                      <Timer className="h-6 w-6 text-purple-400" />
                    </div>
                    {metrics.durationTrend !== 0 && (
                      <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                        metrics.durationTrend > 0 
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {metrics.durationTrend > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {Math.abs(metrics.durationTrend)}h
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-4xl font-bold text-white tracking-tight">{metrics.totalDuration}h</p>
                    <p className="text-sm text-white/60 font-medium">Total Time</p>
                    <p className="text-xs text-white/40">{metrics.avgDuration} min avg session</p>
                  </div>
                </CardContent>
              </Card>

              {/* Heart Rate */}
              <Card className="border-white/10 bg-gradient-to-br from-[#27293d] to-[#1e1e2e]">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                      <Heart className="h-6 w-6 text-red-400" />
                    </div>
                    <div className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-white/5 text-white/60 border border-white/10">
                      <Zap className="h-3 w-3" />
                      Peak {metrics.maxHeartRate}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-4xl font-bold text-white tracking-tight">
                      {metrics.avgHeartRate > 0 ? metrics.avgHeartRate : '-'}
                    </p>
                    <p className="text-sm text-white/60 font-medium">Avg Heart Rate</p>
                    <p className="text-xs text-white/40">BPM</p>
                  </div>
                </CardContent>
              </Card>

              {/* Calories */}
              <Card className="border-white/10 bg-gradient-to-br from-[#27293d] to-[#1e1e2e]">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-orange-500/10 rounded-xl border border-orange-500/20">
                      <Flame className="h-6 w-6 text-orange-400" />
                    </div>
                    <div className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-white/5 text-white/60 border border-white/10">
                      <Target className="h-3 w-3" />
                      {metrics.avgCalories}/session
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-4xl font-bold text-white tracking-tight">
                      {(metrics.totalCalories / 1000).toFixed(1)}k
                    </p>
                    <p className="text-sm text-white/60 font-medium">Total Calories</p>
                    <p className="text-xs text-white/40">Burned</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Charts Row */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Daily Activity Pattern */}
            <Card className="border-white/10 bg-[#27293d]">
              <CardHeader className="border-b border-white/5 pb-4">
                <div>
                  <CardTitle className="text-white text-lg font-semibold flex items-center gap-2">
                    <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                      <TrendingUp className="h-4 w-4 text-blue-400" />
                    </div>
                    {allExamples.performanceTrend.title}
                  </CardTitle>
                  <CardDescription className="mt-2 text-white/40">
                    {allExamples.performanceTrend.description}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-[300px]">
                  <Line
                    ref={chart1Ref}
                    data={(canvas) => createLineChartData(
                      canvas,
                      allExamples.performanceTrend.sampleData.labels,
                      allExamples.performanceTrend.sampleData.data,
                      allExamples.performanceTrend.color
                    ) || { labels: [], datasets: [] }}
                    options={lineChartOptions}
                  />
                </div>
              </CardContent>
            </Card>


              {/* Weekly Volume */}
              <Card className="border-white/10 bg-[#27293d]">
              <CardHeader className="border-b border-white/5 pb-4">
                <div>
                  <CardTitle className="text-white text-lg font-semibold flex items-center gap-2">
                    <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                      <BarChart3 className="h-4 w-4 text-purple-400" />
                    </div>
                    {allExamples.trainingVolume.title}
                  </CardTitle>
                  <CardDescription className="mt-2 text-white/40">
                    {allExamples.trainingVolume.description}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-[300px]">
                  <Bar
                    ref={chart2Ref}
                    data={(canvas) => createBarChartData(
                      canvas,
                      allExamples.trainingVolume.sampleData.labels,
                      allExamples.trainingVolume.sampleData.data,
                      allExamples.trainingVolume.color
                    ) || { labels: [], datasets: [] }}
                    options={barChartOptions}
                  />
                </div>
              </CardContent>
            </Card>
            </div>

            {/* Risk and Body Part Analysis */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Injury Risk Trend */}
              {riskLoadData.labels.length > 0 && (
            <Card className="border-white/10 bg-[#27293d]">
            <CardHeader className="border-b border-white/5 pb-4">
              <div>
                <CardTitle className="text-white text-lg font-semibold flex items-center gap-2">
                  <div className="p-2 bg-green-500/10 rounded-lg border border-green-500/20">
                    <Heart className="h-4 w-4 text-green-400" />
                  </div>
                  {allExamples.recoveryStatus.title}
                </CardTitle>
                <CardDescription className="mt-2 text-white/40">
                  {allExamples.recoveryStatus.description}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[300px]">
                <Line
                  ref={chart3Ref}
                  data={(canvas) => createLineChartData(
                    canvas,
                    allExamples.recoveryStatus.sampleData.labels,
                    allExamples.recoveryStatus.sampleData.data,
                    allExamples.recoveryStatus.color
                  ) || { labels: [], datasets: [] }}
                  options={lineChartOptions}
                />
              </div>
            </CardContent>
          </Card>
              )}

              {/* Body Part Risk */}
              {bodyPartData.labels.length > 0 && (
            <Card className="border-white/10 bg-[#27293d]">
            <CardHeader className="border-b border-white/5 pb-4">
              <div>
                <CardTitle className="text-white text-lg font-semibold flex items-center gap-2">
                  <div className="p-2 bg-pink-500/10 rounded-lg border border-pink-500/20">
                    <AlertTriangle className="h-4 w-4 text-pink-400" />
                  </div>
                  {allExamples.injuryRisk.title}
                </CardTitle>
                <CardDescription className="mt-2 text-white/40">
                  {allExamples.injuryRisk.description}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[300px]">
                <Line
                  ref={chart6Ref}
                  data={(canvas) => createLineChartData(
                    canvas,
                    allExamples.injuryRisk.sampleData.labels,
                    allExamples.injuryRisk.sampleData.data,
                    allExamples.injuryRisk.color
                  ) || { labels: [], datasets: [] }}
                  options={lineChartOptions}
                />
              </div>
            </CardContent>
          </Card>
              )}
            </div>

            <Card className="border-white/10 bg-[#27293d]">
            <CardHeader className="border-b border-white/5 pb-4">
              <div>
                <CardTitle className="text-white text-lg font-semibold flex items-center gap-2">
                  <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <Activity className="h-4 w-4 text-blue-400" />
                  </div>
                  {allExamples.multiMetric.title}
                </CardTitle>
                <CardDescription className="mt-2 text-white/40">
                  {allExamples.multiMetric.description}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[400px]">
                <Line
                  ref={chart4Ref}
                  data={(canvas) => createMultiLineChartData(
                    canvas,
                    allExamples.multiMetric.sampleLabels,
                    allExamples.multiMetric.datasets
                  ) || { labels: [], datasets: [] }}
                  options={multiLineChartOptions}
                />
              </div>
            </CardContent>
          </Card>

            {/* Summary Stats */}
            <Card className="border-white/10 bg-[#27293d]">
              <CardHeader className="border-b border-white/5">
                <CardTitle className="text-white text-lg font-semibold flex items-center gap-2">
                  <div className="p-2 bg-green-500/10 rounded-lg border border-green-500/20">
                    <Trophy className="h-4 w-4 text-green-400" />
                  </div>
                  Performance Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center p-6 bg-gradient-to-br from-blue-500/5 to-blue-500/0 rounded-xl border border-blue-500/10">
                    <div className="flex justify-center mb-3">
                      <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                        <Activity className="h-6 w-6 text-blue-400" />
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-white mb-1">{metrics.workoutCount}</p>
                    <p className="text-sm text-white/60 font-medium">Total Workouts</p>
                  </div>

                  <div className="text-center p-6 bg-gradient-to-br from-purple-500/5 to-purple-500/0 rounded-xl border border-purple-500/10">
                    <div className="flex justify-center mb-3">
                      <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
                        <Trophy className="h-6 w-6 text-purple-400" />
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-white mb-1">{metrics.sportsCount}</p>
                    <p className="text-sm text-white/60 font-medium">Sports Activities</p>
                  </div>

                  <div className="text-center p-6 bg-gradient-to-br from-green-500/5 to-green-500/0 rounded-xl border border-green-500/10">
                    <div className="flex justify-center mb-3">
                      <div className="p-3 bg-green-500/10 rounded-xl border border-green-500/20">
                        <CheckCircle className="h-6 w-6 text-green-400" />
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-white mb-1">{metrics.recentCount}</p>
                    <p className="text-sm text-white/60 font-medium">Last 30 Days</p>
                  </div>

                  <div className="text-center p-6 bg-gradient-to-br from-orange-500/5 to-orange-500/0 rounded-xl border border-orange-500/10">
                    <div className="flex justify-center mb-3">
                      <div className="p-3 bg-orange-500/10 rounded-xl border border-orange-500/20">
                        <Target className="h-6 w-6 text-orange-400" />
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-white mb-1">
                      {metrics.recentCount >= 20 ? 'Elite' : metrics.recentCount >= 12 ? 'High' : metrics.recentCount >= 6 ? 'Moderate' : 'Low'}
                    </p>
                    <p className="text-sm text-white/60 font-medium">Activity Level</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
