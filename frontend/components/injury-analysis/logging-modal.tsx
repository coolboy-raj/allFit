"use client";

import { useState, useMemo, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { 
  Dumbbell, 
  Trophy, 
  Clock, 
  Target, 
  Activity,
  Heart,
  Gauge,
  Calendar,
  MapPin,
  Users,
  AlertCircle,
  Zap,
  Timer,
  Check
} from "lucide-react";
import {
  WORKOUT_TYPE_OPTIONS,
  SPORT_OPTIONS,
  EXERCISE_DATABASE,
  EQUIPMENT_OPTIONS,
  INTENSITY_LEVELS,
  RECOVERY_STATUS_OPTIONS,
  MATCH_TYPE_OPTIONS,
  SURFACE_TYPE_OPTIONS,
  getPositionsForSport,
  getAffectedBodyPartsForSport,
  getAffectedBodyPartsForWorkout,
  getAffectedBodyPartsForExercises,
} from "@/lib/injury-analysis/constants";
import { BodyPart } from "./human-anatomy";
import { MultiSelect } from "@/components/ui/multi-select";
import { WorkoutCard, WorkoutExercise } from "./workout-card";
import { InjuryCard, InjuryEntry } from "./injury-card";
import { Plus } from "lucide-react";

interface LoggingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: WorkoutLogData | SportsLogData, type: "workout" | "sports") => void;
  athleteName: string;
}

export interface WorkoutLogData {
  date: string;
  startTime: string;
  duration: number;
  workoutType: string;
  workoutExercises: WorkoutExercise[]; // Multiple workout exercises per session
  equipmentUsed: string[]; // Selected from EQUIPMENT_OPTIONS
  heartRateAvg?: number;
  heartRateMax?: number;
  caloriesBurned?: number;
  affectedBodyParts: BodyPart[]; // Calculated from workout exercises
  performanceNotes: string;
  fatigueLevel: number; // 1-10 scale
  recoveryStatus: string; // Selected from RECOVERY_STATUS_OPTIONS
  weatherConditions?: string;
}

export interface SportsLogData {
  date: string;
  sport: string; // Selected from SPORT_OPTIONS
  position: string; // Dynamically populated based on sport
  duration: number;
  matchType: string; // Selected from MATCH_TYPE_OPTIONS
  location: string;
  opponent: string;
  result: string;
  minutesPlayed: number;
  intensityLevel: string; // Selected from INTENSITY_LEVELS
  performanceMetrics: {
    sprintDistance?: number;
    topSpeed?: number;
    jumps?: number;
    tackles?: number;
  };
  heartRateAvg?: number;
  heartRateMax?: number;
  recoveryStatus: string; // Selected from RECOVERY_STATUS_OPTIONS
  surfaceType: string; // Selected from SURFACE_TYPE_OPTIONS
  weatherConditions: string;
  injuries: InjuryEntry[]; // Multiple injuries per match
  medicalAttention: string;
  affectedBodyParts: BodyPart[]; // Calculated from sport
  coachFeedback: string;
}

