"use client";

/**
 * Charts Demo Page
 * Showcases all available chart types with Black Dashboard styling
 */

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowLeft,
  TrendingUp,
  BarChart3,
  Activity,
  Target,
  AlertTriangle,
  Zap,
  Heart,
  Trophy
} from "lucide-react";

// Chart.js imports
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

// Our chart system
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

export default function ChartsDemoPage() {
  const router = useRouter();
  
  // Chart refs
  const chart1Ref = useRef<ChartJS<'line'>>(null);
  const chart2Ref = useRef<ChartJS<'bar'>>(null);
  const chart3Ref = useRef<ChartJS<'line'>>(null);
  const chart4Ref = useRef<ChartJS<'line'>>(null);
  const chart5Ref = useRef<ChartJS<'bar'>>(null);
  const chart6Ref = useRef<ChartJS<'line'>>(null);

  return (
    <div className="min-h-screen bg-[#1e1e2e]">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#27293d] sticky top-0 z-50">
        <div className="container mx-auto px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20">
                <BarChart3 className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-white tracking-tight">
                  Charts Demo & Showcase
                </h1>
                <p className="text-sm text-white/50 mt-0.5">Black Dashboard styled charts with Chart.js v3</p>
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
        <div className="space-y-8">
          {/* Introduction */}
          <Card className="border-white/10 bg-[#27293d]">
            <CardContent className="pt-6">
              <div className="prose prose-invert max-w-none">
                <h2 className="text-2xl font-bold text-white mb-4">Beautiful Charts for Athlete Analytics</h2>
                <p className="text-white/70 mb-4">
                  All charts are styled after the Black Dashboard React template with modern Chart.js v3+ API. 
                  They feature smooth gradients, responsive design, and semantic color coding.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="text-center p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <div className="w-4 h-4 rounded-full mx-auto mb-2" style={{ backgroundColor: CHART_COLORS.blue }}></div>
                    <p className="text-xs text-white/60">Blue - Primary</p>
                  </div>
                  <div className="text-center p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                    <div className="w-4 h-4 rounded-full mx-auto mb-2" style={{ backgroundColor: CHART_COLORS.purple }}></div>
                    <p className="text-xs text-white/60">Purple - Secondary</p>
                  </div>
                  <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                    <div className="w-4 h-4 rounded-full mx-auto mb-2" style={{ backgroundColor: CHART_COLORS.green }}></div>
                    <p className="text-xs text-white/60">Green - Positive</p>
                  </div>
                  <div className="text-center p-4 bg-pink-500/10 rounded-lg border border-pink-500/20">
                    <div className="w-4 h-4 rounded-full mx-auto mb-2" style={{ backgroundColor: CHART_COLORS.pink }}></div>
                    <p className="text-xs text-white/60">Pink - Risk</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chart Examples Row 1 */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Performance Trend - Blue */}
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

            {/* Training Volume - Purple */}
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

          {/* Chart Examples Row 2 */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recovery Status - Green */}
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

            {/* Injury Risk - Pink */}
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
          </div>

          {/* Multi-Line Chart - Full Width */}
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

          {/* Multi-Bar Chart - Full Width */}
          <Card className="border-white/10 bg-[#27293d]">
            <CardHeader className="border-b border-white/5 pb-4">
              <div>
                <CardTitle className="text-white text-lg font-semibold flex items-center gap-2">
                  <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                    <Trophy className="h-4 w-4 text-purple-400" />
                  </div>
                  {allExamples.teamComparison.title}
                </CardTitle>
                <CardDescription className="mt-2 text-white/40">
                  {allExamples.teamComparison.description}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[400px]">
                <Bar
                  ref={chart5Ref}
                  data={(canvas) => createMultiBarChartData(
                    canvas,
                    allExamples.teamComparison.sampleLabels,
                    allExamples.teamComparison.datasets
                  ) || { labels: [], datasets: [] }}
                  options={multiBarChartOptions}
                />
              </div>
            </CardContent>
          </Card>

          {/* Documentation Link */}
          <Card className="border-white/10 bg-gradient-to-br from-blue-500/10 to-purple-500/10">
            <CardContent className="pt-6 text-center">
              <Zap className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Ready to Use!</h3>
              <p className="text-white/70 mb-4 max-w-2xl mx-auto">
                All these charts are ready to use in your application. Check out the documentation
                in <code className="px-2 py-1 bg-black/30 rounded text-sm">frontend/lib/CHARTS_README.md</code> for
                detailed usage instructions and examples.
              </p>
              <div className="flex gap-3 justify-center">
                <Button 
                  variant="default" 
                  onClick={() => router.push('/performance-analysis')}
                  className="gap-2"
                >
                  <TrendingUp className="h-4 w-4" />
                  See Live Performance Charts
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => window.open('https://www.chartjs.org/docs/latest/', '_blank')}
                  className="gap-2"
                >
                  <BarChart3 className="h-4 w-4" />
                  Chart.js Docs
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

