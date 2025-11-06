export interface User {
  id: string;
  email: string;
  name: string;
  googleId: string;
  accessToken?: string;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface HealthMetrics {
  date: Date;
  steps: number;
  activeMinutes: number;
  heartRate: number;
  sleepHours: number;
  caloriesBurned: number;
  workoutSessions: WorkoutSession[];
}

export interface WorkoutSession {
  type: string;
  duration: number; // minutes
  intensity: "low" | "medium" | "high";
  caloriesBurned: number;
  startTime: Date;
  endTime: Date;
}

export interface HealthScore {
  id: string;
  userId: string;
  date: Date;
  overallScore: number; // 0-100
  activityLevel: number; // 0-100
  sleepQuality: number; // 0-100
  recoveryScore: number; // 0-100
  consistency: number; // 0-100
}

export interface InjuryRisk {
  level: "LOW" | "MEDIUM" | "HIGH";
  score: number; // 0-100
  factors: string[];
  recommendations: string[];
}

export interface AIRecommendation {
  id: string;
  userId: string;
  date: Date;
  type: "rest" | "activity" | "nutrition" | "hydration" | "sleep" | "warning";
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
}

export interface DashboardData {
  user: User;
  healthScore: HealthScore;
  injuryRisk: InjuryRisk;
  weeklyMetrics: HealthMetrics[];
  recommendations: AIRecommendation[];
}

export interface GoogleFitData {
  steps: number;
  distance: number;
  calories: number;
  activeMinutes: number;
  heartRate: {
    average: number;
    resting: number;
    max: number;
  };
  sleep: {
    duration: number; // minutes
    deepSleep: number;
    lightSleep: number;
    remSleep: number;
  };
  activities: Array<{
    type: string;
    duration: number;
    calories: number;
    startTime: string;
    endTime: string;
  }>;
}

// Pose Detection Types
export interface Keypoint {
  x: number;
  y: number;
  score?: number;
  name?: string;
}

export interface Pose {
  keypoints: Keypoint[];
  score?: number;
}

export type ExerciseType = "squat" | "pushup" | "deadlift" | "crunch";

export type RepPhase = "starting" | "down" | "bottom" | "up" | "top" | "completed";

export interface ExerciseConfig {
  name: string;
  type: ExerciseType;
  description: string;
  targetReps: number;
  targetSets: number;
  restTime: number; // seconds
  demoVideoUrl?: string;
  instructions: string[];
}

export interface FormFeedback {
  type: "error" | "warning" | "success";
  message: string;
  timestamp: number;
  persistent: boolean;
  frameCount: number;
}

export interface RepData {
  repNumber: number;
  duration: number; // milliseconds
  phase: RepPhase;
  formScore: number; // 0-100
  feedback: string[];
}

export interface SetData {
  setNumber: number;
  reps: RepData[];
  startTime: Date;
  endTime?: Date;
  averageFormScore: number;
}

export interface WorkoutSession {
  id: string;
  userId: string;
  exerciseType: ExerciseType;
  sets: SetData[];
  startTime: Date;
  endTime?: Date;
  totalReps: number;
  averageFormScore: number;
  completed: boolean;
}

export interface WorkoutState {
  phase: "selecting" | "demo" | "ready" | "camera-setup" | "exercising" | "resting" | "completed";
  currentExercise: ExerciseConfig | null;
  currentSet: number;
  currentRep: number;
  repPhase: RepPhase;
  sets: SetData[];
  formFeedback: FormFeedback[];
  lastRepTime: number;
  restTimeRemaining: number;
}

