/**
 * Body Part Mapping Service
 * Comprehensive mapping of exercises and sports to affected body parts
 * Used for injury prediction and workload tracking
 */

// ============================================
// COMPREHENSIVE EXERCISE MAPPING
// ============================================

const EXERCISE_BODY_PART_MAP = {
  // ===== CHEST EXERCISES =====
  'Bench Press': ['chest', 'right-shoulder', 'left-shoulder', 'right-arm', 'left-arm'],
  'Incline Bench Press': ['chest', 'right-shoulder', 'left-shoulder', 'right-arm', 'left-arm'],
  'Decline Bench Press': ['chest', 'right-shoulder', 'left-shoulder', 'right-arm', 'left-arm'],
  'Dumbbell Bench Press': ['chest', 'right-shoulder', 'left-shoulder', 'right-arm', 'left-arm'],
  'Push-ups': ['chest', 'right-shoulder', 'left-shoulder', 'right-arm', 'left-arm', 'abdomen'],
  'Dumbbell Flyes': ['chest', 'right-shoulder', 'left-shoulder'],
  'Cable Crossover': ['chest', 'right-shoulder', 'left-shoulder'],
  'Chest Dips': ['chest', 'right-shoulder', 'left-shoulder', 'right-arm', 'left-arm'],
  'Pec Deck Machine': ['chest', 'right-shoulder', 'left-shoulder'],
  
  // ===== SHOULDER EXERCISES =====
  'Overhead Press': ['right-shoulder', 'left-shoulder', 'right-arm', 'left-arm', 'neck', 'abdomen'],
  'Military Press': ['right-shoulder', 'left-shoulder', 'right-arm', 'left-arm', 'abdomen'],
  'Dumbbell Shoulder Press': ['right-shoulder', 'left-shoulder', 'right-arm', 'left-arm'],
  'Arnold Press': ['right-shoulder', 'left-shoulder', 'right-arm', 'left-arm'],
  'Lateral Raises': ['right-shoulder', 'left-shoulder', 'right-arm', 'left-arm'],
  'Front Raises': ['right-shoulder', 'left-shoulder', 'right-arm', 'left-arm'],
  'Rear Delt Flyes': ['right-shoulder', 'left-shoulder'],
  'Face Pulls': ['right-shoulder', 'left-shoulder', 'neck'],
  'Upright Rows': ['right-shoulder', 'left-shoulder', 'right-arm', 'left-arm'],
  'Shrugs': ['neck', 'right-shoulder', 'left-shoulder'],
  
  // ===== BACK EXERCISES =====
  'Pull-ups': ['right-shoulder', 'left-shoulder', 'right-arm', 'left-arm', 'abdomen'],
  'Chin-ups': ['right-shoulder', 'left-shoulder', 'right-arm', 'left-arm', 'abdomen'],
  'Deadlift': ['abdomen', 'right-leg', 'left-leg', 'right-shoulder', 'left-shoulder', 'neck'],
  'Romanian Deadlift': ['right-leg', 'left-leg', 'abdomen', 'right-shoulder', 'left-shoulder'],
  'Barbell Rows': ['right-shoulder', 'left-shoulder', 'right-arm', 'left-arm', 'abdomen'],
  'Dumbbell Rows': ['right-shoulder', 'left-shoulder', 'right-arm', 'left-arm', 'abdomen'],
  'Lat Pulldowns': ['right-shoulder', 'left-shoulder', 'right-arm', 'left-arm'],
  'Seated Cable Rows': ['right-shoulder', 'left-shoulder', 'right-arm', 'left-arm', 'abdomen'],
  'T-Bar Rows': ['right-shoulder', 'left-shoulder', 'right-arm', 'left-arm', 'abdomen'],
  'Single-Arm Dumbbell Rows': ['right-shoulder', 'left-shoulder', 'right-arm', 'left-arm', 'abdomen'],
  
  // ===== ARM EXERCISES =====
  'Bicep Curls': ['right-arm', 'left-arm'],
  'Barbell Curls': ['right-arm', 'left-arm'],
  'Hammer Curls': ['right-arm', 'left-arm'],
  'Preacher Curls': ['right-arm', 'left-arm'],
  'Concentration Curls': ['right-arm', 'left-arm'],
  'Cable Curls': ['right-arm', 'left-arm'],
  'Tricep Dips': ['right-arm', 'left-arm', 'right-shoulder', 'left-shoulder', 'chest'],
  'Tricep Pushdowns': ['right-arm', 'left-arm'],
  'Overhead Tricep Extension': ['right-arm', 'left-arm', 'right-shoulder', 'left-shoulder'],
  'Skull Crushers': ['right-arm', 'left-arm'],
  'Close-Grip Bench Press': ['right-arm', 'left-arm', 'chest', 'right-shoulder', 'left-shoulder'],
  'Wrist Curls': ['right-hand', 'left-hand', 'right-arm', 'left-arm'],
  
  // ===== LEG EXERCISES =====
  'Squats': ['right-leg', 'left-leg', 'abdomen', 'right-foot', 'left-foot'],
  'Front Squats': ['right-leg', 'left-leg', 'abdomen', 'chest'],
  'Back Squats': ['right-leg', 'left-leg', 'abdomen', 'right-shoulder', 'left-shoulder'],
  'Bulgarian Split Squats': ['right-leg', 'left-leg', 'abdomen'],
  'Lunges': ['right-leg', 'left-leg', 'abdomen'],
  'Walking Lunges': ['right-leg', 'left-leg', 'abdomen'],
  'Reverse Lunges': ['right-leg', 'left-leg', 'abdomen'],
  'Leg Press': ['right-leg', 'left-leg'],
  'Leg Extensions': ['right-leg', 'left-leg'],
  'Leg Curls': ['right-leg', 'left-leg'],
  'Hamstring Curls': ['right-leg', 'left-leg'],
  'Calf Raises': ['right-leg', 'left-leg', 'right-foot', 'left-foot'],
  'Standing Calf Raises': ['right-leg', 'left-leg', 'right-foot', 'left-foot'],
  'Seated Calf Raises': ['right-leg', 'left-leg', 'right-foot', 'left-foot'],
  'Step-ups': ['right-leg', 'left-leg', 'right-foot', 'left-foot', 'abdomen'],
  'Box Jumps': ['right-leg', 'left-leg', 'right-foot', 'left-foot', 'abdomen'],
  'Jump Squats': ['right-leg', 'left-leg', 'right-foot', 'left-foot', 'abdomen'],
  'Hip Thrusts': ['abdomen', 'right-leg', 'left-leg'],
  'Glute Bridges': ['abdomen', 'right-leg', 'left-leg'],
  
  // ===== CORE/ABDOMINAL EXERCISES =====
  'Plank': ['abdomen', 'right-shoulder', 'left-shoulder'],
  'Side Plank': ['abdomen', 'right-shoulder', 'left-shoulder'],
  'Crunches': ['abdomen', 'neck'],
  'Sit-ups': ['abdomen', 'neck', 'right-leg', 'left-leg'],
  'Russian Twists': ['abdomen'],
  'Bicycle Crunches': ['abdomen', 'right-leg', 'left-leg'],
  'Hanging Leg Raises': ['abdomen', 'right-arm', 'left-arm', 'right-shoulder', 'left-shoulder'],
  'Ab Wheel Rollouts': ['abdomen', 'right-shoulder', 'left-shoulder', 'right-arm', 'left-arm'],
  'Mountain Climbers': ['abdomen', 'right-leg', 'left-leg', 'right-shoulder', 'left-shoulder'],
  'V-ups': ['abdomen', 'right-leg', 'left-leg'],
  'Leg Raises': ['abdomen', 'right-leg', 'left-leg'],
  'Cable Crunches': ['abdomen'],
  'Woodchoppers': ['abdomen', 'right-shoulder', 'left-shoulder'],
  
  // ===== OLYMPIC LIFTS =====
  'Clean and Jerk': ['right-leg', 'left-leg', 'right-shoulder', 'left-shoulder', 'right-arm', 'left-arm', 'abdomen', 'neck'],
  'Snatch': ['right-leg', 'left-leg', 'right-shoulder', 'left-shoulder', 'right-arm', 'left-arm', 'abdomen', 'neck'],
  'Power Clean': ['right-leg', 'left-leg', 'right-shoulder', 'left-shoulder', 'right-arm', 'left-arm', 'abdomen'],
  'Hang Clean': ['right-leg', 'left-leg', 'right-shoulder', 'left-shoulder', 'right-arm', 'left-arm', 'abdomen'],
  
  // ===== CARDIO/CONDITIONING =====
  'Running': ['right-leg', 'left-leg', 'right-foot', 'left-foot', 'abdomen'],
  'Sprinting': ['right-leg', 'left-leg', 'right-foot', 'left-foot', 'abdomen'],
  'Jogging': ['right-leg', 'left-leg', 'right-foot', 'left-foot'],
  'Treadmill': ['right-leg', 'left-leg', 'right-foot', 'left-foot'],
  'Cycling': ['right-leg', 'left-leg', 'right-foot', 'left-foot'],
  'Stationary Bike': ['right-leg', 'left-leg'],
  'Elliptical': ['right-leg', 'left-leg', 'right-arm', 'left-arm'],
  'Rowing': ['right-arm', 'left-arm', 'right-leg', 'left-leg', 'abdomen', 'right-shoulder', 'left-shoulder'],
  'Jump Rope': ['right-leg', 'left-leg', 'right-foot', 'left-foot', 'right-arm', 'left-arm', 'right-shoulder', 'left-shoulder'],
  'Stair Climber': ['right-leg', 'left-leg', 'right-foot', 'left-foot', 'abdomen'],
  'Battle Ropes': ['right-arm', 'left-arm', 'right-shoulder', 'left-shoulder', 'abdomen', 'chest'],
  
  // ===== FUNCTIONAL/CROSSFIT =====
  'Burpees': ['right-leg', 'left-leg', 'right-arm', 'left-arm', 'chest', 'abdomen', 'right-shoulder', 'left-shoulder'],
  'Wall Balls': ['right-leg', 'left-leg', 'right-shoulder', 'left-shoulder', 'right-arm', 'left-arm', 'abdomen'],
  'Kettlebell Swings': ['right-leg', 'left-leg', 'right-shoulder', 'left-shoulder', 'abdomen', 'right-hand', 'left-hand'],
  'Turkish Get-ups': ['abdomen', 'right-shoulder', 'left-shoulder', 'right-leg', 'left-leg', 'right-arm', 'left-arm'],
  'Farmers Walk': ['right-hand', 'left-hand', 'right-arm', 'left-arm', 'right-shoulder', 'left-shoulder', 'abdomen', 'right-leg', 'left-leg'],
  'Sled Push': ['right-leg', 'left-leg', 'right-shoulder', 'left-shoulder', 'chest', 'abdomen'],
  'Sled Pull': ['right-leg', 'left-leg', 'right-arm', 'left-arm', 'right-shoulder', 'left-shoulder', 'abdomen'],
  'Box Step-ups': ['right-leg', 'left-leg', 'right-foot', 'left-foot', 'abdomen'],
  'Medicine Ball Slams': ['right-arm', 'left-arm', 'right-shoulder', 'left-shoulder', 'abdomen', 'chest'],
};

