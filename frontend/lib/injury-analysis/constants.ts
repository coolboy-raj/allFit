/**
 * Injury Analysis Constants and Type Definitions
 * Defines associations between activities and affected body parts
 */

import { BodyPart } from "@/components/injury-analysis/human-anatomy";

// ============================================================================
// WORKOUT TYPES
// ============================================================================

export const WORKOUT_TYPES = {
  STRENGTH: "strength",
  CARDIO: "cardio",
  HIIT: "hiit",
  FLEXIBILITY: "flexibility",
  SPORT_SPECIFIC: "sport-specific",
  RECOVERY: "recovery",
  PLYOMETRICS: "plyometrics",
  ENDURANCE: "endurance",
} as const;

export const WORKOUT_TYPE_OPTIONS = [
  { value: WORKOUT_TYPES.STRENGTH, label: "Strength Training", affectedParts: ["right-arm", "left-arm", "chest", "abdomen", "right-leg", "left-leg"] as BodyPart[] },
  { value: WORKOUT_TYPES.CARDIO, label: "Cardiovascular", affectedParts: ["right-leg", "left-leg", "chest", "abdomen"] as BodyPart[] },
  { value: WORKOUT_TYPES.HIIT, label: "HIIT", affectedParts: ["right-leg", "left-leg", "right-arm", "left-arm", "chest", "abdomen"] as BodyPart[] },
  { value: WORKOUT_TYPES.FLEXIBILITY, label: "Flexibility/Mobility", affectedParts: ["neck", "right-shoulder", "left-shoulder", "abdomen"] as BodyPart[] },
  { value: WORKOUT_TYPES.SPORT_SPECIFIC, label: "Sport-Specific Training", affectedParts: [] as BodyPart[] },
  { value: WORKOUT_TYPES.RECOVERY, label: "Active Recovery", affectedParts: [] as BodyPart[] },
  { value: WORKOUT_TYPES.PLYOMETRICS, label: "Plyometrics", affectedParts: ["right-leg", "left-leg", "right-foot", "left-foot"] as BodyPart[] },
  { value: WORKOUT_TYPES.ENDURANCE, label: "Endurance Training", affectedParts: ["right-leg", "left-leg", "chest", "abdomen"] as BodyPart[] },
] as const;

// ============================================================================
// SPORTS TYPES
// ============================================================================

export const SPORT_OPTIONS = [
  { 
    value: "basketball", 
    label: "Basketball", 
    affectedParts: ["right-leg", "left-leg", "right-knee", "left-knee", "right-shoulder", "left-shoulder", "right-arm", "left-arm", "right-hand", "left-hand"] as BodyPart[],
    positions: ["Point Guard", "Shooting Guard", "Small Forward", "Power Forward", "Center"]
  },
  { 
    value: "soccer", 
    label: "Soccer/Football", 
    affectedParts: ["right-leg", "left-leg", "right-foot", "left-foot", "abdomen", "chest"] as BodyPart[],
    positions: ["Goalkeeper", "Defender", "Midfielder", "Forward", "Winger", "Striker"]
  },
  { 
    value: "american-football", 
    label: "American Football", 
    affectedParts: ["head", "neck", "right-shoulder", "left-shoulder", "right-leg", "left-leg", "chest", "abdomen"] as BodyPart[],
    positions: ["Quarterback", "Running Back", "Wide Receiver", "Tight End", "Offensive Line", "Defensive Line", "Linebacker", "Defensive Back"]
  },
  { 
    value: "tennis", 
    label: "Tennis", 
    affectedParts: ["right-shoulder", "left-shoulder", "right-arm", "left-arm", "right-hand", "left-hand", "right-leg", "left-leg"] as BodyPart[],
    positions: ["Singles", "Doubles"]
  },
  { 
    value: "baseball", 
    label: "Baseball", 
    affectedParts: ["right-shoulder", "left-shoulder", "right-arm", "left-arm", "right-leg", "left-leg"] as BodyPart[],
    positions: ["Pitcher", "Catcher", "First Base", "Second Base", "Third Base", "Shortstop", "Outfield"]
  },
  { 
    value: "volleyball", 
    label: "Volleyball", 
    affectedParts: ["right-shoulder", "left-shoulder", "right-arm", "left-arm", "right-hand", "left-hand", "right-leg", "left-leg"] as BodyPart[],
    positions: ["Setter", "Outside Hitter", "Middle Blocker", "Opposite Hitter", "Libero"]
  },
  { 
    value: "hockey", 
    label: "Hockey", 
    affectedParts: ["right-leg", "left-leg", "right-shoulder", "left-shoulder", "right-arm", "left-arm", "chest"] as BodyPart[],
    positions: ["Center", "Winger", "Defenseman", "Goaltender"]
  },
  { 
    value: "rugby", 
    label: "Rugby", 
    affectedParts: ["head", "neck", "right-shoulder", "left-shoulder", "chest", "abdomen", "right-leg", "left-leg"] as BodyPart[],
    positions: ["Forward", "Back", "Scrum Half", "Fly Half", "Center", "Wing", "Fullback"]
  },
  { 
    value: "track-field", 
    label: "Track & Field", 
    affectedParts: ["right-leg", "left-leg", "right-foot", "left-foot", "abdomen", "chest"] as BodyPart[],
    positions: ["Sprinter", "Distance Runner", "Jumper", "Thrower", "Hurdler"]
  },
  { 
    value: "swimming", 
    label: "Swimming", 
    affectedParts: ["right-shoulder", "left-shoulder", "right-arm", "left-arm", "right-leg", "left-leg", "chest", "abdomen"] as BodyPart[],
    positions: ["Freestyle", "Backstroke", "Breaststroke", "Butterfly", "Individual Medley"]
  },
  { 
    value: "cycling", 
    label: "Cycling", 
    affectedParts: ["right-leg", "left-leg", "right-foot", "left-foot", "abdomen", "neck"] as BodyPart[],
    positions: ["Road Cyclist", "Mountain Biker", "Track Cyclist"]
  },
  { 
    value: "martial-arts", 
    label: "Martial Arts", 
    affectedParts: ["right-hand", "left-hand", "right-arm", "left-arm", "right-leg", "left-leg", "right-foot", "left-foot", "head"] as BodyPart[],
    positions: ["Boxer", "MMA Fighter", "Kickboxer", "Judoka", "Wrestler"]
  },
] as const;

