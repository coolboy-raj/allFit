/**
 * Football Legends Synthetic Data Seeding Script
 * ==========================================
 * 
 * Generates performance entries over the last 7 days for 5 football legends.
 * Seeds data through backend API routes for proper metric calculation.
 * 
 * This script will:
 * 1. Delete existing athletes and activities for the specified user
 * 2. Create 5 Football Legend players via API
 * 3. Generate and log activities per player (workouts + matches)
 * 4. Backend automatically calculates:
 *    - Body part workloads from exercises
 *    - Injury risk from activity patterns
 *    - Recovery metrics
 * 
 * PREREQUISITES:
 * - Backend server MUST be running (npm run dev in backend/)
 * - .env file configured with SUPABASE credentials
 * 
 * Run with: node seed-legends-data.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Check if fetch is available (Node 18+) or use node-fetch
const fetch = global.fetch || require('node-fetch');

// Initialize Supabase (only for direct athlete creation via API)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Backend API URL
const API_URL = process.env.API_URL || 'http://localhost:5000';

// User ID to seed data for
const USER_ID = '116314034983489808207';

// Football Legends Squad
const LEGENDS_SQUAD = [
  { name: 'Lionel Messi', age: 36, position: 'Forward', height: '170cm', weight: '72kg', number: 10 },
  { name: 'Cristiano Ronaldo', age: 39, position: 'Striker', height: '187cm', weight: '83kg', number: 7 },
  { name: 'Zinedine Zidane', age: 51, position: 'Attacking Midfield', height: '185cm', weight: '77kg', number: 5 },
  { name: 'Ronaldinho', age: 43, position: 'Attacking Midfield', height: '181cm', weight: '80kg', number: 10 },
  { name: 'Johan Cruyff', age: 68, position: 'Forward', height: '180cm', weight: '75kg', number: 14 },
  { name: 'Pelé', age: 82, position: 'Forward', height: '173cm', weight: '73kg', number: 10 },
  { name: 'Diego Maradona', age: 60, position: 'Attacking Midfield', height: '165cm', weight: '70kg', number: 10 },
  { name: 'Ronaldo Nazário', age: 46, position: 'Striker', height: '183cm', weight: '90kg', number: 9 },
  { name: 'Paolo Maldini', age: 54, position: 'Defender', height: '186cm', weight: '85kg', number: 3 },
  { name: 'Franz Beckenbauer', age: 77, position: 'Defender', height: '181cm', weight: '76kg', number: 5 },
  { name: 'Andrés Iniesta', age: 39, position: 'Attacking Midfield', height: '171cm', weight: '68kg', number: 8, training_intensity: 'light' },
  { name: 'Xavi Hernández', age: 44, position: 'Attacking Midfield', height: '170cm', weight: '68kg', number: 6, training_intensity: 'light' },
  { name: 'Thierry Henry', age: 46, position: 'Striker', height: '188cm', weight: '83kg', number: 14, training_intensity: 'light' },
  { name: 'Kaká', age: 41, position: 'Attacking Midfield', height: '186cm', weight: '82kg', number: 22, training_intensity: 'light' },
  { name: 'Gerd Müller', age: 75, position: 'Striker', height: '176cm', weight: '76kg', number: 13, training_intensity: 'light' },
];

// Body parts affected by position
const POSITION_BODY_PARTS = {
  'Goalkeeper': ['right-hand', 'left-hand', 'right-leg', 'left-leg', 'abdomen'],
  'Center Back': ['right-leg', 'left-leg', 'head', 'chest', 'abdomen'],
  'Right Back': ['right-leg', 'left-leg', 'right-shoulder', 'abdomen'],
  'Left Back': ['right-leg', 'left-leg', 'left-shoulder', 'abdomen'],
  'Defender': ['right-leg', 'left-leg', 'chest', 'abdomen'],
  'Defensive Midfield': ['right-leg', 'left-leg', 'abdomen', 'chest'],
  'Attacking Midfield': ['right-leg', 'left-leg', 'abdomen', 'right-arm'],
  'Right Winger': ['right-leg', 'left-leg', 'right-arm', 'abdomen'],
  'Left Winger': ['right-leg', 'left-leg', 'left-arm', 'abdomen'],
  'Striker': ['right-leg', 'left-leg', 'head', 'abdomen'],
  'Forward': ['right-leg', 'left-leg', 'head', 'abdomen'],
  'Winger': ['right-leg', 'left-leg', 'abdomen'],
};

// Injury types by body part
const INJURY_TYPES = {
  'head': ['concussion', 'cut'],
  'neck': ['strain', 'sprain'],
  'right-leg': ['hamstring strain', 'quad strain', 'muscle tear', 'contusion'],
  'left-leg': ['hamstring strain', 'quad strain', 'muscle tear', 'contusion'],
  'right-foot': ['ankle sprain', 'foot strain', 'bruise'],
  'left-foot': ['ankle sprain', 'foot strain', 'bruise'],
  'right-shoulder': ['shoulder strain', 'dislocation'],
  'left-shoulder': ['shoulder strain', 'dislocation'],
  'abdomen': ['muscle strain', 'core injury'],
  'chest': ['rib contusion', 'chest strain'],
  'right-arm': ['arm strain', 'elbow injury'],
  'left-arm': ['arm strain', 'elbow injury'],
  'right-hand': ['wrist sprain', 'finger injury'],
  'left-hand': ['wrist sprain', 'finger injury'],
};

// Helper functions
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max, decimals = 1) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getDateDaysAgo(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
}

function generateWorkoutActivity(athlete, date, position, forcedIntensity = null) {
  const workoutTypes = ['strength', 'cardio', 'hiit', 'flexibility', 'recovery'];
  const intensityLevels = ['very-light', 'light', 'moderate', 'hard', 'very-hard'];
  const lightIntensityLevels = ['very-light', 'light'];
  
  // Exercise database matching frontend constants
  const exercisesByType = {
    'strength': [
      'Bench Press', 'Incline Press', 'Dips', 'Push-ups',
      'Deadlifts', 'Romanian Deadlifts', 'Squats', 'Front Squats',
      'Pull-ups', 'Barbell Rows', 'Lat Pulldowns',
      'Shoulder Press', 'Lateral Raises',
      'Bicep Curls', 'Hammer Curls', 'Tricep Extensions'
    ],
    'cardio': [
      'Running', 'Cycling', 'Rowing', 'Jump Rope'
    ],
    'hiit': [
      'Burpees', 'Mountain Climbers', 'Box Jumps', 'Jump Rope'
    ],
    'flexibility': [
      'Plank', 'Crunches', 'Russian Twists', 'Hanging Leg Raises'
    ],
    'recovery': [
      'Plank', 'Running', 'Cycling'
    ],
  };
  
  const duration = randomInt(45, 120); // 45-120 minutes
  const workoutType = randomChoice(workoutTypes);
  const intensity = forcedIntensity === 'light' ? randomChoice(lightIntensityLevels) : randomChoice(intensityLevels);
  
  // Intensity-based metrics
  const intensityMultipliers = {
    'very-light': { hr: 0.5, cal: 0.4, fatigue: 1 },
    'light': { hr: 0.6, cal: 0.5, fatigue: 2 },
    'moderate': { hr: 0.75, cal: 0.75, fatigue: 4 },
    'hard': { hr: 0.85, cal: 1.0, fatigue: 6 },
    'very-hard': { hr: 0.95, cal: 1.2, fatigue: 8 },
  };
  
  const mult = intensityMultipliers[intensity];
  const baseHR = 70;
  const maxHR = 200;
  
  // Generate exercises in the format the frontend expects
  const exercises = [];
  const exerciseCount = randomInt(4, 8);
  const availableExercises = exercisesByType[workoutType] || exercisesByType['strength'];
  
  for (let i = 0; i < exerciseCount; i++) {
    const exerciseName = randomChoice(availableExercises);
    exercises.push({
      id: `ex-${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${i}`,
      exercise: exerciseName,
      sets: randomInt(3, 5),
      reps: randomInt(8, 15),
      weight: exerciseName.includes('Running') || exerciseName.includes('Cycling') ? 0 : randomInt(20, 100),
      intensity: intensity,
      notes: '',
    });
  }
  
  return {
    athlete_id: athlete.id,
    activity_type: 'workout',
    date,
    start_time: `${String(randomInt(6, 18)).padStart(2, '0')}:${String(randomInt(0, 59)).padStart(2, '0')}:00`,
    duration,
    workout_type: workoutType,
    exercises,
    equipment_used: ['dumbbells', 'barbell', 'bench', 'treadmill'],
    heart_rate_avg: Math.round(baseHR + (maxHR - baseHR) * mult.hr),
    heart_rate_max: Math.round(baseHR + (maxHR - baseHR) * mult.hr * 1.15),
    calories_burned: Math.round(duration * 8 * mult.cal),
    // affected_body_parts will be auto-calculated by backend from exercises
    recovery_status: 'normal',
    fatigue_level: mult.fatigue,
    notes: `${workoutType.charAt(0).toUpperCase() + workoutType.slice(1)} training session - ${intensity} intensity`,
    weather_conditions: randomChoice(['clear', 'cloudy', 'rainy']),
  };
}

function generateMatchActivity(athlete, date, position) {
  const matchTypes = ['competitive', 'competitive', 'competitive', 'friendly'];
  const intensityLevels = ['hard', 'very-hard', 'maximum'];
  const results = ['win', 'loss', 'draw'];
  const opponents = [
    'Real Madrid', 'FC Barcelona', 'Bayern Munich', 'AC Milan', 
    'Inter Milan', 'Ajax', 'Boca Juniors', 'River Plate', 'Santos',
    'Flamengo', 'Palmeiras', 'Corinthians', 'Sao Paulo', 'Gremio'
  ];
  
  const matchType = randomChoice(matchTypes);
  const intensity = randomChoice(intensityLevels);
  const minutesPlayed = randomInt(15, 90);
  const opponent = randomChoice(opponents);
  
  // Intensity-based metrics
  const intensityMultipliers = {
    'hard': { hr: 0.85, cal: 1.0 },
    'very-hard': { hr: 0.90, cal: 1.1 },
    'maximum': { hr: 0.95, cal: 1.3 },
  };
  
  const mult = intensityMultipliers[intensity];
  const baseHR = 70;
  const maxHR = 200;
  
  // Position-specific performance metrics
  const performanceMetrics = {};
  if (position === 'Goalkeeper') {
    performanceMetrics.saves = randomInt(2, 8);
    performanceMetrics.catches = randomInt(3, 10);
  } else if (position.includes('Back') || position === 'Center Back') {
    performanceMetrics.tackles = randomInt(3, 8);
    performanceMetrics.interceptions = randomInt(2, 6);
  } else if (position.includes('Midfield')) {
    performanceMetrics.sprintDistance = randomFloat(3, 8, 1);
    performanceMetrics.topSpeed = randomFloat(28, 34, 1);
    performanceMetrics.tackles = randomInt(1, 4);
  } else {
    performanceMetrics.sprintDistance = randomFloat(4, 9, 1);
    performanceMetrics.topSpeed = randomFloat(30, 36, 1);
    performanceMetrics.jumps = randomInt(5, 15);
  }
  
  // Check for injury (1% probability)
  const hasInjury = Math.random() < 0.01;
  const injuries = [];
  
  if (hasInjury) {
    const affectedBodyParts = POSITION_BODY_PARTS[position] || ['right-leg', 'left-leg'];
    const injuredPart = randomChoice(affectedBodyParts);
    const injuryType = randomChoice(INJURY_TYPES[injuredPart] || ['strain']);
    const severity = randomChoice(['minor', 'minor', 'moderate', 'severe']);
    const injuryId = `inj-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    injuries.push({
      id: injuryId,
      bodyPart: injuredPart,
      injuryType: injuryType,
      severity: severity,
      timeOccurred: `${randomInt(1, minutesPlayed)}'`,
      mechanism: randomChoice([
        'Contact with opponent',
        'Awkward landing',
        'Sudden movement',
        'Overextension',
        'Collision'
      ]),
      notes: `${severity} ${injuryType} during match`,
    });
  }
  
  const affectedBodyParts = POSITION_BODY_PARTS[position] || ['right-leg', 'left-leg', 'abdomen'];
  
  return {
    athlete_id: athlete.id,
    activity_type: 'sports',
    date,
    duration: minutesPlayed,
    sport: 'Football',
    position: position,
    match_type: matchType,
    location: 'Legendary Stadium',
    opponent: opponent,
    result: randomChoice(results),
    minutes_played: minutesPlayed,
    intensity_level: intensity,
    performance_metrics: performanceMetrics,
    injuries,
    medical_attention: hasInjury ? (injuries[0].severity === 'severe' ? 'immediate' : 'on-field') : '',
    surface_type: 'grass',
    weather_conditions: randomChoice(['clear', 'cloudy', 'rainy', 'windy']),
    heart_rate_avg: Math.round(baseHR + (maxHR - baseHR) * mult.hr),
    heart_rate_max: Math.round(baseHR + (maxHR - baseHR) * mult.hr * 1.15),
    affected_body_parts: affectedBodyParts.slice(0, randomInt(3, 5)),
    recovery_status: hasInjury ? 'injured' : (intensity === 'maximum' ? 'fatigued' : 'normal'),
    coach_feedback: hasInjury ? 'Player sustained injury, monitor recovery' : 
                    `Good performance vs ${opponent} - ${intensity} intensity`,
  };
}

async function createAthlete(playerData) {
  try {
    const response = await fetch(`${API_URL}/api/athletes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: USER_ID,
        name: playerData.name,
        age: playerData.age,
        position: playerData.position,
        height: playerData.height,
        weight: playerData.weight,
        primary_sport: 'Football',
        team: 'Legends',
        status: 'active',
      }),
    });
    
    const result = await response.json();
    
    if (!result.success) {
      console.error(`Error creating athlete ${playerData.name}:`, result.error);
      return null;
    }
    
    console.log(`✓ Created athlete: ${playerData.name}`);
    return result.data;
  } catch (error) {
    console.error(`Error creating athlete ${playerData.name}:`, error.message);
    return null;
  }
}

async function seedActivitiesForAthlete(athlete, entriesCount = 250, daysRange = 100) {
  console.log(`\nSeeding ${entriesCount} activities for ${athlete.name} over ${daysRange} days...`);
  
  // Generate dates
  const dates = [];
  for (let i = 0; i < daysRange; i++) {
    dates.push(getDateDaysAgo(i));
  }
  
  // Calculate match frequency
  const matchFrequency = 0.3; // 30% of activities are matches
  const matchCount = Math.floor(entriesCount * matchFrequency);
  const workoutCount = entriesCount - matchCount;
  
  const activities = [];
  
  // Generate matches - pick random dates (can repeat)
  for (let i = 0; i < matchCount; i++) {
    const date = dates[Math.floor(Math.random() * dates.length)];
    const matchActivity = generateMatchActivity(athlete, date, athlete.position);
    if (matchActivity) {
      activities.push(matchActivity);
    }
  }
  
  // Generate workouts - pick random dates (can repeat)
  for (let i = 0; i < workoutCount; i++) {
    const date = dates[Math.floor(Math.random() * dates.length)];
    const workoutActivity = generateWorkoutActivity(athlete, date, athlete.position, athlete.training_intensity);
    activities.push(workoutActivity);
  }
  
  // Sort activities by date (oldest first) for realistic progression
  activities.sort((a, b) => new Date(a.date) - new Date(b.date));
  
  // Log activities through API (one by one for proper calculation)
  let inserted = 0;
  let failed = 0;
  
  for (let i = 0; i < activities.length; i++) {
    try {
      const response = await fetch(`${API_URL}/api/activities/log`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(activities[i]),
      });
      
      const result = await response.json();
      
      if (result.success) {
        inserted++;
      } else {
        failed++;
        if (failed <= 5) { // Only show first 5 errors
          console.error(`\n  Error logging activity: ${result.error}`);
        }
      }
      
      // Progress update every 10 activities
      if ((i + 1) % 10 === 0) {
        process.stdout.write(`\r  Progress: ${inserted}/${activities.length} activities (${failed} failed)`);
      }
      
      // Small delay to prevent overwhelming the server
      if ((i + 1) % 50 === 0) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } catch (error) {
      failed++;
      if (failed <= 5) {
        console.error(`\n  Error: ${error.message}`);
      }
    }
  }
  
  console.log(`\n✓ Completed: ${inserted} activities logged, ${failed} failed for ${athlete.name}`);
  return inserted;
}

// Injury history is now automatically created by the backend API
// when logging sports activities with injuries

async function main() {
  console.log('='.repeat(80));
  console.log('FOOTBALL LEGENDS SYNTHETIC DATA SEEDING');
  console.log('='.repeat(80));
  console.log(`Backend API: ${API_URL}`);
  console.log(`User ID: ${USER_ID}`);
  console.log(`Players: ${LEGENDS_SQUAD.length}`);
  console.log(`Activities per player: 250`);
  console.log(`Time range: 100 days`);
  console.log(`Total activities: ${LEGENDS_SQUAD.length * 250}`);
  console.log('='.repeat(80));
  console.log();
  
  // Check if backend server is running
  console.log('Checking backend server connection...');
  try {
    const healthCheck = await fetch(`${API_URL}/health`).catch(() => null);
    if (!healthCheck || !healthCheck.ok) {
      console.error('❌ Backend server is not running!');
      console.error(`   Please start the backend server at ${API_URL} before running this script.`);
      console.error('   Run: cd backend && npm run dev');
      process.exit(1);
    }
    console.log('✓ Backend server is running\n');
  } catch (error) {
    console.error('❌ Cannot connect to backend server!');
    console.error(`   Please start the backend server at ${API_URL}`);
    process.exit(1);
  }
  
  const startTime = Date.now();
  
  try {
    // Optional: Clean existing data for user
    console.log('Phase 0: Cleaning existing data (optional)');
    console.log('-'.repeat(80));
    const { data: existingAthletes, error: fetchError } = await supabase
      .from('athletes')
      .select('id, name')
      .eq('user_id', USER_ID);
    
    if (existingAthletes && existingAthletes.length > 0) {
      console.log(`Found ${existingAthletes.length} existing athletes for this user.`);
      console.log('Deleting existing data (activities will cascade delete)...');
      
      const { error: deleteError } = await supabase
        .from('athletes')
        .delete()
        .eq('user_id', USER_ID);
      
      if (deleteError) {
        console.error('❌ Error deleting existing data:', deleteError.message);
      } else {
        console.log('✓ Cleaned existing data\n');
      }
    } else {
      console.log('No existing data found for this user.\n');
    }
    
    // Create athletes
    console.log('Phase 1: Creating Athletes via API');
    console.log('-'.repeat(80));
    const createdAthletesWithDetails = [];
    
    for (const player of LEGENDS_SQUAD) {
      const createdAthlete = await createAthlete(player);
      if (createdAthlete) {
        createdAthletesWithDetails.push({ ...createdAthlete, ...player });
      }
    }
    
    console.log(`\n✓ Created ${createdAthletesWithDetails.length} athletes\n`);
    
    // Seed activities
    console.log('Phase 2: Seeding Activities');
    console.log('-'.repeat(80));
    
    let totalActivities = 0;
    for (const athlete of createdAthletesWithDetails) {
      const count = await seedActivitiesForAthlete(athlete, 250, 100);
      totalActivities += count;
    }
    
    console.log(`\n✓ Total activities inserted: ${totalActivities}\n`);
    
    // Complete
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log('='.repeat(80));
    console.log('SEEDING COMPLETED SUCCESSFULLY');
    console.log('='.repeat(80));
    console.log(`Athletes created: ${createdAthletesWithDetails.length}`);
    console.log(`Activities seeded: ${totalActivities}`);
    console.log(`Time taken: ${duration}s`);
    if (duration > 0) {
        console.log(`Average: ${(totalActivities / duration).toFixed(0)} activities/second`);
    }
    console.log('='.repeat(80));
    
  } catch (error) {
    console.error('\n❌ Fatal error during seeding:', error);
    process.exit(1);
  }
}

// Run the script
main();