// ============================================
// COMPREHENSIVE SPORT MAPPING
// ============================================

const SPORT_BODY_PART_MAP = {
  // ===== TEAM SPORTS =====
  'Basketball': ['right-leg', 'left-leg', 'right-foot', 'left-foot', 'right-shoulder', 'left-shoulder', 'right-arm', 'left-arm', 'right-hand', 'left-hand', 'abdomen'],
  'Soccer': ['right-leg', 'left-leg', 'right-foot', 'left-foot', 'abdomen', 'chest', 'head'],
  'Football': ['head', 'neck', 'right-shoulder', 'left-shoulder', 'right-leg', 'left-leg', 'chest', 'abdomen', 'right-arm', 'left-arm'],
  'American Football': ['head', 'neck', 'right-shoulder', 'left-shoulder', 'right-leg', 'left-leg', 'chest', 'abdomen', 'right-arm', 'left-arm'],
  'Rugby': ['head', 'neck', 'right-shoulder', 'left-shoulder', 'chest', 'abdomen', 'right-leg', 'left-leg', 'right-arm', 'left-arm'],
  'Hockey': ['right-leg', 'left-leg', 'right-shoulder', 'left-shoulder', 'right-arm', 'left-arm', 'chest', 'abdomen'],
  'Ice Hockey': ['right-leg', 'left-leg', 'right-shoulder', 'left-shoulder', 'right-arm', 'left-arm', 'chest', 'abdomen', 'head'],
  'Field Hockey': ['right-leg', 'left-leg', 'right-shoulder', 'left-shoulder', 'right-arm', 'left-arm', 'abdomen'],
  'Volleyball': ['right-shoulder', 'left-shoulder', 'right-arm', 'left-arm', 'right-hand', 'left-hand', 'right-leg', 'left-leg', 'right-foot', 'left-foot', 'abdomen'],
  'Baseball': ['right-shoulder', 'left-shoulder', 'right-arm', 'left-arm', 'right-leg', 'left-leg', 'right-hand', 'left-hand', 'abdomen'],
  'Softball': ['right-shoulder', 'left-shoulder', 'right-arm', 'left-arm', 'right-leg', 'left-leg', 'right-hand', 'left-hand'],
  'Cricket': ['right-shoulder', 'left-shoulder', 'right-arm', 'left-arm', 'right-leg', 'left-leg', 'right-hand', 'left-hand', 'abdomen'],
  
  // ===== RACQUET SPORTS =====
  'Tennis': ['right-shoulder', 'left-shoulder', 'right-arm', 'left-arm', 'right-hand', 'left-hand', 'right-leg', 'left-leg', 'right-foot', 'left-foot', 'abdomen'],
  'Badminton': ['right-shoulder', 'left-shoulder', 'right-arm', 'left-arm', 'right-hand', 'left-hand', 'right-leg', 'left-leg'],
  'Squash': ['right-shoulder', 'left-shoulder', 'right-arm', 'left-arm', 'right-leg', 'left-leg', 'abdomen'],
  'Racquetball': ['right-shoulder', 'left-shoulder', 'right-arm', 'left-arm', 'right-leg', 'left-leg'],
  'Table Tennis': ['right-shoulder', 'left-shoulder', 'right-arm', 'left-arm', 'right-hand', 'left-hand', 'right-leg', 'left-leg'],
  
  // ===== INDIVIDUAL SPORTS =====
  'Track and Field': ['right-leg', 'left-leg', 'right-foot', 'left-foot', 'abdomen', 'chest'],
  'Marathon': ['right-leg', 'left-leg', 'right-foot', 'left-foot', 'abdomen'],
  'Swimming': ['right-shoulder', 'left-shoulder', 'right-arm', 'left-arm', 'right-leg', 'left-leg', 'chest', 'abdomen', 'neck'],
  'Diving': ['right-shoulder', 'left-shoulder', 'right-arm', 'left-arm', 'right-leg', 'left-leg', 'abdomen', 'neck'],
  'Cycling': ['right-leg', 'left-leg', 'right-foot', 'left-foot', 'abdomen', 'neck', 'right-shoulder', 'left-shoulder'],
  'Mountain Biking': ['right-leg', 'left-leg', 'right-arm', 'left-arm', 'right-shoulder', 'left-shoulder', 'abdomen'],
  'Triathlon': ['right-leg', 'left-leg', 'right-arm', 'left-arm', 'right-shoulder', 'left-shoulder', 'chest', 'abdomen'],
  'Rowing': ['right-arm', 'left-arm', 'right-leg', 'left-leg', 'abdomen', 'right-shoulder', 'left-shoulder', 'chest'],
  'CrossFit': ['right-leg', 'left-leg', 'right-arm', 'left-arm', 'right-shoulder', 'left-shoulder', 'chest', 'abdomen'],
  
  // ===== COMBAT SPORTS =====
  'Boxing': ['right-hand', 'left-hand', 'right-arm', 'left-arm', 'right-shoulder', 'left-shoulder', 'right-leg', 'left-leg', 'abdomen', 'neck', 'head'],
  'MMA': ['right-hand', 'left-hand', 'right-arm', 'left-arm', 'right-leg', 'left-leg', 'right-foot', 'left-foot', 'head', 'neck', 'chest', 'abdomen'],
  'Kickboxing': ['right-hand', 'left-hand', 'right-arm', 'left-arm', 'right-leg', 'left-leg', 'right-foot', 'left-foot', 'abdomen'],
  'Muay Thai': ['right-hand', 'left-hand', 'right-arm', 'left-arm', 'right-leg', 'left-leg', 'right-foot', 'left-foot', 'right-shoulder', 'left-shoulder'],
  'Karate': ['right-hand', 'left-hand', 'right-arm', 'left-arm', 'right-leg', 'left-leg', 'right-foot', 'left-foot'],
  'Taekwondo': ['right-leg', 'left-leg', 'right-foot', 'left-foot', 'right-hand', 'left-hand', 'right-arm', 'left-arm'],
  'Judo': ['right-arm', 'left-arm', 'right-shoulder', 'left-shoulder', 'right-leg', 'left-leg', 'neck', 'abdomen'],
  'Brazilian Jiu-Jitsu': ['right-arm', 'left-arm', 'right-leg', 'left-leg', 'neck', 'abdomen', 'right-shoulder', 'left-shoulder'],
  'Wrestling': ['head', 'neck', 'right-arm', 'left-arm', 'right-leg', 'left-leg', 'right-shoulder', 'left-shoulder', 'abdomen'],
  
  // ===== WINTER SPORTS =====
  'Skiing': ['right-leg', 'left-leg', 'right-foot', 'left-foot', 'abdomen', 'right-arm', 'left-arm'],
  'Snowboarding': ['right-leg', 'left-leg', 'right-foot', 'left-foot', 'abdomen', 'right-arm', 'left-arm', 'right-shoulder', 'left-shoulder'],
  'Ice Skating': ['right-leg', 'left-leg', 'right-foot', 'left-foot', 'abdomen'],
  'Figure Skating': ['right-leg', 'left-leg', 'right-foot', 'left-foot', 'abdomen', 'right-arm', 'left-arm'],
  
  // ===== OTHER SPORTS =====
  'Golf': ['right-shoulder', 'left-shoulder', 'right-arm', 'left-arm', 'abdomen', 'right-leg', 'left-leg'],
  'Rock Climbing': ['right-arm', 'left-arm', 'right-hand', 'left-hand', 'right-leg', 'left-leg', 'right-foot', 'left-foot', 'right-shoulder', 'left-shoulder', 'abdomen'],
  'Gymnastics': ['right-arm', 'left-arm', 'right-leg', 'left-leg', 'right-shoulder', 'left-shoulder', 'abdomen', 'right-hand', 'left-hand'],
  'Lacrosse': ['right-arm', 'left-arm', 'right-shoulder', 'left-shoulder', 'right-leg', 'left-leg', 'abdomen', 'chest'],
  'Surfing': ['right-arm', 'left-arm', 'right-shoulder', 'left-shoulder', 'abdomen', 'right-leg', 'left-leg', 'chest'],
  'Skateboarding': ['right-leg', 'left-leg', 'right-foot', 'left-foot', 'abdomen', 'right-arm', 'left-arm'],
  'Ultimate Frisbee': ['right-arm', 'left-arm', 'right-shoulder', 'left-shoulder', 'right-leg', 'left-leg', 'abdomen'],
};