export function LoggingModal({ isOpen, onClose, onSubmit, athleteName }: LoggingModalProps) {
  const [activeTab, setActiveTab] = useState<"workout" | "sports">("workout");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Reset validation errors and tab when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      // Reset to workout tab when modal opens
      setActiveTab("workout");
      setValidationErrors([]);
      console.log('[Logging Modal] Modal opened, reset to workout tab');
    } else {
      // Clear errors when modal closes
      setValidationErrors([]);
    }
  }, [isOpen]);

  // Workout State
  const [workoutData, setWorkoutData] = useState<WorkoutLogData>({
    date: new Date().toISOString().split('T')[0],
    startTime: "",
    duration: 60,
    workoutType: "strength",
    workoutExercises: [
      {
        id: crypto.randomUUID(),
        exercise: "",
        sets: 3,
        reps: 10,
        weight: 0,
        intensity: "moderate",
        notes: "",
      }
    ],
    equipmentUsed: [],
    heartRateAvg: undefined,
    heartRateMax: undefined,
    caloriesBurned: undefined,
    affectedBodyParts: [],
    performanceNotes: "",
    fatigueLevel: 5,
    recoveryStatus: "normal",
    weatherConditions: "",
  });

  // Sports State
  const [sportsData, setSportsData] = useState<SportsLogData>({
    date: new Date().toISOString().split('T')[0],
    sport: "",
    position: "",
    duration: 90,
    matchType: "competitive",
    location: "",
    opponent: "",
    result: "",
    minutesPlayed: 90,
    intensityLevel: "hard",
    performanceMetrics: {},
    heartRateAvg: undefined,
    heartRateMax: undefined,
    recoveryStatus: "normal",
    surfaceType: "",
    weatherConditions: "",
    injuries: [],
    medicalAttention: "none",
    affectedBodyParts: [],
    coachFeedback: ""
  });

  // Dynamic position options based on selected sport
  const availablePositions = useMemo(() => {
    return getPositionsForSport(sportsData.sport);
  }, [sportsData.sport]);

  // Helper functions for workout exercises
  const addWorkoutExercise = () => {
    if (workoutData.workoutExercises.length >= 9) return; // Max 9 workouts
    
    const newExercise: WorkoutExercise = {
      id: crypto.randomUUID(),
      exercise: "",
      sets: 3,
      reps: 10,
      weight: 0,
      intensity: "moderate",
      notes: "",
    };
    
    setWorkoutData(prev => ({
      ...prev,
      workoutExercises: [...prev.workoutExercises, newExercise]
    }));
  };

  const removeWorkoutExercise = (id: string) => {
    setWorkoutData(prev => ({
      ...prev,
      workoutExercises: prev.workoutExercises.filter(w => w.id !== id)
    }));
  };

  const updateWorkoutExercise = (id: string, field: keyof WorkoutExercise, value: any) => {
    setWorkoutData(prev => ({
      ...prev,
      workoutExercises: prev.workoutExercises.map(w =>
        w.id === id ? { ...w, [field]: value } : w
      )
    }));
  };

  // Helper functions for injury tracking
  const addInjury = () => {
    if (sportsData.injuries.length >= 9) return; // Max 9 injuries
    
    const newInjury: InjuryEntry = {
      id: crypto.randomUUID(),
      bodyPart: "",
      injuryType: "",
      severity: "minor",
      timeOccurred: "",
      mechanism: "",
      notes: "",
    };
    
    setSportsData(prev => ({
      ...prev,
      injuries: [...prev.injuries, newInjury]
    }));
  };

  const removeInjury = (id: string) => {
    setSportsData(prev => ({
      ...prev,
      injuries: prev.injuries.filter(inj => inj.id !== id)
    }));
  };

  const updateInjury = (id: string, field: keyof InjuryEntry, value: string) => {
    setSportsData(prev => ({
      ...prev,
      injuries: prev.injuries.map(inj =>
        inj.id === id ? { ...inj, [field]: value } : inj
      )
    }));
  };

  // Automatically calculate affected body parts for workout
  useMemo(() => {
    const workoutParts = getAffectedBodyPartsForWorkout(workoutData.workoutType);
    const selectedExercises = workoutData.workoutExercises
      .map(w => w.exercise)
      .filter(Boolean);
    const exerciseParts = getAffectedBodyPartsForExercises(selectedExercises);
    const allParts = Array.from(new Set([...workoutParts, ...exerciseParts]));
    
    if (JSON.stringify(allParts) !== JSON.stringify(workoutData.affectedBodyParts)) {
      setWorkoutData(prev => ({ ...prev, affectedBodyParts: allParts }));
    }
  }, [workoutData.workoutType, workoutData.workoutExercises, workoutData.affectedBodyParts]);

  // Automatically calculate affected body parts for sports
  useMemo(() => {
    if (sportsData.sport) {
      const sportParts = getAffectedBodyPartsForSport(sportsData.sport);
      
      if (JSON.stringify(sportParts) !== JSON.stringify(sportsData.affectedBodyParts)) {
        setSportsData(prev => ({ ...prev, affectedBodyParts: sportParts }));
      }
    }
  }, [sportsData.sport, sportsData.affectedBodyParts]);

  const validateWorkoutData = (): string[] => {
    console.log('[Logging Modal] validateWorkoutData called');
    const errors: string[] = [];
    
    if (!workoutData.date) {
      errors.push("Date is required");
    }
    
    if (!workoutData.duration || workoutData.duration <= 0) {
      errors.push("Duration must be greater than 0");
    }
    
    if (!workoutData.workoutType) {
      errors.push("Workout type is required");
    }
    
    if (workoutData.workoutExercises.length === 0) {
      errors.push("At least one exercise is required");
    }
    
    // Validate each exercise
    workoutData.workoutExercises.forEach((exercise, index) => {
      if (!exercise.exercise || exercise.exercise.trim() === '') {
        errors.push(`Exercise #${index + 1}: Exercise name is required`);
      }
    });
    
    return errors;
  };

  const validateSportsData = (): string[] => {
    console.log('[Logging Modal] validateSportsData called');
    const errors: string[] = [];
    
    if (!sportsData.date) {
      errors.push("Date is required");
    }
    
    if (!sportsData.sport) {
      errors.push("Sport is required");
    }
    
    if (!sportsData.duration || sportsData.duration <= 0) {
      errors.push("Duration must be greater than 0");
    }
    
    if (!sportsData.matchType) {
      errors.push("Match type is required");
    }
    
    return errors;
  };

  const cleanWorkoutData = (data: WorkoutLogData): WorkoutLogData => {
    return {
      ...data,
      startTime: data.startTime?.trim() || undefined as any, // Convert empty string to undefined
      heartRateAvg: data.heartRateAvg || undefined,
      heartRateMax: data.heartRateMax || undefined,
      caloriesBurned: data.caloriesBurned || undefined,
      performanceNotes: data.performanceNotes?.trim() || '',
      equipmentUsed: data.equipmentUsed.filter(e => e.trim() !== ''),
      weatherConditions: data.weatherConditions?.trim() || '',
    };
  };

  const cleanSportsData = (data: SportsLogData): SportsLogData => {
    return {
      ...data,
      location: data.location?.trim() || '',
      opponent: data.opponent?.trim() || '',
      result: data.result?.trim() || '',
      heartRateAvg: data.heartRateAvg || undefined,
      heartRateMax: data.heartRateMax || undefined,
      weatherConditions: data.weatherConditions?.trim() || '',
      medicalAttention: data.medicalAttention?.trim() || '',
      coachFeedback: data.coachFeedback?.trim() || '',
    };
  };

  const handleSubmit = async () => {
    // Clear previous errors
    setValidationErrors([]);
    
    console.log(`[Logging Modal] ========== SUBMIT CLICKED ==========`);
    console.log(`[Logging Modal] Current activeTab state: "${activeTab}"`);
    console.log(`[Logging Modal] activeTab === "workout": ${activeTab === "workout"}`);
    console.log(`[Logging Modal] activeTab === "sports": ${activeTab === "sports"}`);
    
    // SAFETY CHECK: Ensure activeTab is valid
    if (activeTab !== "workout" && activeTab !== "sports") {
      console.error(`[Logging Modal] ERROR: Invalid activeTab value: "${activeTab}"`);
      setValidationErrors(["Invalid tab state. Please close and reopen the modal."]);
      return;
    }
    
    // Validate ONLY the active tab's data
    let errors: string[] = [];
    if (activeTab === "workout") {
      console.log('[Logging Modal] ✓ Running WORKOUT validation');
      errors = validateWorkoutData();
    } else if (activeTab === "sports") {
      console.log('[Logging Modal] ✓ Running SPORTS validation');
      errors = validateSportsData();
    }
    
    if (errors.length > 0) {
      console.log(`[Logging Modal] ❌ Validation failed for ${activeTab}:`, errors);
      setValidationErrors(errors);
      return;
    }
    
    console.log(`[Logging Modal] ✓ Validation passed for ${activeTab}`);
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      if (activeTab === "workout") {
        console.log('[Logging Modal] → Submitting WORKOUT data');
        const cleanedData = cleanWorkoutData(workoutData);
        onSubmit(cleanedData, "workout");
      } else {
        console.log('[Logging Modal] → Submitting SPORTS data');
        const cleanedData = cleanSportsData(sportsData);
        onSubmit(cleanedData, "sports");
      }
      
      setIsSubmitting(false);
      setValidationErrors([]);
      onClose();
    } catch (error) {
      console.error('[Logging Modal] Submit error:', error);
      setIsSubmitting(false);
      setValidationErrors(["Failed to submit. Please try again."]);
    }
  };

  const handleTabChange = (tab: "workout" | "sports") => {
    console.log(`[Logging Modal] Tab changed to: ${tab}`);
    setActiveTab(tab);
    setValidationErrors([]); // Clear errors when switching tabs
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="xl"
      title={`Log Activity for ${athleteName}`}
      description="Enter comprehensive training or match data for injury prediction analysis"
    >
      <Tabs value={activeTab} onValueChange={(value) => handleTabChange(value as "workout" | "sports")}>
        <TabsList>
          <TabsTrigger value="workout">
            <Dumbbell className="h-4 w-4 mr-2" />
            Workout Logging
          </TabsTrigger>
          <TabsTrigger value="sports">
            <Trophy className="h-4 w-4 mr-2" />
            Sports/Match Logging
          </TabsTrigger>
        </TabsList>

        {/* WORKOUT LOGGING */}
        <TabsContent value="workout">
          <div className="space-y-6">
            {/* Minimalistic Session Info */}
            <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
                  Session Info
                </h3>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="workout-date">
                    Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="workout-date"
                    type="date"
                    value={workoutData.date}
                    onChange={(e) => setWorkoutData({...workoutData, date: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-gray-400">Start Time (optional)</Label>
                  <Input
                    id="workout-time"
                    type="time"
                    value={workoutData.startTime}
                    onChange={(e) => setWorkoutData({...workoutData, startTime: e.target.value})}
                    className="bg-gray-950/50 border-gray-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-gray-400">
                    Duration (min) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="workout-duration"
                    type="number"
                    placeholder="60"
                    min="1"
                    max="300"
                    value={workoutData.duration}
                    onChange={(e) => setWorkoutData({...workoutData, duration: parseInt(e.target.value) || 0})}
                    className="bg-gray-950/50 border-gray-700"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-gray-400">
                    Workout Type <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    id="workout-type"
                    value={workoutData.workoutType}
                    onChange={(e) => setWorkoutData({...workoutData, workoutType: e.target.value})}
                    className="bg-gray-950/50 border-gray-700"
                    required
                  >
                    {WORKOUT_TYPE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
            </div>

            {/* Exercises Grid */}
            <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
                  Exercises ({workoutData.workoutExercises.length}/9)
                </h3>
                <button
                  type="button"
                  onClick={addWorkoutExercise}
                  disabled={workoutData.workoutExercises.length >= 9}
                  className="text-xs px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-md transition-colors flex items-center gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Exercise
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {workoutData.workoutExercises.map((workout, index) => (
                  <WorkoutCard
                    key={workout.id}
                    workout={workout}
                    index={index}
                    onUpdate={updateWorkoutExercise}
                    onRemove={removeWorkoutExercise}
                    canRemove={workoutData.workoutExercises.length > 1}
                  />
                ))}
                
                {/* Add Exercise Card Placeholder */}
                {workoutData.workoutExercises.length < 9 && (
                  <button
                    type="button"
                    onClick={addWorkoutExercise}
                    className="bg-gray-900/30 border-2 border-dashed border-gray-700 rounded-lg p-6 hover:border-blue-600 hover:bg-blue-600/5 transition-all duration-200 flex flex-col items-center justify-center min-h-[280px] group"
                  >
                    <Plus className="h-10 w-10 text-gray-600 group-hover:text-blue-600 mb-2 transition-colors" />
                    <span className="text-sm font-medium text-gray-500 group-hover:text-blue-500 transition-colors">
                      Add Exercise
                    </span>
                  </button>
                )}
              </div>
            </div>

            {/* Additional Details */}
            <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-5">
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-4">
                Additional Details
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-gray-400">Equipment Used</Label>
                  <MultiSelect
                    options={EQUIPMENT_OPTIONS.map(e => ({ value: e.value, label: e.label }))}
                    value={workoutData.equipmentUsed}
                    onChange={(selected) => setWorkoutData({...workoutData, equipmentUsed: selected})}
                    placeholder="Select equipment..."
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-gray-400">Recovery Status</Label>
                  <Select
                    value={workoutData.recoveryStatus}
                    onChange={(e) => setWorkoutData({...workoutData, recoveryStatus: e.target.value})}
                    className="bg-gray-950/50 border-gray-700"
                  >
                    {RECOVERY_STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
            </div>

            {/* Physiological & Performance */}
            <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-5">
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-4">
                Physiological & Performance
              </h3>
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-gray-400">Avg HR (bpm)</Label>
                  <Input
                    id="hr-avg"
                    type="number"
                    placeholder="145"
                    min="0"
                    max="220"
                    value={workoutData.heartRateAvg || ""}
                    onChange={(e) => setWorkoutData({...workoutData, heartRateAvg: e.target.value ? parseInt(e.target.value) : undefined})}
                    className="bg-gray-950/50 border-gray-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-gray-400">Max HR (bpm)</Label>
                  <Input
                    id="hr-max"
                    type="number"
                    placeholder="178"
                    min="0"
                    max="220"
                    value={workoutData.heartRateMax || ""}
                    onChange={(e) => setWorkoutData({...workoutData, heartRateMax: e.target.value ? parseInt(e.target.value) : undefined})}
                    className="bg-gray-950/50 border-gray-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-gray-400">Calories</Label>
                  <Input
                    id="calories"
                    type="number"
                    placeholder="650"
                    min="0"
                    value={workoutData.caloriesBurned || ""}
                    onChange={(e) => setWorkoutData({...workoutData, caloriesBurned: e.target.value ? parseInt(e.target.value) : undefined})}
                    className="bg-gray-950/50 border-gray-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-gray-400">Fatigue (1-10)</Label>
                  <Input
                    id="fatigue"
                    type="number"
                    min="1"
                    max="10"
                    value={workoutData.fatigueLevel}
                    onChange={(e) => setWorkoutData({...workoutData, fatigueLevel: parseInt(e.target.value) || 5})}
                    className="bg-gray-950/50 border-gray-700"
                  />
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <Label className="text-xs text-gray-400">Performance Notes (Optional)</Label>
                <Textarea
                  id="performance-notes"
                  rows={3}
                  placeholder="Coach observations, technique notes, progress markers..."
                  value={workoutData.performanceNotes}
                  onChange={(e) => setWorkoutData({...workoutData, performanceNotes: e.target.value})}
                  className="bg-gray-950/50 border-gray-700 resize-none"
                />
              </div>
              <div className="mt-4 space-y-2">
                <Label className="text-xs text-gray-400">Weather Conditions (Optional)</Label>
                <Input
                  id="weather-conditions"
                  placeholder="Sunny, 75°F, Clear..."
                  value={workoutData.weatherConditions}
                  onChange={(e) => setWorkoutData({...workoutData, weatherConditions: e.target.value})}
                  className="bg-gray-950/50 border-gray-700"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* SPORTS/MATCH LOGGING */}
        <TabsContent value="sports">
          <div className="space-y-6">
            {/* Match Information */}
            <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
                  Match Information
                </h3>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-gray-400">
                    Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="sports-date"
                    type="date"
                    value={sportsData.date}
                    onChange={(e) => setSportsData({...sportsData, date: e.target.value})}
                    className="bg-gray-950/50 border-gray-700"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-gray-400">
                    Sport <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    id="sport"
                    value={sportsData.sport}
                    onChange={(e) => setSportsData({...sportsData, sport: e.target.value, position: ""})}
                    className="bg-gray-950/50 border-gray-700"
                    required
                  >
                    <option value="">Select sport...</option>
                    {SPORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-gray-400">Position</Label>
                  <Select
                    id="position"
                    value={sportsData.position}
                    onChange={(e) => setSportsData({...sportsData, position: e.target.value})}
                    disabled={!sportsData.sport}
                    className="bg-gray-950/50 border-gray-700"
                  >
                    <option value="">Select position...</option>
                    {availablePositions.map((position) => (
                      <option key={position} value={position}>
                        {position}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-gray-400">
                    Match Type <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    id="match-type"
                    value={sportsData.matchType}
                    onChange={(e) => setSportsData({...sportsData, matchType: e.target.value})}
                    className="bg-gray-950/50 border-gray-700"
                    required
                  >
                    {MATCH_TYPE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="space-y-2">
                  <Label className="text-xs text-gray-400">
                    Duration (min) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="match-duration"
                    type="number"
                    placeholder="90"
                    min="1"
                    max="300"
                    value={sportsData.duration}
                    onChange={(e) => setSportsData({...sportsData, duration: parseInt(e.target.value) || 0})}
                    className="bg-gray-950/50 border-gray-700"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-gray-400">Minutes Played</Label>
                  <Input
                    id="minutes-played"
                    type="number"
                    placeholder="90"
                    min="0"
                    max={sportsData.duration || 300}
                    value={sportsData.minutesPlayed}
                    onChange={(e) => setSportsData({...sportsData, minutesPlayed: parseInt(e.target.value) || 0})}
                    className="bg-gray-950/50 border-gray-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-gray-400">Intensity Level</Label>
                  <Select
                    value={sportsData.intensityLevel}
                    onChange={(e) => setSportsData({...sportsData, intensityLevel: e.target.value})}
                    className="bg-gray-950/50 border-gray-700"
                  >
                    {INTENSITY_LEVELS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
            </div>

            {/* Match Context */}
            <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-5">
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-4">
                Match Context
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-gray-400">Venue</Label>
                  <Input
                    id="location"
                    placeholder="Home / Away / Neutral"
                    value={sportsData.location}
                    onChange={(e) => setSportsData({...sportsData, location: e.target.value})}
                    className="bg-gray-950/50 border-gray-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-gray-400">Opponent</Label>
                  <Input
                    id="opponent"
                    placeholder="Team name"
                    value={sportsData.opponent}
                    onChange={(e) => setSportsData({...sportsData, opponent: e.target.value})}
                    className="bg-gray-950/50 border-gray-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-gray-400">Result</Label>
                  <Input
                    id="result"
                    placeholder="W 3-2, L 78-85..."
                    value={sportsData.result}
                    onChange={(e) => setSportsData({...sportsData, result: e.target.value})}
                    className="bg-gray-950/50 border-gray-700"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label className="text-xs text-gray-400">Surface Type</Label>
                  <Select
                    id="surface"
                    value={sportsData.surfaceType}
                    onChange={(e) => setSportsData({...sportsData, surfaceType: e.target.value})}
                    className="bg-gray-950/50 border-gray-700"
                  >
                    <option value="">Select surface...</option>
                    {SURFACE_TYPE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-gray-400">Weather Conditions</Label>
                  <Input
                    id="weather"
                    placeholder="Sunny, 75°F, Clear..."
                    value={sportsData.weatherConditions}
                    onChange={(e) => setSportsData({...sportsData, weatherConditions: e.target.value})}
                    className="bg-gray-950/50 border-gray-700"
                  />
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-5">
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-4">
                Performance Metrics
              </h3>
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-gray-400">Sprint Distance (m)</Label>
                  <Input
                    id="sprint-distance"
                    type="number"
                    placeholder="2450"
                    min="0"
                    value={sportsData.performanceMetrics.sprintDistance || ""}
                    onChange={(e) => setSportsData({
                      ...sportsData,
                      performanceMetrics: {
                        ...sportsData.performanceMetrics,
                        sprintDistance: e.target.value ? parseInt(e.target.value) : undefined
                      }
                    })}
                    className="bg-gray-950/50 border-gray-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-gray-400">Top Speed (km/h)</Label>
                  <Input
                    id="top-speed"
                    type="number"
                    placeholder="32.5"
                    min="0"
                    step="0.1"
                    value={sportsData.performanceMetrics.topSpeed || ""}
                    onChange={(e) => setSportsData({
                      ...sportsData,
                      performanceMetrics: {
                        ...sportsData.performanceMetrics,
                        topSpeed: e.target.value ? parseFloat(e.target.value) : undefined
                      }
                    })}
                    className="bg-gray-950/50 border-gray-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-gray-400">Jumps/Verticals</Label>
                  <Input
                    id="jumps"
                    type="number"
                    placeholder="24"
                    min="0"
                    value={sportsData.performanceMetrics.jumps || ""}
                    onChange={(e) => setSportsData({
                      ...sportsData,
                      performanceMetrics: {
                        ...sportsData.performanceMetrics,
                        jumps: e.target.value ? parseInt(e.target.value) : undefined
                      }
                    })}
                    className="bg-gray-950/50 border-gray-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-gray-400">Tackles/Contacts</Label>
                  <Input
                    id="tackles"
                    type="number"
                    placeholder="8"
                    min="0"
                    value={sportsData.performanceMetrics.tackles || ""}
                    onChange={(e) => setSportsData({
                      ...sportsData,
                      performanceMetrics: {
                        ...sportsData.performanceMetrics,
                        tackles: e.target.value ? parseInt(e.target.value) : undefined
                      }
                    })}
                    className="bg-gray-950/50 border-gray-700"
                  />
                </div>
              </div>
            </div>

            {/* Physiological & Health */}
            <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-5">
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-4">
                Physiological & Health
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-gray-400">Avg HR (bpm)</Label>
                  <Input
                    id="sports-hr-avg"
                    type="number"
                    placeholder="158"
                    min="0"
                    max="220"
                    value={sportsData.heartRateAvg || ""}
                    onChange={(e) => setSportsData({...sportsData, heartRateAvg: e.target.value ? parseInt(e.target.value) : undefined})}
                    className="bg-gray-950/50 border-gray-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-gray-400">Max HR (bpm)</Label>
                  <Input
                    id="sports-hr-max"
                    type="number"
                    placeholder="192"
                    min="0"
                    max="220"
                    value={sportsData.heartRateMax || ""}
                    onChange={(e) => setSportsData({...sportsData, heartRateMax: e.target.value ? parseInt(e.target.value) : undefined})}
                    className="bg-gray-950/50 border-gray-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-gray-400">Recovery Status</Label>
                  <Select
                    id="recovery-status"
                    value={sportsData.recoveryStatus}
                    onChange={(e) => setSportsData({...sportsData, recoveryStatus: e.target.value})}
                    className="bg-gray-950/50 border-gray-700"
                  >
                    {RECOVERY_STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
            </div>

            {/* Injury Tracking */}
            <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
                    Injury Tracking
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Log any injuries sustained during the match
                  </p>
                </div>
                <button
                  onClick={addInjury}
                  disabled={sportsData.injuries.length >= 9}
                  className="flex items-center gap-2 px-3 py-1.5 bg-red-950/30 hover:bg-red-900/40 border border-red-800/50 rounded-md text-xs text-red-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Injury
                </button>
              </div>
              
              {sportsData.injuries.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-700 rounded-lg">
                  <AlertCircle className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">No injuries logged</p>
                  <p className="text-xs text-gray-500 mt-1">Click "Add Injury" to track any injuries</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  {sportsData.injuries.map((injury) => (
                    <InjuryCard
                      key={injury.id}
                      injury={injury}
                      onUpdate={(field, value) => updateInjury(injury.id, field, value)}
                      onRemove={() => removeInjury(injury.id)}
                      canRemove={sportsData.injuries.length > 0}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Medical Attention */}
            <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-5">
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-4">
                Medical Attention
              </h3>
              <div className="space-y-2">
                <Label className="text-xs text-gray-400">Required Medical Attention</Label>
                <Select
                  id="medical-attention"
                  value={sportsData.medicalAttention}
                  onChange={(e) => setSportsData({...sportsData, medicalAttention: e.target.value})}
                  className="bg-gray-950/50 border-gray-700"
                >
                  <option value="none">None</option>
                  <option value="on-field">On-field Treatment</option>
                  <option value="substitution">Required Substitution</option>
                  <option value="post-match">Post-match Exam</option>
                  <option value="hospital">Hospital Visit</option>
                </Select>
              </div>
            </div>

            {/* Additional Notes */}
            <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-5">
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-4">
                Additional Notes
              </h3>
              <Textarea
                id="coach-feedback"
                rows={4}
                placeholder="Performance assessment, observations, concerns, recommendations..."
                value={sportsData.coachFeedback}
                onChange={(e) => setSportsData({...sportsData, coachFeedback: e.target.value})}
                className="bg-gray-950/50 border-gray-700 resize-none"
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="mt-6 p-4 bg-red-50 dark:bg-red-950/30 border-2 border-red-200 dark:border-red-800 rounded-lg animate-in fade-in duration-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-red-900 dark:text-red-100 mb-2 flex items-center gap-2">
                {activeTab === "workout" ? (
                  <>
                    <Dumbbell className="h-4 w-4" />
                    Workout Logging Errors
                  </>
                ) : (
                  <>
                    <Trophy className="h-4 w-4" />
                    Sports/Match Logging Errors
                  </>
                )}
              </h4>
              <ul className="list-disc list-inside space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index} className="text-sm text-red-800 dark:text-red-200">
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button 
          variant="gradient" 
          size="lg"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Timer className="h-5 w-5 mr-2 animate-spin" />
              Saving Log...
            </>
          ) : (
            <>
              <Zap className="h-5 w-5 mr-2" />
              Save & Analyze
            </>
          )}
        </Button>
      </div>
    </Modal>
  );
}

