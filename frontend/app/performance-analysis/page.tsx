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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/20 mx-auto mb-4"></div>
          <p className="text-white/50">Loading performance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-white/5 bg-black/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/5 rounded-md">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-medium text-white">
                  Performance Analysis
                </h1>
                <p className="text-sm text-white/50">Advanced metrics and insights dashboard</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => router.push('/dashboard')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Athlete Selector */}
        <div className="mb-6">
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
          <Card>
            <CardContent className="py-20 text-center">
              <div className="h-20 w-20 bg-white/5 rounded-md flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="h-10 w-10 text-white/70" />
              </div>
              <h3 className="text-xl font-medium text-white mb-2">
                Select an Athlete
              </h3>
              <p className="text-sm text-white/50 max-w-md mx-auto">
                Choose an athlete from the dropdown to view their comprehensive performance analysis
              </p>
            </CardContent>
          </Card>
        ) : !metrics ? (
          <Card>
            <CardContent className="py-20 text-center">
              <div className="h-20 w-20 bg-white/5 rounded-md flex items-center justify-center mx-auto mb-6">
                <Activity className="h-10 w-10 text-white/70" />
              </div>
              <h3 className="text-xl font-medium text-white mb-2">
                No Activity Data
              </h3>
              <p className="text-sm text-white/50 mb-6 max-w-md mx-auto">
                {selectedAthlete.name} hasn't logged any activities yet. Start tracking to see detailed performance metrics.
              </p>
              <Button onClick={() => router.push('/injury-analysis')}>
                <Plus className="h-4 w-4 mr-2" />
                Log First Activity
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Key Performance Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Activities */}
              <Card className="group hover:border-white/10 transition-colors border-blue-500/20">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="h-10 w-10 bg-blue-500/10 rounded-md flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                      <Activity className="h-5 w-5 text-blue-400" />
                    </div>
                    {metrics.activityTrend !== 0 && (
                      <div className={`inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded ${
                        metrics.activityTrend > 0 
                          ? 'text-green-400' 
                          : 'text-red-400'
                      }`}>
                        {metrics.activityTrend > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {Math.abs(metrics.activityTrend)}
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white mb-1">{metrics.lastWeekCount}</div>
                  <CardDescription>This Week</CardDescription>
                  <p className="text-xs text-white/40 mt-2">{metrics.totalActivities} total logged</p>
                </CardContent>
              </Card>

              {/* Training Volume */}
              <Card className="group hover:border-white/10 transition-colors border-purple-500/20">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="h-10 w-10 bg-purple-500/10 rounded-md flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                      <Timer className="h-5 w-5 text-purple-400" />
                    </div>
                    {metrics.durationTrend !== 0 && (
                      <div className={`inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded ${
                        metrics.durationTrend > 0 
                          ? 'text-green-400' 
                          : 'text-red-400'
                      }`}>
                        {metrics.durationTrend > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {Math.abs(metrics.durationTrend)}h
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white mb-1">{metrics.totalDuration}h</div>
                  <CardDescription>Total Time</CardDescription>
                  <p className="text-xs text-white/40 mt-2">{metrics.avgDuration} min avg session</p>
                </CardContent>
              </Card>

              {/* Heart Rate */}
              <Card className="group hover:border-white/10 transition-colors border-red-500/20">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="h-10 w-10 bg-red-500/10 rounded-md flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                      <Heart className="h-5 w-5 text-red-400" />
                    </div>
                    <div className="inline-flex items-center gap-1 text-xs text-white/50 px-1.5 py-0.5">
                      <Zap className="h-3 w-3" />
                      {metrics.maxHeartRate}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white mb-1">
                    {metrics.avgHeartRate > 0 ? metrics.avgHeartRate : '-'}
                  </div>
                  <CardDescription>Avg Heart Rate</CardDescription>
                  <p className="text-xs text-white/40 mt-2">BPM</p>
                </CardContent>
              </Card>

              {/* Calories */}
              <Card className="group hover:border-white/10 transition-colors border-orange-500/20">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="h-10 w-10 bg-orange-500/10 rounded-md flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                      <Flame className="h-5 w-5 text-orange-400" />
                    </div>
                    <div className="inline-flex items-center gap-1 text-xs text-white/50 px-1.5 py-0.5">
                      <Target className="h-3 w-3" />
                      {metrics.avgCalories}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white mb-1">
                    {(metrics.totalCalories / 1000).toFixed(1)}k
                  </div>
                  <CardDescription>Total Calories</CardDescription>
                  <p className="text-xs text-white/40 mt-2">Burned</p>
                </CardContent>
              </Card>
            </div>

            {/* Main Charts Row */}
            <div className="grid lg:grid-cols-2 gap-4">
              {/* Daily Activity Pattern */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 bg-blue-500/10 rounded-md flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{allExamples.performanceTrend.title}</CardTitle>
                  </div>
                </div>
                <CardDescription className="mt-2">
                  {allExamples.performanceTrend.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
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
              <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 bg-purple-500/10 rounded-md flex items-center justify-center">
                    <BarChart3 className="h-4 w-4 text-purple-400" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{allExamples.trainingVolume.title}</CardTitle>
                  </div>
                </div>
                <CardDescription className="mt-2">
                  {allExamples.trainingVolume.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
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
            <div className="grid lg:grid-cols-2 gap-4">
              {/* Injury Risk Trend */}
              {riskLoadData.labels.length > 0 && (
            <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 bg-green-500/10 rounded-md flex items-center justify-center">
                  <Heart className="h-4 w-4 text-green-400" />
                </div>
                <div>
                  <CardTitle className="text-base">{allExamples.recoveryStatus.title}</CardTitle>
                </div>
              </div>
              <CardDescription className="mt-2">
                {allExamples.recoveryStatus.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
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
            <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 bg-pink-500/10 rounded-md flex items-center justify-center">
                  <AlertTriangle className="h-4 w-4 text-pink-400" />
                </div>
                <div>
                  <CardTitle className="text-base">{allExamples.injuryRisk.title}</CardTitle>
                </div>
              </div>
              <CardDescription className="mt-2">
                {allExamples.injuryRisk.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
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

            <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 bg-blue-500/10 rounded-md flex items-center justify-center">
                  <Activity className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-base">{allExamples.multiMetric.title}</CardTitle>
                </div>
              </div>
              <CardDescription className="mt-2">
                {allExamples.multiMetric.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
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
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 bg-green-500/10 rounded-md flex items-center justify-center">
                    <Trophy className="h-4 w-4 text-green-400" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Performance Summary</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-white/[0.02] rounded-lg border border-white/5">
                    <div className="flex justify-center mb-2">
                      <div className="h-9 w-9 bg-blue-500/10 rounded-md flex items-center justify-center">
                        <Activity className="h-4 w-4 text-blue-400" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-white mb-1">{metrics.workoutCount}</p>
                    <p className="text-xs text-white/60">Total Workouts</p>
                  </div>

                  <div className="text-center p-4 bg-white/[0.02] rounded-lg border border-white/5">
                    <div className="flex justify-center mb-2">
                      <div className="h-9 w-9 bg-purple-500/10 rounded-md flex items-center justify-center">
                        <Trophy className="h-4 w-4 text-purple-400" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-white mb-1">{metrics.sportsCount}</p>
                    <p className="text-xs text-white/60">Sports Activities</p>
                  </div>

                  <div className="text-center p-4 bg-white/[0.02] rounded-lg border border-white/5">
                    <div className="flex justify-center mb-2">
                      <div className="h-9 w-9 bg-green-500/10 rounded-md flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-white mb-1">{metrics.recentCount}</p>
                    <p className="text-xs text-white/60">Last 30 Days</p>
                  </div>

                  <div className="text-center p-4 bg-white/[0.02] rounded-lg border border-white/5">
                    <div className="flex justify-center mb-2">
                      <div className="h-9 w-9 bg-orange-500/10 rounded-md flex items-center justify-center">
                        <Target className="h-4 w-4 text-orange-400" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-white mb-1">
                      {metrics.recentCount >= 20 ? 'Elite' : metrics.recentCount >= 12 ? 'High' : metrics.recentCount >= 6 ? 'Moderate' : 'Low'}
                    </p>
                    <p className="text-xs text-white/60">Activity Level</p>
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