// ============================================
// WORKOUT TYPE MAPPING
// ============================================

const WORKOUT_TYPE_BODY_PART_MAP = {
  'Strength': ['right-arm', 'left-arm', 'chest', 'abdomen', 'right-leg', 'left-leg', 'right-shoulder', 'left-shoulder'],
  'Cardio': ['right-leg', 'left-leg', 'chest', 'abdomen', 'right-foot', 'left-foot'],
  'HIIT': ['right-leg', 'left-leg', 'right-arm', 'left-arm', 'chest', 'abdomen', 'right-shoulder', 'left-shoulder'],
  'Flexibility': ['neck', 'right-shoulder', 'left-shoulder', 'abdomen', 'right-leg', 'left-leg'],
  'Yoga': ['neck', 'right-shoulder', 'left-shoulder', 'abdomen', 'right-leg', 'left-leg', 'right-arm', 'left-arm'],
  'Pilates': ['abdomen', 'right-shoulder', 'left-shoulder', 'right-leg', 'left-leg'],
  'Plyometrics': ['right-leg', 'left-leg', 'right-foot', 'left-foot', 'abdomen'],
  'Endurance': ['right-leg', 'left-leg', 'chest', 'abdomen', 'right-foot', 'left-foot'],
  'Powerlifting': ['right-leg', 'left-leg', 'chest', 'right-shoulder', 'left-shoulder', 'right-arm', 'left-arm', 'abdomen'],
  'Bodybuilding': ['chest', 'right-shoulder', 'left-shoulder', 'right-arm', 'left-arm', 'right-leg', 'left-leg', 'abdomen'],
  'Calisthenics': ['right-arm', 'left-arm', 'chest', 'abdomen', 'right-shoulder', 'left-shoulder'],
  'Circuit Training': ['right-leg', 'left-leg', 'right-arm', 'left-arm', 'chest', 'abdomen', 'right-shoulder', 'left-shoulder'],
};