// ============================================================================
// EXERCISE DATABASE
// ============================================================================

export const EXERCISE_DATABASE = [
  // Upper Body - Chest
  { name: "Bench Press", category: "chest", affectedParts: ["chest", "right-shoulder", "left-shoulder", "right-arm", "left-arm"] as BodyPart[] },
  { name: "Incline Bench Press", category: "chest", affectedParts: ["chest", "right-shoulder", "left-shoulder", "right-arm", "left-arm"] as BodyPart[] },
  { name: "Push-ups", category: "chest", affectedParts: ["chest", "right-shoulder", "left-shoulder", "right-arm", "left-arm"] as BodyPart[] },
  { name: "Dumbbell Flyes", category: "chest", affectedParts: ["chest", "right-shoulder", "left-shoulder"] as BodyPart[] },
  { name: "Cable Crossover", category: "chest", affectedParts: ["chest", "right-shoulder", "left-shoulder"] as BodyPart[] },
  
  // Upper Body - Shoulders
  { name: "Overhead Press", category: "shoulders", affectedParts: ["right-shoulder", "left-shoulder", "right-arm", "left-arm", "neck"] as BodyPart[] },
  { name: "Lateral Raises", category: "shoulders", affectedParts: ["right-shoulder", "left-shoulder", "right-arm", "left-arm"] as BodyPart[] },
  { name: "Front Raises", category: "shoulders", affectedParts: ["right-shoulder", "left-shoulder", "right-arm", "left-arm"] as BodyPart[] },
  { name: "Rear Delt Flyes", category: "shoulders", affectedParts: ["right-shoulder", "left-shoulder"] as BodyPart[] },
  
  // Upper Body - Back
  { name: "Pull-ups", category: "back", affectedParts: ["right-shoulder", "left-shoulder", "right-arm", "left-arm"] as BodyPart[] },
  { name: "Deadlift", category: "back", affectedParts: ["abdomen", "right-leg", "left-leg", "right-shoulder", "left-shoulder"] as BodyPart[] },
  { name: "Barbell Rows", category: "back", affectedParts: ["right-shoulder", "left-shoulder", "right-arm", "left-arm", "abdomen"] as BodyPart[] },
  { name: "Lat Pulldowns", category: "back", affectedParts: ["right-shoulder", "left-shoulder", "right-arm", "left-arm"] as BodyPart[] },
  
  // Upper Body - Arms
  { name: "Bicep Curls", category: "arms", affectedParts: ["right-arm", "left-arm"] as BodyPart[] },
  { name: "Tricep Dips", category: "arms", affectedParts: ["right-arm", "left-arm", "right-shoulder", "left-shoulder"] as BodyPart[] },
  { name: "Hammer Curls", category: "arms", affectedParts: ["right-arm", "left-arm"] as BodyPart[] },
  { name: "Skull Crushers", category: "arms", affectedParts: ["right-arm", "left-arm"] as BodyPart[] },
  
  // Lower Body
  { name: "Squats", category: "legs", affectedParts: ["right-leg", "left-leg", "abdomen"] as BodyPart[] },
  { name: "Lunges", category: "legs", affectedParts: ["right-leg", "left-leg"] as BodyPart[] },
  { name: "Leg Press", category: "legs", affectedParts: ["right-leg", "left-leg"] as BodyPart[] },
  { name: "Leg Extensions", category: "legs", affectedParts: ["right-leg", "left-leg"] as BodyPart[] },
  { name: "Leg Curls", category: "legs", affectedParts: ["right-leg", "left-leg"] as BodyPart[] },
  { name: "Calf Raises", category: "legs", affectedParts: ["right-leg", "left-leg", "right-foot", "left-foot"] as BodyPart[] },
  { name: "Box Jumps", category: "legs", affectedParts: ["right-leg", "left-leg", "right-foot", "left-foot"] as BodyPart[] },
  
  // Core
  { name: "Plank", category: "core", affectedParts: ["abdomen"] as BodyPart[] },
  { name: "Crunches", category: "core", affectedParts: ["abdomen", "neck"] as BodyPart[] },
  { name: "Russian Twists", category: "core", affectedParts: ["abdomen"] as BodyPart[] },
  { name: "Hanging Leg Raises", category: "core", affectedParts: ["abdomen", "right-arm", "left-arm"] as BodyPart[] },
  
  // Cardio
  { name: "Running", category: "cardio", affectedParts: ["right-leg", "left-leg", "right-foot", "left-foot"] as BodyPart[] },
  { name: "Cycling", category: "cardio", affectedParts: ["right-leg", "left-leg"] as BodyPart[] },
  { name: "Rowing", category: "cardio", affectedParts: ["right-arm", "left-arm", "right-leg", "left-leg", "abdomen"] as BodyPart[] },
  { name: "Jump Rope", category: "cardio", affectedParts: ["right-leg", "left-leg", "right-foot", "left-foot", "right-arm", "left-arm"] as BodyPart[] },
] as const;

