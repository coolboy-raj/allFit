"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { HumanAnatomy, BodyPart } from "@/components/injury-analysis/human-anatomy";
import { LoggingModal, WorkoutLogData, SportsLogData } from "@/components/injury-analysis/logging-modal";
import { ActivityDetailModal } from "@/components/injury-analysis/activity-detail-modal";
import { AthleteFormModal } from "@/components/injury-analysis/athlete-form-modal";
import { AthleteSelector } from "@/components/injury-analysis/athlete-selector";
import { getCurrentUser, isAuthenticated } from "@/lib/api/googleAuth";
import { 
  Activity, 
  ArrowLeft, 
  Shield, 
  Brain, 
  AlertTriangle, 
  TrendingUp,
  Info,
  Plus,
  User,
  Calendar,
  Trophy,
  Target,
  Zap,
  Heart,
  FileText,
  BarChart3,
  Flame,
  Timer,
  Battery,
  Moon,
  Droplet,
  Scale,
  TrendingDown,
  CheckCircle2,
  AlertOctagon
} from "lucide-react";

interface AthleteData {
  name: string;
  id: string;
  age: number;
  position: string;
  height: string;
  weight: string;
  sport: string;
  team: string;
  status: "active" | "recovering" | "injured";
}

export default function InjuryAnalysisPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [selectedBodyPart, setSelectedBodyPart] = useState<BodyPart | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [logs, setLogs] = useState<Array<any>>([]);
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<any | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Multi-athlete support
  const [athletes, setAthletes] = useState<Array<any>>([]);
  const [selectedAthlete, setSelectedAthlete] = useState<any | null>(null);
  const [isAthleteFormOpen, setIsAthleteFormOpen] = useState(false);
  const [athleteFormMode, setAthleteFormMode] = useState<'create' | 'edit'>('create');
  const [editingAthlete, setEditingAthlete] = useState<any | null>(null);
  const [showFirstTimeSetup, setShowFirstTimeSetup] = useState(false);
  
  const [injuryRiskData, setInjuryRiskData] = useState<Array<{
    part: BodyPart;
    risk: "low" | "medium" | "high" | "critical" | "injured";
    percentage: number;
    message: string;
    isInjured?: boolean;
  }>>([]);
  const [isLoggingActivity, setIsLoggingActivity] = useState(false);

  // Check authentication and load data on mount
  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      console.warn('[Injury Analysis] User not authenticated, redirecting...');
      router.push('/');
      return;
    }

    // Get current user
    const currentUser = getCurrentUser();
    if (!currentUser) {
      console.error('[Injury Analysis] No user found');
      router.push('/');
      return;
    }

    console.log('[Injury Analysis] User authenticated:', currentUser.id);
    setUser(currentUser);
    loadUserAthletes(currentUser.id);
  }, [router]);

  // Load athlete data when selectedAthlete changes
  useEffect(() => {
    if (selectedAthlete) {
      loadAthleteActivities(selectedAthlete.id);
    }
  }, [selectedAthlete]);

  async function loadUserAthletes(userId: string) {
    try {
      setIsLoading(true);
      console.log('[Injury Analysis] Loading athletes for user:', userId);
      
      const { getUserAthletes, checkHealth } = await import('@/lib/injury-analysis/database');
      
      // Check if backend is available
      const isHealthy = await checkHealth();
      if (!isHealthy) {
        console.warn('[Injury Analysis] Backend server not available.');
        setIsLoading(false);
        return;
      }

      // Load all athletes for this user (using Google ID)
      const userAthletes = await getUserAthletes(userId);
      console.log('[Injury Analysis] Loaded athletes:', userAthletes.length);
      
      setAthletes(userAthletes);
      
      if (userAthletes.length === 0) {
        // First time user - show setup
        console.log('[Injury Analysis] No athletes found, showing first-time setup');
        setShowFirstTimeSetup(true);
        setIsAthleteFormOpen(true);
        setAthleteFormMode('create');
      } else {
        // Select the first athlete by default
        console.log('[Injury Analysis] Selecting first athlete:', userAthletes[0].name);
        setSelectedAthlete(userAthletes[0]);
      }

      setIsLoading(false);
    } catch (error) {
      console.error('[Injury Analysis] Error loading user athletes:', error);
      setIsLoading(false);
    }
  }

  async function loadAthleteActivities(athleteId: string) {
    try {
      const { getActivityHistory, getInjuryRiskAnalysis } = await import('@/lib/injury-analysis/database');

      // Load activity history
      const activities = await getActivityHistory(athleteId, 50, 0);
      
      // Transform backend activities to frontend format
      const transformedLogs = activities.map((activity: any) => {
        if (activity.activity_type === 'workout') {
          return {
            id: activity.id,
            date: activity.date,
            startTime: activity.start_time,
            duration: activity.duration,
            workoutType: activity.workout_type,
            workoutExercises: activity.exercises || [],
            equipmentUsed: activity.equipment_used || [],
            heartRateAvg: activity.heart_rate_avg,
            heartRateMax: activity.heart_rate_max,
            caloriesBurned: activity.calories_burned,
            affectedBodyParts: activity.affected_body_parts || [],
            performanceNotes: activity.notes,
            fatigueLevel: activity.fatigue_level,
            recoveryStatus: activity.recovery_status,
          };
        } else {
          return {
            id: activity.id,
            date: activity.date,
            sport: activity.sport,
            position: activity.position,
            duration: activity.duration,
            matchType: activity.match_type,
            location: activity.location,
            opponent: activity.opponent,
            result: activity.result,
            minutesPlayed: activity.minutes_played,
            intensityLevel: activity.intensity_level,
            performanceMetrics: activity.performance_metrics || {},
            injuries: activity.injuries || [],
            medicalAttention: activity.medical_attention,
            surfaceType: activity.surface_type,
            weatherConditions: activity.weather_conditions,
            heartRateAvg: activity.heart_rate_avg,
            heartRateMax: activity.heart_rate_max,
            affectedBodyParts: activity.affected_body_parts || [],
            recoveryStatus: activity.recovery_status,
            coachFeedback: activity.coach_feedback,
          };
        }
      });

      setLogs(transformedLogs);

      // Load injury risk analysis if there are activities
      if (activities.length > 0) {
        const riskAnalysis = await getInjuryRiskAnalysis(athleteId);
        
        // Check for recent injuries in the last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const recentInjuries = activities
          .filter((activity: any) => {
            if (activity.activity_type !== 'sports') return false;
            const activityDate = new Date(activity.date);
            return activityDate >= sevenDaysAgo && activity.injuries && activity.injuries.length > 0;
          })
          .flatMap((activity: any) => 
            (activity.injuries || []).map((inj: any) => inj.bodyPart)
          );
        
        const injuredParts = new Set(recentInjuries);
        
        // Transform to frontend format and mark injured parts
        const transformedRisks = riskAnalysis.body_part_risks.map((risk: any) => {
          const isInjured = injuredParts.has(risk.part);
          return {
            part: risk.part as BodyPart,
            risk: isInjured ? "injured" as const : risk.risk as "low" | "medium" | "high" | "critical",
            percentage: isInjured ? 100 : risk.percentage,
            message: isInjured ? "⚠️ Active injury reported in last 7 days" : risk.message,
            isInjured: isInjured,
          };
        });
        
        // Add injured parts that aren't in risk analysis
        injuredParts.forEach(part => {
          if (!transformedRisks.find((r: any) => r.part === part)) {
            transformedRisks.push({
              part: part as BodyPart,
              risk: "injured" as const,
              percentage: 100,
              message: "⚠️ Active injury reported in last 7 days",
              isInjured: true,
            });
          }
        });

        setInjuryRiskData(transformedRisks);
        setShowResults(true);
      } else {
        setInjuryRiskData([]);
        setShowResults(false);
      }

      console.log('✅ Loaded athlete activities:', {
        athlete_id: athleteId,
        activities: activities.length,
        riskAreas: injuryRiskData.length
      });

    } catch (error) {
      console.error('Error loading athlete activities:', error);
    }
  }

  // Athlete CRUD handlers
  const handleCreateAthlete = async (athleteData: any) => {
    try {
      if (!user) {
        console.error('[Injury Analysis] No user found - cannot create athlete');
        throw new Error('User not authenticated');
      }

      console.log('[Injury Analysis] Creating athlete for user:', user.id);
      const { createOrUpdateAthlete } = await import('@/lib/injury-analysis/database');
      
      const newAthlete = await createOrUpdateAthlete({
        user_id: user.id, // Use real Google user ID
        ...athleteData,
      });

      console.log('[Injury Analysis] ✅ Athlete created:', newAthlete.name);
      
      // Update state
      setAthletes([...athletes, newAthlete]);
      setSelectedAthlete(newAthlete); // Auto-select new athlete
      
      // Close modal and reset form state
      setIsAthleteFormOpen(false);
      setShowFirstTimeSetup(false);
      setAthleteFormMode('create');
      setEditingAthlete(null);
      
      console.log('[Injury Analysis] ✅ Athlete selected and modal closed');
    } catch (error) {
      console.error('[Injury Analysis] Error creating athlete:', error);
      throw error;
    }
  };

  const handleEditAthlete = async (athleteData: any) => {
    try {
      if (!editingAthlete) return;
      
      const { updateAthlete } = await import('@/lib/injury-analysis/database');
      
      const updated = await updateAthlete(editingAthlete.id, athleteData);
      
      // Update state
      setAthletes(athletes.map(a => a.id === updated.id ? updated : a));
      
      if (selectedAthlete?.id === updated.id) {
        setSelectedAthlete(updated);
      }
      
      // Close modal and reset form state
      setIsAthleteFormOpen(false);
      setAthleteFormMode('create');
      setEditingAthlete(null);
      
      console.log('[Injury Analysis] ✅ Athlete updated:', updated.name);
    } catch (error) {
      console.error('[Injury Analysis] Error updating athlete:', error);
      throw error;
    }
  };

  const handleDeleteAthlete = async (athlete: any) => {
    try {
      const { deleteAthlete } = await import('@/lib/injury-analysis/database');
      
      await deleteAthlete(athlete.id);
      
      const updatedAthletes = athletes.filter(a => a.id !== athlete.id);
      setAthletes(updatedAthletes);
      
      // If we deleted the selected athlete, select another one
      if (selectedAthlete?.id === athlete.id) {
        setSelectedAthlete(updatedAthletes[0] || null);
        setLogs([]);
        setInjuryRiskData([]);
        setShowResults(false);
      }
      
      console.log('✅ Athlete deleted:', athlete.name);
    } catch (error) {
      console.error('Error deleting athlete:', error);
      alert('Failed to delete athlete');
    }
  };

  const handleBodyPartClick = (part: BodyPart) => {
    setSelectedBodyPart(part);
    if (showResults) {
      setShowDetailPanel(true);
    }
  };

  const handleActivityClick = (log: WorkoutLogData | SportsLogData) => {
    setSelectedActivity(log);
    setIsDetailModalOpen(true);
  };

  const handleDeleteActivity = async (activityId: string) => {
    try {
      if (!selectedAthlete) return;
      
      const { deleteActivity, getInjuryRiskAnalysis } = await import('@/lib/injury-analysis/database');
      
      await deleteActivity(activityId);
      
      // Remove from local state
      const remainingLogs = logs.filter(log => log.id !== activityId);
      setLogs(remainingLogs);
      
      // Reload injury risk data after deletion
      if (remainingLogs.length > 0) {
        const riskAnalysis = await getInjuryRiskAnalysis(selectedAthlete.id);
        const transformedRisks = riskAnalysis.body_part_risks.map((risk: any) => ({
          part: risk.part as BodyPart,
          risk: risk.risk as "low" | "medium" | "high" | "critical",
          percentage: risk.percentage,
          message: risk.message,
        }));
        setInjuryRiskData(transformedRisks);
      } else {
        setShowResults(false);
        setInjuryRiskData([]);
      }
      
      // Close modal
      setIsDetailModalOpen(false);
      setSelectedActivity(null);
      
      console.log('✅ Activity deleted and risk recalculated');
    } catch (error) {
      console.error('Error deleting activity:', error);
      throw error;
    }
  };

  const handleLogSubmit = async (data: WorkoutLogData | SportsLogData, type: "workout" | "sports") => {
    try {
      if (!selectedAthlete) {
        alert('Please select an athlete first');
        return;
      }
      
      setIsLoggingActivity(true);
      const { logActivity, getInjuryRiskAnalysis } = await import('@/lib/injury-analysis/database');

      // Transform the frontend data to backend format
      const activityLog = {
        athlete_id: selectedAthlete.id,
        activity_type: type,
        date: data.date,
        duration: data.duration,
        recovery_status: data.recoveryStatus || 'normal',
        heart_rate_avg: data.heartRateAvg || undefined,
        heart_rate_max: data.heartRateMax || undefined,
        ...(type === 'workout' ? {
          start_time: (data as WorkoutLogData).startTime?.trim() || undefined,
          workout_type: (data as WorkoutLogData).workoutType,
          exercises: (data as WorkoutLogData).workoutExercises?.map((ex, idx) => ({
            id: `ex-${Date.now()}-${idx}`,
            exercise: ex.exercise,
            sets: ex.sets,
            reps: ex.reps,
            weight: ex.weight,
            intensity: ex.intensity,
            notes: ex.notes,
          })) || [],
          equipment_used: (data as WorkoutLogData).equipmentUsed || [],
          fatigue_level: (data as WorkoutLogData).fatigueLevel,
          notes: (data as WorkoutLogData).performanceNotes?.trim() || undefined,
          calories_burned: (data as WorkoutLogData).caloriesBurned || undefined,
          weather_conditions: (data as WorkoutLogData).weatherConditions?.trim() || undefined,
          affected_body_parts: (data as WorkoutLogData).affectedBodyParts,
        } : {
          sport: (data as SportsLogData).sport,
          position: (data as SportsLogData).position,
          match_type: (data as SportsLogData).matchType,
          location: (data as SportsLogData).location?.trim() || undefined,
          opponent: (data as SportsLogData).opponent?.trim() || undefined,
          result: (data as SportsLogData).result?.trim() || undefined,
          minutes_played: (data as SportsLogData).minutesPlayed,
          intensity_level: (data as SportsLogData).intensityLevel,
          performance_metrics: (data as SportsLogData).performanceMetrics || {},
          injuries: (data as SportsLogData).injuries?.map(inj => ({
            id: inj.id,
            bodyPart: inj.bodyPart,
            injuryType: inj.injuryType,
            severity: inj.severity,
            timeOccurred: inj.timeOccurred,
            mechanism: inj.mechanism,
            notes: inj.notes,
          })) || [],
          medical_attention: (data as SportsLogData).medicalAttention?.trim() || undefined,
          surface_type: (data as SportsLogData).surfaceType,
          weather_conditions: (data as SportsLogData).weatherConditions?.trim() || undefined,
          coach_feedback: (data as SportsLogData).coachFeedback?.trim() || undefined,
          affected_body_parts: (data as SportsLogData).affectedBodyParts,
        }),
      };

      // Log the activity and get injury risk calculation
      const result = await logActivity(activityLog);

      // Update local state with the returned activity (includes ID)
      const activityWithId = { ...data, id: result.activity.id };
      setLogs([activityWithId, ...logs]);
      setShowResults(true);

      // Reload injury risk data with latest calculation
      if (selectedAthlete && result.injury_risk) {
        const riskAnalysis = await getInjuryRiskAnalysis(selectedAthlete.id);
        const transformedRisks = riskAnalysis.body_part_risks.map((risk: any) => ({
          part: risk.part as BodyPart,
          risk: risk.risk as "low" | "medium" | "high" | "critical",
          percentage: risk.percentage,
          message: risk.message,
        }));
        setInjuryRiskData(transformedRisks);
      }

      console.log('✅ Activity logged successfully:', {
        activityId: result.activity.id,
        overallRisk: result.injury_risk?.overall_risk_score,
        affectedParts: result.activity.affected_body_parts
      });
    } catch (error) {
      console.error('Error logging activity:', error);
      alert('Failed to log activity. Please try again.');
    } finally {
      setIsLoggingActivity(false);
    }
  };

  const getRiskLevel = (part: BodyPart) => {
    const risk = injuryRiskData.find(item => item.part === part);
    return risk?.risk || "none";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500/10 text-green-400 border border-green-500/20";
      case "recovering": return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
      case "injured": return "bg-red-500/10 text-red-400 border border-red-500/20";
      default: return "bg-white/5 text-white/50 border border-white/10";
    }
  };

  // Show loading state while checking auth
  if (!user && isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white/50">Loading...</p>
        </div>
      </div>
    );
  }

  // If no user after loading, they'll be redirected by useEffect
  if (!user) {
    return null;
  }

  return (
    <>
      {/* Athlete Form Modal */}
      <AthleteFormModal
        isOpen={isAthleteFormOpen}
        onClose={() => {
          // Allow closing if we have at least one athlete (first-time setup complete)
          if (!showFirstTimeSetup || athletes.length > 0) {
            setIsAthleteFormOpen(false);
            setEditingAthlete(null);
            setAthleteFormMode('create');
          }
        }}
        onSubmit={athleteFormMode === 'create' ? handleCreateAthlete : handleEditAthlete}
        initialData={editingAthlete}
        mode={athleteFormMode}
      />

      <LoggingModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleLogSubmit}
        athleteName={selectedAthlete?.name || 'Athlete'}
      />

      <ActivityDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedActivity(null);
        }}
        activity={selectedActivity}
        onDelete={handleDeleteActivity}
      />

      <div className="min-h-screen bg-black">
        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center">
            <div className="text-center">
              <div className="relative w-16 h-16 mx-auto mb-4">
                <div className="absolute inset-0 border-4 border-blue-600/30 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
              </div>
              <p className="text-white font-semibold">Loading athlete data...</p>
              <p className="text-sm text-white/50 mt-2">Connecting to injury analysis system</p>
            </div>
          </div>
        )}

        {/* Activity Logging Overlay */}
        {isLoggingActivity && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center">
            <div className="bg-gray-900 border-2 border-blue-500 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
              <div className="text-center">
                {/* Animated Progress Bar */}
                <div className="relative w-full h-2 bg-gray-800 rounded-full overflow-hidden mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 animate-pulse">
                    <div className="h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                  </div>
                </div>
                
                {/* Icon */}
                <div className="relative w-20 h-20 mx-auto mb-4">
                  <div className="absolute inset-0 border-4 border-blue-600/30 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Brain className="h-8 w-8 text-blue-500 animate-pulse" />
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">Processing Activity Data</h3>
                <p className="text-sm text-white/50 mb-1">Analyzing injury risk patterns...</p>
                <p className="text-xs text-white/40">This may take a few seconds</p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <header className="border-b border-white/5 bg-black/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/5 rounded-md">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-medium text-white">
                    Injury Analysis System
                  </h1>
                  <p className="text-xs text-white/40">Professional Athlete Monitoring</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => router.push('/dashboard')}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-8 md:px-12 lg:px-16 py-8 max-w-[1400px]">
          {/* Quick Action Bar */}
          <div className="mb-8 flex items-center justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-2xl font-medium text-white">
                Athlete Health Dashboard
              </h2>
              <p className="text-sm text-white/50 mt-1">
                Real-time injury risk assessment and performance tracking
              </p>
            </div>
            
            {/* Athlete Selector */}
            <div className="w-80">
              <AthleteSelector
                athletes={athletes}
                selectedAthlete={selectedAthlete}
                onSelectAthlete={(athlete) => setSelectedAthlete(athlete)}
                onCreateAthlete={() => {
                  setAthleteFormMode('create');
                  setEditingAthlete(null);
                  setIsAthleteFormOpen(true);
                }}
                onEditAthlete={(athlete) => {
                  setAthleteFormMode('edit');
                  setEditingAthlete(athlete);
                  setIsAthleteFormOpen(true);
                }}
                onDeleteAthlete={handleDeleteAthlete}
              />
            </div>

            <Button 
              size="lg"
              onClick={() => setIsModalOpen(true)}
              disabled={!selectedAthlete}
            >
              <Plus className="h-5 w-5 mr-2" />
              Log Activity
            </Button>
          </div>

          {/* First Row: Two Columns */}
          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            {/* Left: Athlete Details & Stats */}
            <div className="space-y-4">
              {/* Athlete Profile */}
              {selectedAthlete && (
                <Card className="border-blue-500/20">
                  <CardHeader className="border-b border-white/10 pb-5">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-md bg-blue-500/10 flex items-center justify-center text-xl font-medium text-blue-400 ring-2 ring-blue-500/20">
                          {selectedAthlete.name.split(' ').map((n: string) => n[0]).join('')}
                        </div>
                        <div>
                          <h3 className="text-xl font-medium text-white mb-1">{selectedAthlete.name}</h3>
                          <p className="text-white/50 text-xs">ID: {selectedAthlete.id.substring(0, 13)}...</p>
                        </div>
                      </div>
                      <div className={`px-3 py-1.5 rounded-md text-xs font-medium ${getStatusColor(selectedAthlete.status)}`}>
                        {selectedAthlete.status.toUpperCase()}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <p className="text-xs text-white/50 flex items-center gap-1.5 font-medium">
                          <User className="h-3.5 w-3.5 text-blue-400" />
                          Age
                        </p>
                        <p className="font-medium text-white text-base">{selectedAthlete.age || '-'} years</p>
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-xs text-white/50 flex items-center gap-1.5 font-medium">
                          <Trophy className="h-3.5 w-3.5 text-amber-400" />
                          Sport
                        </p>
                        <p className="font-medium text-white text-base">{selectedAthlete.primary_sport || '-'}</p>
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-xs text-white/50 flex items-center gap-1.5 font-medium">
                          <Target className="h-3.5 w-3.5 text-purple-400" />
                          Position
                        </p>
                        <p className="font-medium text-white text-base">{selectedAthlete.position || '-'}</p>
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-xs text-white/50 font-medium">Team</p>
                        <p className="font-medium text-white text-base">{selectedAthlete.team || '-'}</p>
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-xs text-white/50 font-medium">Height</p>
                        <p className="font-medium text-white text-base">{selectedAthlete.height || '-'}</p>
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-xs text-white/50 font-medium">Weight</p>
                        <p className="font-medium text-white text-base">{selectedAthlete.weight || '-'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Injury Risk Gauge */}
              {showResults && injuryRiskData.length > 0 && (
                <Card className="border-red-500/20">
                  <CardHeader className="pb-4 border-b border-white/10">
                    <CardTitle className="text-white flex items-center gap-2 text-lg">
                      <div className="h-8 w-8 rounded-md bg-red-500/10 flex items-center justify-center">
                        <AlertOctagon className={`h-4 w-4 ${
                          (() => {
                            const avgRisk = Math.round(
                              injuryRiskData.reduce((sum, r) => sum + r.percentage, 0) / injuryRiskData.length
                            );
                            if (avgRisk >= 70) return 'text-red-400';
                            if (avgRisk >= 50) return 'text-orange-400';
                            if (avgRisk >= 30) return 'text-amber-400';
                            return 'text-green-400';
                          })()
                        }`} />
                      </div>
                      Injury Risk Level
                    </CardTitle>
                    <CardDescription className="text-xs mt-1">AI-powered risk assessment</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      // Calculate overall risk from body parts
                      const avgRisk = Math.round(
                        injuryRiskData.reduce((sum, r) => sum + r.percentage, 0) / injuryRiskData.length
                      );
                      const riskLabel = avgRisk >= 70 ? 'High Risk' : avgRisk >= 50 ? 'Medium-High Risk' : avgRisk >= 30 ? 'Medium Risk' : 'Low Risk';
                      
                      // Define color classes based on risk level
                      const getColorClasses = () => {
                        if (avgRisk >= 70) return {
                          text: 'text-red-400',
                          bg: 'bg-red-500/10',
                          textBadge: 'text-red-400',
                          stroke: '#f87171', // red-400
                        };
                        if (avgRisk >= 50) return {
                          text: 'text-orange-400',
                          bg: 'bg-orange-500/10',
                          textBadge: 'text-orange-400',
                          stroke: '#fb923c', // orange-400
                        };
                        if (avgRisk >= 30) return {
                          text: 'text-amber-400',
                          bg: 'bg-amber-500/10',
                          textBadge: 'text-amber-400',
                          stroke: '#fbbf24', // amber-400
                        };
                        return {
                          text: 'text-green-400',
                          bg: 'bg-green-500/10',
                          textBadge: 'text-green-400',
                          stroke: '#4ade80', // green-400
                        };
                      };

                      const colors = getColorClasses();

                      return (
                        <>
                          <div className="flex flex-col items-center py-4">
                            {/* Circular Progress */}
                            <div className="relative w-32 h-32">
                              <svg className="transform -rotate-90 w-32 h-32">
                                <circle
                                  cx="64"
                                  cy="64"
                                  r="56"
                                  stroke="currentColor"
                                  strokeWidth="12"
                                  fill="none"
                                  className="text-white/5"
                                />
                                <circle
                                  cx="64"
                                  cy="64"
                                  r="56"
                                  stroke={colors.stroke}
                                  strokeWidth="12"
                                  fill="none"
                                  strokeDasharray={`${2 * Math.PI * 56}`}
                                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - avgRisk / 100)}`}
                                  className="transition-all duration-1000 ease-out"
                                  strokeLinecap="round"
                                />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                  <p className={`text-3xl font-bold ${colors.text} transition-colors duration-500`}>{avgRisk}</p>
                                  <p className="text-xs text-white/50">/ 100</p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="mt-4 text-center">
                              <span className={`px-4 py-2 ${colors.bg} ${colors.textBadge} text-sm font-semibold rounded-full transition-colors duration-500`}>
                                {riskLabel}
                              </span>
                              <p className="text-xs text-white/50 mt-3">
                                {avgRisk >= 60 ? 'High risk detected. Consider rest and recovery.' : 
                                 avgRisk >= 40 ? 'Moderate fatigue detected. Monitor training load.' :
                                 'Training load within safe limits.'}
                              </p>
                            </div>
                          </div>

                          {/* Risk Factors */}
                          <div className={`mt-5 pt-5 border-t ${
                            avgRisk >= 70 ? 'border-red-500/20' :
                            avgRisk >= 50 ? 'border-orange-500/20' :
                            avgRisk >= 30 ? 'border-amber-500/20' :
                            'border-green-500/20'
                          }`}>
                            {/* Injured Parts - Priority Display */}
                            {injuryRiskData.filter(r => r.isInjured).length > 0 && (
                              <>
                                <p className="text-xs font-medium text-purple-400 mb-3 flex items-center gap-1.5">
                                  <AlertTriangle className="h-3.5 w-3.5" />
                                  Active Injuries
                                </p>
                                <div className="space-y-2 mb-4">
                                  {injuryRiskData
                                    .filter(r => r.isInjured)
                                    .slice(0, 3)
                                    .map((risk, idx) => (
                                      <div key={idx} className="flex items-center gap-2 bg-purple-500/10 p-2.5 rounded-md border border-purple-500/20">
                                        <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></div>
                                        <span className="text-xs text-purple-300 capitalize font-medium">{risk.part.replace('-', ' ')}</span>
                                      </div>
                                    ))}
                                </div>
                              </>
                            )}
                            
                            {/* High Risk Areas */}
                            <p className="text-xs font-medium text-white/70 mb-3">High Risk Body Parts</p>
                            <div className="space-y-2">
                              {injuryRiskData
                                .filter(r => !r.isInjured && r.percentage >= 50)
                                .slice(0, 3)
                                .map((risk, idx) => (
                                  <div key={idx} className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                      <div className={`w-2 h-2 rounded-full ${risk.percentage >= 70 ? 'bg-red-400' : risk.percentage >= 60 ? 'bg-orange-400' : 'bg-amber-400'}`}></div>
                                      <span className="text-sm text-white/70 capitalize">{risk.part.replace('-', ' ')}</span>
                                    </div>
                                    <span className={`text-sm font-medium ${risk.percentage >= 70 ? 'text-red-400' : risk.percentage >= 60 ? 'text-orange-400' : 'text-amber-400'}`}>{risk.percentage}%</span>
                                  </div>
                                ))}
                              {injuryRiskData.filter(r => !r.isInjured && r.percentage >= 50).length === 0 && (
                                <p className="text-xs text-white/40">No high-risk areas detected</p>
                              )}
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </CardContent>
                </Card>
              )}

              {/* Weekly Summary Stats */}
              {showResults && logs.length > 0 && (
                <Card className="border-purple-500/20">
                  <CardHeader className="pb-4 border-b border-white/10">
                    <CardTitle className="text-white flex items-center gap-2 text-lg">
                      <div className="h-8 w-8 rounded-md bg-purple-500/10 flex items-center justify-center">
                        <BarChart3 className="h-4 w-4 text-purple-400" />
                      </div>
                      Activity Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-purple-500/5 rounded-lg border border-purple-500/10">
                        <p className="text-3xl font-bold text-purple-400">{logs.length}</p>
                        <p className="text-xs text-white/50 mt-2 font-medium">Total Logged</p>
                      </div>
                      <div className="text-center p-4 bg-pink-500/5 rounded-lg border border-pink-500/10">
                        <p className="text-3xl font-bold text-pink-400">
                          {logs.filter((l: any) => 'sport' in l).length}
                        </p>
                        <p className="text-xs text-white/50 mt-2 font-medium">Sports</p>
                      </div>
                      <div className="text-center p-4 bg-blue-500/5 rounded-lg border border-blue-500/10">
                        <p className="text-3xl font-bold text-blue-400">
                          {logs.filter((l: any) => 'workoutType' in l).length}
                        </p>
                        <p className="text-xs text-white/50 mt-2 font-medium">Workouts</p>
                      </div>
                      <div className="text-center p-4 bg-indigo-500/5 rounded-lg border border-indigo-500/10">
                        <p className="text-3xl font-bold text-indigo-400">
                          {Math.round(logs.reduce((sum: number, l: any) => sum + (l.duration || 0), 0) / 60)}
                        </p>
                        <p className="text-xs text-white/50 mt-2 font-medium">Total Hours</p>
                      </div>
                    </div>
                    
                    {injuryRiskData.filter(r => r.percentage >= 60).length === 0 && (
                      <div className="mt-5 p-4 bg-green-500/5 rounded-lg border border-green-500/20">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-400" />
                          <p className="text-sm text-white/70">
                            <span className="font-semibold text-green-400">All clear</span> - No high-risk areas detected
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {injuryRiskData.filter(r => r.percentage >= 60).length > 0 && (
                      <div className="mt-5 p-4 bg-red-500/5 rounded-lg border border-red-500/20">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-400" />
                          <p className="text-sm text-white/70">
                            <span className="font-semibold text-red-400">Warning:</span> {injuryRiskData.filter(r => r.percentage >= 60).length} high-risk area(s)
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* AI Recommendations */}
              {showResults && injuryRiskData.length > 0 && (
                <Card className="border-green-500/20">
                  <CardHeader className="pb-4 border-b border-white/10">
                    <CardTitle className="text-white flex items-center gap-2 text-lg">
                      <div className="h-8 w-8 rounded-md bg-green-500/10 flex items-center justify-center">
                        <Shield className="h-4 w-4 text-green-400" />
                      </div>
                      AI Recommendations
                    </CardTitle>
                    <CardDescription className="text-xs mt-1">
                      Personalized injury prevention strategies
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-5">
                    <div className="space-y-4">
                      {injuryRiskData.filter(r => r.percentage >= 60).length > 0 && (
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 w-7 h-7 rounded-full bg-green-500/10 text-green-400 flex items-center justify-center font-bold text-xs border border-green-500/20">
                            1
                          </div>
                          <div>
                            <h4 className="font-medium text-white text-sm mb-1.5">
                              Immediate Rest Required
                            </h4>
                            <p className="text-sm text-white/60 leading-relaxed">
                              High risk detected in {injuryRiskData.filter(r => r.percentage >= 60).length} area(s). 
                              Take 2-3 days of complete rest for affected body parts. Consider ice therapy and gentle mobility work.
                            </p>
                          </div>
                        </div>
                      )}

                      {injuryRiskData.filter(r => r.percentage >= 40 && r.percentage < 60).length > 0 && (
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 w-7 h-7 rounded-full bg-green-500/10 text-green-400 flex items-center justify-center font-bold text-xs border border-green-500/20">
                            {injuryRiskData.filter(r => r.percentage >= 60).length > 0 ? '2' : '1'}
                          </div>
                          <div>
                            <h4 className="font-medium text-white text-sm mb-1.5">
                              Reduce Training Volume
                            </h4>
                            <p className="text-sm text-white/60 leading-relaxed">
                              Moderate fatigue detected. Reduce training intensity by 20-30% for affected areas in the next 3-5 days.
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-green-500/10 text-green-400 flex items-center justify-center font-bold text-xs border border-green-500/20">
                          {injuryRiskData.filter(r => r.percentage >= 40).length + 1}
                        </div>
                        <div>
                          <h4 className="font-medium text-white text-sm mb-1.5">
                            Monitor Recovery
                          </h4>
                          <p className="text-sm text-white/60 leading-relaxed">
                            Track your recovery daily. Log rest days and monitor how body parts feel before resuming full training intensity.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 p-4 bg-blue-500/5 rounded-lg border border-blue-500/20">
                      <div className="flex gap-2.5">
                        <TrendingUp className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-white/70 leading-relaxed">
                          <span className="font-semibold text-blue-400">Data-Driven:</span> Following these recommendations can reduce injury risk by up to 60% based on your activity patterns.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right: Human Anatomy & Analysis */}
            <div className="flex flex-col space-y-6">
              {/* Human Anatomy Visualization */}
              <Card className="border-red-500/20 flex-1 flex flex-col">
                <CardHeader className="border-b border-white/10">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-white flex items-center gap-2 text-lg">
                        <div className="h-8 w-8 rounded-md bg-red-500/10 flex items-center justify-center">
                          <Activity className="h-4 w-4 text-red-400" />
                        </div>
                        Body Injury Risk Map
                      </CardTitle>
                      <CardDescription>
                        Interactive visualization showing injury-prone areas. Click body parts for details.
                      </CardDescription>
                    </div>
                    {showResults && (
                      <div className="flex gap-2">
                        {[
                          { count: injuryRiskData.filter(d => d.isInjured).length, label: "Injured", color: "bg-purple-500" },
                          { count: injuryRiskData.filter(d => !d.isInjured && d.percentage >= 60).length, label: "High", color: "bg-red-500" },
                          { count: injuryRiskData.filter(d => !d.isInjured && d.percentage >= 30 && d.percentage < 60).length, label: "Med", color: "bg-amber-500" },
                          { count: injuryRiskData.filter(d => !d.isInjured && d.percentage < 30).length, label: "Low", color: "bg-green-500" },
                        ].map((stat, index) => (
                          <div key={index} className="text-center">
                            <div className={`${stat.color} text-white text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center mb-1`}>
                              {stat.count}
                            </div>
                            <span className="text-[10px] text-white/50">{stat.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardHeader>
                  <CardContent className="flex-1 flex flex-col pt-5">
                  <div className="bg-black rounded-lg p-8 flex items-center justify-center border border-white/5 flex-1 relative">
                    {/* Injury & High Risk Alert Banner */}
                    {showResults && (injuryRiskData.filter(d => d.isInjured).length > 0 || injuryRiskData.filter(d => d.percentage >= 60).length > 0) && (
                      <div className="absolute top-4 left-4 right-4 z-10 space-y-2">
                        {/* Active Injuries Alert */}
                        {injuryRiskData.filter(d => d.isInjured).length > 0 && (
                          <div className="bg-purple-500/10 border border-purple-500/20 rounded-md p-3 backdrop-blur-sm animate-in fade-in slide-in-from-top duration-500">
                            <div className="flex items-center gap-3">
                              <div className="flex-shrink-0">
                                <AlertTriangle className="h-5 w-5 text-purple-400 animate-pulse" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-white">
                                  {injuryRiskData.filter(d => d.isInjured).length} Active Injur{injuryRiskData.filter(d => d.isInjured).length > 1 ? 'ies' : 'y'} Detected
                                </p>
                                <p className="text-xs text-purple-300 mt-0.5">
                                  Purple areas indicate recent injuries (last 7 days)
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* High Risk Alert */}
                        {injuryRiskData.filter(d => !d.isInjured && d.percentage >= 60).length > 0 && (
                          <div className="bg-red-500/10 border border-red-500/20 rounded-md p-3 backdrop-blur-sm animate-in fade-in slide-in-from-top duration-500">
                            <div className="flex items-center gap-3">
                              <div className="flex-shrink-0">
                                <AlertTriangle className="h-5 w-5 text-red-400 animate-pulse" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-white">
                                  {injuryRiskData.filter(d => !d.isInjured && d.percentage >= 60).length} High Risk Area{injuryRiskData.filter(d => !d.isInjured && d.percentage >= 60).length > 1 ? 's' : ''} Detected
                                </p>
                                <p className="text-xs text-red-300 mt-0.5">
                                  Click highlighted areas for detailed analysis
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    <HumanAnatomy 
                      onBodyPartClick={handleBodyPartClick}
                      injuryRiskParts={injuryRiskData}
                    />
                  </div>

                  {showResults && (
                    <div className="mt-6 space-y-4">
                      {selectedBodyPart && (
                        <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                          <h4 className="font-medium text-white mb-2 capitalize flex items-center gap-2">
                            <Target className="h-4 w-4 text-purple-400" />
                            {selectedBodyPart.replace('-', ' ')}
                          </h4>
                          <p className="text-sm text-white/70">
                            <span className="font-medium">Risk Level:</span> <span className="capitalize text-purple-300">{getRiskLevel(selectedBodyPart)}</span>
                          </p>
                          <p className="text-xs text-white/50 mt-2">
                            Click "Log New Activity" to record training data for AI analysis.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {!showResults && (
                    <div className="mt-6 p-6 bg-blue-500/5 rounded-lg border border-blue-500/20 text-center">
                      <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                        <Brain className="h-6 w-6 text-blue-400" />
                      </div>
                      <h4 className="font-medium text-white mb-2">
                        Ready for Analysis
                      </h4>
                      <p className="text-sm text-white/50 mb-5">
                        Log training or match data to generate an AI-powered injury risk assessment
                      </p>
                      <Button 
                        variant="default"
                        onClick={() => setIsModalOpen(true)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Start Logging
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Analysis Results */}
              {showResults && injuryRiskData.length > 0 && (
                <>
                  {/* Active Injuries - Priority Card */}
                  {injuryRiskData.filter(r => r.isInjured).length > 0 && (
                    <Card className="flex-1 border-purple-500/20">
                      <CardHeader className="border-b border-white/10">
                        <CardTitle className="text-white flex items-center gap-2 text-lg">
                          <div className="h-8 w-8 rounded-md bg-purple-500/10 flex items-center justify-center">
                            <AlertTriangle className="h-4 w-4 text-purple-400 animate-pulse" />
                          </div>
                          Active Injuries
                        </CardTitle>
                        <CardDescription className="text-xs mt-1">
                          Recently reported injuries (last 7 days)
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3 pt-5">
                        {injuryRiskData
                          .filter(r => r.isInjured)
                          .map((risk, idx) => (
                            <div key={idx} className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-white capitalize text-base">{risk.part.replace('-', ' ')}</span>
                                <span className="px-3 py-1.5 bg-purple-500/20 text-purple-300 rounded-full text-xs font-medium flex items-center gap-1 border border-purple-500/30">
                                  <AlertTriangle className="h-3 w-3" />
                                  INJURED
                                </span>
                              </div>
                              <p className="text-sm text-white/70 leading-relaxed">
                                {risk.message}
                              </p>
                              <div className="mt-3 p-3 bg-purple-500/5 rounded-md border border-purple-500/10">
                                <p className="text-xs text-white/60 leading-relaxed">
                                  ⚠️ Avoid exercises targeting this area. Consult medical staff before resuming activity.
                                </p>
                              </div>
                            </div>
                          ))}
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Second Row: Weekly Performance */}
          {showResults && logs.length > 0 && (
            <Card className="border-blue-500/20 mb-6">
              <CardHeader className="border-b border-white/10">
                <CardTitle className="text-white flex items-center gap-2 text-xl">
                  <div className="h-9 w-9 rounded-md bg-blue-500/10 flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-blue-400" />
                  </div>
                  Performance Metrics
                </CardTitle>
                <CardDescription className="mt-2">
                  Key performance indicators from logged activities
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                  <div className="p-4 bg-blue-500/5 rounded-lg border border-blue-500/10">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-blue-500/10 rounded-lg">
                        <Zap className="h-5 w-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-xs text-white/50 font-medium">Total Sessions</p>
                        <p className="text-2xl font-bold text-blue-400">{logs.length}</p>
                      </div>
                    </div>
                    <p className="text-xs text-white/40">All time</p>
                  </div>

                  <div className="p-4 bg-green-500/5 rounded-lg border border-green-500/10">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-green-500/10 rounded-lg">
                        <Heart className="h-5 w-5 text-green-400" />
                      </div>
                      <div>
                        <p className="text-xs text-white/50 font-medium">Avg Heart Rate</p>
                        <p className="text-2xl font-bold text-green-400">
                          {(() => {
                            const logsWithHR = logs.filter((l: any) => l.heartRateAvg);
                            if (logsWithHR.length === 0) return '-';
                            const avg = Math.round(
                              logsWithHR.reduce((sum: number, l: any) => sum + (l.heartRateAvg || 0), 0) / logsWithHR.length
                            );
                            return avg;
                          })()}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-white/40">bpm</p>
                  </div>

                  <div className="p-4 bg-orange-500/5 rounded-lg border border-orange-500/10">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-orange-500/10 rounded-lg">
                        <Flame className="h-5 w-5 text-orange-400" />
                      </div>
                      <div>
                        <p className="text-xs text-white/50 font-medium">Calories Burned</p>
                        <p className="text-2xl font-bold text-orange-400">
                          {(() => {
                            const total = logs.reduce((sum: number, l: any) => sum + (l.caloriesBurned || 0), 0);
                            return total > 0 ? total.toLocaleString() : '-';
                          })()}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-white/40">kcal total</p>
                  </div>

                  <div className="p-4 bg-purple-500/5 rounded-lg border border-purple-500/10">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-purple-500/10 rounded-lg">
                        <Timer className="h-5 w-5 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-xs text-white/50 font-medium">Active Hours</p>
                        <p className="text-2xl font-bold text-purple-400">
                          {(logs.reduce((sum: number, l: any) => sum + (l.duration || 0), 0) / 60).toFixed(1)}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-white/40">hours</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Third Row: Activity History */}
          <Card>
            <CardHeader className="border-b border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white flex items-center gap-2 text-xl">
                    <div className="h-9 w-9 rounded-md bg-blue-500/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-blue-400" />
                    </div>
                    Activity History
                  </CardTitle>
                  <CardDescription className="mt-2">
                    Complete training and match log timeline
                  </CardDescription>
                </div>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => setIsModalOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Entry
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {logs.length === 0 ? (
                <div className="text-center py-16">
                  <div className="h-20 w-20 rounded-lg bg-blue-500/10 flex items-center justify-center mx-auto mb-5">
                    <Calendar className="h-10 w-10 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-medium text-white mb-2">
                    No Activities Logged Yet
                  </h3>
                  <p className="text-sm text-white/50 mb-6 max-w-md mx-auto leading-relaxed">
                    Start tracking {selectedAthlete?.name || 'athlete'}'s training sessions and matches to generate AI-powered injury risk assessments
                  </p>
                  <Button 
                    variant="default"
                    onClick={() => setIsModalOpen(true)}
                    disabled={!selectedAthlete}
                    size="lg"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Log First Activity
                  </Button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {logs.map((log, index) => (
                    <div 
                      key={(log as any).id || index}
                      onClick={() => handleActivityClick(log)}
                      className="p-4 bg-white/[0.02] rounded-lg border border-white/5 hover:border-white/20 transition-all cursor-pointer group hover:bg-white/[0.04]"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {'sport' in log ? (
                            <div className="p-2 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors border border-purple-500/20">
                              <Trophy className="h-4 w-4 text-purple-400" />
                            </div>
                          ) : (
                            <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors border border-blue-500/20">
                              <Activity className="h-4 w-4 text-blue-400" />
                            </div>
                          )}
                          <span className="text-xs font-medium text-white/50 group-hover:text-white/70 transition-colors">
                            {'sport' in log ? 'Match' : 'Workout'}
                          </span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-xs text-white/50 group-hover:text-white/70 transition-colors">
                            {new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                          <span className="text-[10px] text-white/40 mt-0.5 group-hover:text-blue-400 transition-colors">
                            Click to view
                          </span>
                        </div>
                      </div>
                      
                      <h4 className="font-medium text-white mb-3 group-hover:text-white transition-colors">
                        {'sport' in log ? log.sport : log.workoutType}
                      </h4>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-white/50">Duration</span>
                          <span className="font-medium text-white/70">{log.duration} mins</span>
                        </div>
                        {'heartRateAvg' in log && log.heartRateAvg && (
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-white/50">Avg HR</span>
                            <span className="font-medium text-white/70">{log.heartRateAvg} bpm</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </main>

        {/* Detailed Analysis Side Panel */}
        {showDetailPanel && selectedBodyPart && showResults && (
          <>
            {/* Overlay */}
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-in fade-in duration-300"
              onClick={() => setShowDetailPanel(false)}
            />
            
            {/* Side Panel */}
            <div className="fixed right-0 top-0 bottom-0 w-full md:w-[480px] bg-[#0a0a0a] border-l border-white/10 z-50 shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300">
              <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between sticky top-0 bg-[#0a0a0a] pb-4 border-b border-white/10">
                  <div>
                    <h2 className="text-2xl font-bold text-white capitalize mb-1">
                      {selectedBodyPart.replace('-', ' ')}
                    </h2>
                    <p className="text-sm text-white/50">Detailed Injury Risk Analysis</p>
                  </div>
                  <button
                    onClick={() => setShowDetailPanel(false)}
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <svg className="w-6 h-6 text-white/50 hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {(() => {
                  const riskData = injuryRiskData.find(item => item.part === selectedBodyPart);
                  if (!riskData) return null;

                  const getRiskColor = () => {
                    if (riskData.isInjured) return "purple";
                    if (riskData.percentage >= 70) return "red";
                    if (riskData.percentage >= 50) return "orange";
                    if (riskData.percentage >= 30) return "amber";
                    return "green";
                  };

                  const colorScheme = getRiskColor();
                  const colorClasses = {
                    purple: {
                      bg: "bg-purple-500/10",
                      border: "border-purple-500/20",
                      text: "text-purple-400",
                      badge: "bg-purple-500/20 text-purple-300 border border-purple-500/30",
                    },
                    red: {
                      bg: "bg-red-500/10",
                      border: "border-red-500/20",
                      text: "text-red-400",
                      badge: "bg-red-500/20 text-red-300 border border-red-500/30",
                    },
                    orange: {
                      bg: "bg-orange-500/10",
                      border: "border-orange-500/20",
                      text: "text-orange-400",
                      badge: "bg-orange-500/20 text-orange-300 border border-orange-500/30",
                    },
                    amber: {
                      bg: "bg-amber-500/10",
                      border: "border-amber-500/20",
                      text: "text-amber-400",
                      badge: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
                    },
                    green: {
                      bg: "bg-green-500/10",
                      border: "border-green-500/20",
                      text: "text-green-400",
                      badge: "bg-green-500/20 text-green-300 border border-green-500/30",
                    },
                  }[colorScheme];

                  return (
                    <>
                      {/* Risk Score Card */}
                      <div className={`${colorClasses.bg} border ${colorClasses.border} rounded-lg p-6`}>
                        <div className="flex items-center justify-between mb-5">
                          <div>
                            <p className="text-xs text-white/50 uppercase tracking-wide mb-2 font-medium">Injury Risk Score</p>
                            <div className="flex items-baseline gap-2">
                              <span className={`text-5xl font-bold ${colorClasses.text}`}>
                                {riskData.percentage}
                              </span>
                              <span className="text-2xl text-white/40 font-medium">/100</span>
                            </div>
                          </div>
                          <div className={`${colorClasses.badge} px-4 py-2 rounded-lg text-xs font-bold uppercase`}>
                            {riskData.risk}
                          </div>
                        </div>

                        {/* Progress visualization */}
                        <div className="space-y-2">
                          <div className="h-3 bg-white/5 rounded-full overflow-hidden relative">
                            <div 
                              className={`h-full ${colorClasses.bg} transition-all duration-1000 ease-out`}
                              style={{ width: `${riskData.percentage}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-white/40 font-medium">
                            <span>Minimal Risk</span>
                            <span>Critical Risk</span>
                          </div>
                        </div>
                      </div>

                      {/* Assessment Message */}
                      <div className="bg-white/[0.02] border border-white/5 rounded-lg p-5">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-0.5">
                            <AlertTriangle className={`h-5 w-5 ${colorClasses.text}`} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-white mb-2">{riskData.isInjured ? 'Injury Status' : 'AI Assessment'}</h3>
                            <p className="text-sm text-white/70 leading-relaxed">
                              {riskData.message}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Special Injured Warning */}
                      {riskData.isInjured && (
                        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-5">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0">
                              <AlertTriangle className="h-6 w-6 text-purple-400 animate-pulse" />
                            </div>
                            <div>
                              <h3 className="font-bold text-white mb-3 text-lg">⚠️ Medical Protocol Required</h3>
                              <div className="space-y-3">
                                <div className="flex items-start gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 flex-shrink-0"></div>
                                  <p className="text-sm text-white/70">
                                    <span className="font-semibold">Immediate Action:</span> No training involving this body part
                                  </p>
                                </div>
                                <div className="flex items-start gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 flex-shrink-0"></div>
                                  <p className="text-sm text-white/70">
                                    <span className="font-semibold">Medical Clearance:</span> Consult team medical staff before resuming activity
                                  </p>
                                </div>
                                <div className="flex items-start gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 flex-shrink-0"></div>
                                  <p className="text-sm text-white/70">
                                    <span className="font-semibold">Recovery Protocol:</span> Follow prescribed rehabilitation program
                                  </p>
                                </div>
                                <div className="flex items-start gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 flex-shrink-0"></div>
                                  <p className="text-sm text-white/70">
                                    <span className="font-semibold">Monitoring:</span> Daily assessment required until cleared
                                  </p>
                                </div>
                              </div>
                              <div className="mt-4 p-3 bg-purple-500/5 rounded-lg border border-purple-500/10">
                                <p className="text-xs text-white/60 text-center font-medium">
                                  🏥 This injury was reported in the last 7 days. Contact medical team immediately if symptoms worsen.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Contributing Factors */}
                      {!riskData.isInjured && (
                      <div className="bg-white/[0.02] border border-white/5 rounded-lg p-5">
                        <h3 className="font-medium text-white mb-4 flex items-center gap-2">
                          <BarChart3 className="h-5 w-5 text-blue-400" />
                          Contributing Factors
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-white/70 font-medium">Training Load</span>
                              <span className="text-sm font-medium text-red-400">High</span>
                            </div>
                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-red-400 w-[78%]" />
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-white/70 font-medium">Fatigue Index</span>
                              <span className="text-sm font-medium text-orange-400">Medium</span>
                            </div>
                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-orange-400 w-[56%]" />
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-white/70 font-medium">Recovery Time</span>
                              <span className="text-sm font-medium text-amber-400">Medium</span>
                            </div>
                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-amber-400 w-[45%]" />
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-white/70 font-medium">Movement Patterns</span>
                              <span className="text-sm font-medium text-green-400">Normal</span>
                            </div>
                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-green-400 w-[25%]" />
                            </div>
                          </div>
                        </div>
                      </div>
                      )}

                      {/* Recommendations */}
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-5">
                        <h3 className="font-medium text-white mb-4 flex items-center gap-2">
                          <Shield className="h-5 w-5 text-blue-400" />
                          Recommendations
                        </h3>
                        <div className="space-y-4">
                          <div className="flex gap-3">
                            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center text-xs font-bold border border-blue-500/20">
                              1
                            </div>
                            <div>
                              <p className="text-sm text-white/70 leading-relaxed">
                                Reduce training intensity by 20-30% for the next 3-5 days
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center text-xs font-bold border border-blue-500/20">
                              2
                            </div>
                            <div>
                              <p className="text-sm text-white/70 leading-relaxed">
                                Implement targeted stretching and mobility work
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center text-xs font-bold border border-blue-500/20">
                              3
                            </div>
                            <div>
                              <p className="text-sm text-white/70 leading-relaxed">
                                Schedule physiotherapy assessment within 7 days
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Recent Activity */}
                      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
                        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                          <Activity className="h-5 w-5 text-purple-400" />
                          Recent Activity Impact
                        </h3>
                        <div className="space-y-3">
                          {logs.slice(-3).reverse().map((log, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                              <div>
                                <p className="text-sm font-medium text-white">
                                  {'sport' in log ? log.sport : log.workoutType}
                                </p>
                                <p className="text-xs text-white/50">
                                  {new Date(log.date).toLocaleDateString()} • {log.duration} mins
                                </p>
                              </div>
                              <div className="text-right">
                                <p className={`text-xs font-bold ${colorClasses.text}`}>
                                  +{Math.floor(Math.random() * 15 + 5)}%
                                </p>
                                <p className="text-xs text-white/40">strain</p>
                              </div>
                            </div>
                          ))}
                          {logs.length === 0 && (
                            <p className="text-sm text-white/50 text-center py-4">
                              No recent activities logged
                            </p>
                          )}
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