// ============================================
// POSITION-SPECIFIC MAPPINGS
// ============================================

const POSITION_SPECIFIC_BODY_PARTS = {
  // American Football
  'Quarterback': ['right-shoulder', 'right-arm', 'right-hand', 'left-leg', 'right-leg', 'abdomen'],
  'Running Back': ['right-leg', 'left-leg', 'right-shoulder', 'left-shoulder', 'abdomen', 'chest'],
  'Wide Receiver': ['right-leg', 'left-leg', 'right-hand', 'left-hand', 'right-shoulder', 'left-shoulder'],
  'Linebacker': ['head', 'neck', 'right-shoulder', 'left-shoulder', 'chest', 'right-leg', 'left-leg'],
  'Defensive Back': ['right-leg', 'left-leg', 'right-shoulder', 'left-shoulder', 'head', 'neck'],
  'Offensive Line': ['head', 'neck', 'right-shoulder', 'left-shoulder', 'right-leg', 'left-leg', 'abdomen', 'chest'],
  'Defensive Line': ['head', 'neck', 'right-shoulder', 'left-shoulder', 'right-arm', 'left-arm', 'chest'],
  'Tight End': ['right-shoulder', 'left-shoulder', 'right-leg', 'left-leg', 'chest', 'right-hand', 'left-hand'],
  'Kicker': ['right-leg', 'right-foot', 'left-leg', 'abdomen'],
  
  // Basketball
  'Point Guard': ['right-leg', 'left-leg', 'right-foot', 'left-foot', 'right-hand', 'left-hand', 'right-shoulder', 'left-shoulder'],
  'Shooting Guard': ['right-leg', 'left-leg', 'right-shoulder', 'right-arm', 'right-hand', 'left-hand'],
  'Small Forward': ['right-leg', 'left-leg', 'right-shoulder', 'left-shoulder', 'right-arm', 'left-arm', 'abdomen'],
  'Power Forward': ['right-leg', 'left-leg', 'right-shoulder', 'left-shoulder', 'chest', 'abdomen'],
  'Center': ['right-leg', 'left-leg', 'right-shoulder', 'left-shoulder', 'chest', 'abdomen', 'right-arm', 'left-arm'],
  
  // Soccer
  'Goalkeeper': ['right-hand', 'left-hand', 'right-arm', 'left-arm', 'right-leg', 'left-leg', 'right-shoulder', 'left-shoulder'],
  'Defender': ['right-leg', 'left-leg', 'head', 'chest', 'abdomen'],
  'Midfielder': ['right-leg', 'left-leg', 'right-foot', 'left-foot', 'abdomen', 'chest'],
  'Forward': ['right-leg', 'left-leg', 'right-foot', 'left-foot', 'head', 'abdomen'],
  'Striker': ['right-leg', 'left-leg', 'right-foot', 'left-foot', 'head'],
  
  // Baseball
  'Pitcher': ['right-shoulder', 'right-arm', 'right-hand', 'abdomen', 'right-leg', 'left-leg'],
  'Catcher': ['right-leg', 'left-leg', 'right-hand', 'left-hand', 'right-shoulder', 'abdomen'],
  'Infielder': ['right-leg', 'left-leg', 'right-arm', 'left-arm', 'right-hand', 'left-hand'],
  'Outfielder': ['right-leg', 'left-leg', 'right-arm', 'right-shoulder', 'right-hand'],
  
  // Tennis
  'Singles Player': ['right-shoulder', 'right-arm', 'right-hand', 'right-leg', 'left-leg', 'abdomen'],
  'Doubles Player': ['right-shoulder', 'right-arm', 'right-hand', 'right-leg', 'left-leg'],
};