// ============================================================================
// EQUIPMENT
// ============================================================================

export const EQUIPMENT_OPTIONS = [
  { value: "barbell", label: "Barbell" },
  { value: "dumbbells", label: "Dumbbells" },
  { value: "kettlebells", label: "Kettlebells" },
  { value: "resistance-bands", label: "Resistance Bands" },
  { value: "cable-machine", label: "Cable Machine" },
  { value: "smith-machine", label: "Smith Machine" },
  { value: "bodyweight", label: "Bodyweight Only" },
  { value: "pull-up-bar", label: "Pull-up Bar" },
  { value: "dip-station", label: "Dip Station" },
  { value: "bench", label: "Bench" },
  { value: "squat-rack", label: "Squat Rack" },
  { value: "leg-press", label: "Leg Press Machine" },
  { value: "rowing-machine", label: "Rowing Machine" },
  { value: "treadmill", label: "Treadmill" },
  { value: "stationary-bike", label: "Stationary Bike" },
  { value: "elliptical", label: "Elliptical" },
  { value: "jump-rope", label: "Jump Rope" },
  { value: "medicine-ball", label: "Medicine Ball" },
  { value: "foam-roller", label: "Foam Roller" },
  { value: "yoga-mat", label: "Yoga Mat" },
] as const;

// ============================================================================
// INTENSITY LEVELS
// ============================================================================

export const INTENSITY_LEVELS = [
  { value: "very-light", label: "Very Light (40-50% max)", riskMultiplier: 0.3 },
  { value: "light", label: "Light (50-60% max)", riskMultiplier: 0.5 },
  { value: "moderate", label: "Moderate (60-70% max)", riskMultiplier: 1.0 },
  { value: "hard", label: "Hard (70-85% max)", riskMultiplier: 1.5 },
  { value: "very-hard", label: "Very Hard (85-95% max)", riskMultiplier: 2.0 },
  { value: "maximum", label: "Maximum (95-100% max)", riskMultiplier: 2.5 },
] as const;

// ============================================================================
// RECOVERY STATUS
// ============================================================================

export const RECOVERY_STATUS_OPTIONS = [
  { value: "excellent", label: "Excellent - Fully Recovered", riskReduction: 0.2 },
  { value: "good", label: "Good - Well Rested", riskReduction: 0.1 },
  { value: "normal", label: "Normal - Adequate Rest", riskReduction: 0 },
  { value: "mild-soreness", label: "Mild Soreness", riskIncrease: 0.1 },
  { value: "significant-fatigue", label: "Significant Fatigue", riskIncrease: 0.3 },
  { value: "concerning", label: "Concerning Symptoms", riskIncrease: 0.5 },
  { value: "injured", label: "Injured - Requires Rest", riskIncrease: 1.0 },
] as const;