/**
 * Get affected body parts from activity data
 * Enhanced with position-specific and intensity-based detection
 */
function getAffectedBodyParts(activityData) {
  const bodyParts = new Set();

  // ===== WORKOUT ACTIVITIES =====
  if (activityData.activity_type === 'workout') {
    // Add body parts from specific exercises first (more precise)
    if (activityData.exercises && Array.isArray(activityData.exercises)) {
      activityData.exercises.forEach(exercise => {
        const exerciseParts = EXERCISE_BODY_PART_MAP[exercise.exercise] || [];
        exerciseParts.forEach(part => bodyParts.add(part));
      });
    }

    // If no exercises specified, use workout type as fallback
    if (bodyParts.size === 0 && activityData.workout_type) {
      const workoutParts = WORKOUT_TYPE_BODY_PART_MAP[activityData.workout_type] || [];
      workoutParts.forEach(part => bodyParts.add(part));
    }
  }

  // ===== SPORTS ACTIVITIES =====
  if (activityData.activity_type === 'sports' && activityData.sport) {
    // Check for position-specific mapping first
    if (activityData.position && POSITION_SPECIFIC_BODY_PARTS[activityData.position]) {
      const positionParts = POSITION_SPECIFIC_BODY_PARTS[activityData.position];
      positionParts.forEach(part => bodyParts.add(part));
    } else {
      // Use general sport mapping
      const sportParts = SPORT_BODY_PART_MAP[activityData.sport] || [];
      sportParts.forEach(part => bodyParts.add(part));
    }
  }

  // If still no body parts detected, return a default set based on activity type
  if (bodyParts.size === 0) {
    console.warn('[Body Part Mapping] No specific body parts detected, using defaults');
    const defaultParts = ['abdomen', 'chest', 'right-leg', 'left-leg'];
    defaultParts.forEach(part => bodyParts.add(part));
  }

  return Array.from(bodyParts);
}

/**
 * Get intensity multiplier for specific body part in an activity
 * Some body parts are more stressed than others in certain activities
 */
function getBodyPartIntensityMultiplier(bodyPart, activityData) {
  // Default multiplier
  let multiplier = 1.0;

  // Position-specific intensity adjustments
  if (activityData.position === 'Pitcher' && bodyPart === 'right-shoulder') {
    multiplier = 1.8; // Pitchers stress their throwing shoulder heavily
  } else if (activityData.position === 'Quarterback' && bodyPart === 'right-shoulder') {
    multiplier = 1.6;
  } else if (activityData.position === 'Goalkeeper' && (bodyPart === 'right-hand' || bodyPart === 'left-hand')) {
    multiplier = 1.5;
  } else if (activityData.position === 'Kicker' && bodyPart === 'right-leg') {
    multiplier = 1.7;
  }

  // Sport-specific adjustments
  if (activityData.sport === 'Boxing' && (bodyPart === 'right-shoulder' || bodyPart === 'left-shoulder')) {
    multiplier = 1.5;
  } else if (activityData.sport === 'Soccer' && (bodyPart === 'right-leg' || bodyPart === 'left-leg')) {
    multiplier = 1.4;
  } else if (activityData.sport === 'Swimming' && (bodyPart === 'right-shoulder' || bodyPart === 'left-shoulder')) {
    multiplier = 1.5;
  }

  // Exercise-specific adjustments
  if (activityData.exercises && Array.isArray(activityData.exercises)) {
    activityData.exercises.forEach(exercise => {
      if (exercise.exercise === 'Deadlift' && (bodyPart === 'abdomen' || bodyPart.includes('leg'))) {
        multiplier = Math.max(multiplier, 1.6);
      } else if (exercise.exercise === 'Bench Press' && bodyPart === 'chest') {
        multiplier = Math.max(multiplier, 1.5);
      } else if (exercise.exercise.includes('Squat') && bodyPart.includes('leg')) {
        multiplier = Math.max(multiplier, 1.5);
      }
    });
  }

  return multiplier;
}