// ============================================================================
// MATCH/GAME TYPES
// ============================================================================

export const MATCH_TYPE_OPTIONS = [
  { value: "competitive", label: "Competitive Match", riskMultiplier: 1.5 },
  { value: "tournament", label: "Tournament", riskMultiplier: 1.8 },
  { value: "playoff", label: "Playoff Game", riskMultiplier: 2.0 },
  { value: "friendly", label: "Friendly/Scrimmage", riskMultiplier: 0.8 },
  { value: "practice", label: "Practice Match", riskMultiplier: 0.6 },
  { value: "training", label: "Training Session", riskMultiplier: 0.5 },
] as const;

// ============================================================================
// SURFACE TYPES
// ============================================================================

export const SURFACE_TYPE_OPTIONS = [
  { value: "grass-natural", label: "Natural Grass", riskMultiplier: 1.0 },
  { value: "grass-artificial", label: "Artificial Turf", riskMultiplier: 1.2 },
  { value: "hardwood", label: "Hardwood Court", riskMultiplier: 1.1 },
  { value: "concrete", label: "Concrete", riskMultiplier: 1.4 },
  { value: "track", label: "Running Track", riskMultiplier: 0.9 },
  { value: "sand", label: "Sand", riskMultiplier: 0.8 },
  { value: "indoor-court", label: "Indoor Court", riskMultiplier: 1.0 },
  { value: "ice", label: "Ice", riskMultiplier: 1.3 },
] as const;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get affected body parts for a specific sport
 */
export function getAffectedBodyPartsForSport(sportValue: string): BodyPart[] {
  const sport = SPORT_OPTIONS.find(s => s.value === sportValue);
  return sport?.affectedParts || [];
}

/**
 * Get affected body parts for a specific workout type
 */
export function getAffectedBodyPartsForWorkout(workoutType: string): BodyPart[] {
  const workout = WORKOUT_TYPE_OPTIONS.find(w => w.value === workoutType);
  return workout?.affectedParts || [];
}

/**
 * Get affected body parts for specific exercises
 */
export function getAffectedBodyPartsForExercises(exerciseNames: string[]): BodyPart[] {
  const affectedParts = new Set<BodyPart>();
  
  exerciseNames.forEach(exerciseName => {
    const exercise = EXERCISE_DATABASE.find(e => e.name === exerciseName);
    if (exercise) {
      exercise.affectedParts.forEach(part => affectedParts.add(part));
    }
  });
  
  return Array.from(affectedParts);
}

/**
 * Get positions for a specific sport
 */
export function getPositionsForSport(sportValue: string): string[] {
  const sport = SPORT_OPTIONS.find(s => s.value === sportValue);
  return sport?.positions || [];
}

/**
 * Calculate injury risk based on various factors
 */
export function calculateInjuryRisk(params: {
  intensity: string;
  duration: number;
  recoveryStatus: string;
  surfaceType?: string;
  matchType?: string;
}): number {
  const intensityData = INTENSITY_LEVELS.find(i => i.value === params.intensity);
  const recoveryData = RECOVERY_STATUS_OPTIONS.find(r => r.value === params.recoveryStatus);
  const surfaceData = params.surfaceType 
    ? SURFACE_TYPE_OPTIONS.find(s => s.value === params.surfaceType)
    : null;
  const matchData = params.matchType
    ? MATCH_TYPE_OPTIONS.find(m => m.value === params.matchType)
    : null;

  let baseRisk = 20; // Base risk percentage
  
  // Apply intensity multiplier
  if (intensityData) {
    baseRisk *= intensityData.riskMultiplier;
  }
  
  // Apply duration factor (longer duration = higher risk)
  const durationFactor = Math.min(params.duration / 60, 2); // Cap at 2x for 60+ minutes
  baseRisk *= (0.5 + (durationFactor * 0.5));
  
  // Apply recovery adjustments
  if (recoveryData) {
    if (recoveryData.riskReduction) {
      baseRisk *= (1 - recoveryData.riskReduction);
    }
    if (recoveryData.riskIncrease) {
      baseRisk *= (1 + recoveryData.riskIncrease);
    }
  }
  
  // Apply surface multiplier
  if (surfaceData) {
    baseRisk *= surfaceData.riskMultiplier;
  }
  
  // Apply match type multiplier
  if (matchData) {
    baseRisk *= matchData.riskMultiplier;
  }
  
  // Ensure result is between 0 and 100
  return Math.min(Math.max(Math.round(baseRisk), 0), 100);
}