/**
 * Normalize sport name (handle case sensitivity and variations)
 */
function normalizeSportName(sport) {
  if (!sport) return null;
  
  const sportLower = sport.toLowerCase().trim();
  const sportMap = {
    'basketball': 'Basketball',
    'soccer': 'Soccer',
    'football': 'Football',
    'american football': 'American Football',
    'rugby': 'Rugby',
    'hockey': 'Hockey',
    'ice hockey': 'Ice Hockey',
    'field hockey': 'Field Hockey',
    'volleyball': 'Volleyball',
    'baseball': 'Baseball',
    'softball': 'Softball',
    'tennis': 'Tennis',
    'badminton': 'Badminton',
    'boxing': 'Boxing',
    'mma': 'MMA',
    'swimming': 'Swimming',
    'cycling': 'Cycling',
    'running': 'Track and Field',
    'wrestling': 'Wrestling',
    'martial arts': 'MMA',
    'martial-arts': 'MMA',
    'track and field': 'Track and Field',
    'track & field': 'Track and Field',
  };

  return sportMap[sportLower] || sport;
}

/**
 * Normalize exercise name
 */
function normalizeExerciseName(exercise) {
  if (!exercise) return null;
  
  // Handle common variations
  const exerciseLower = exercise.toLowerCase().trim();
  const exerciseMap = {
    'bench': 'Bench Press',
    'squat': 'Squats',
    'deadlift': 'Deadlift',
    'pullup': 'Pull-ups',
    'pull up': 'Pull-ups',
    'pushup': 'Push-ups',
    'push up': 'Push-ups',
    'bicep curl': 'Bicep Curls',
    'tricep dip': 'Tricep Dips',
    'plank': 'Plank',
    'running': 'Running',
    'cycling': 'Cycling',
    'swimming': 'Swimming',
  };

  return exerciseMap[exerciseLower] || exercise;
}

module.exports = {
  EXERCISE_BODY_PART_MAP,
  SPORT_BODY_PART_MAP,
  WORKOUT_TYPE_BODY_PART_MAP,
  POSITION_SPECIFIC_BODY_PARTS,
  getAffectedBodyParts,
  getBodyPartIntensityMultiplier,
  normalizeSportName,
  normalizeExerciseName,
};

