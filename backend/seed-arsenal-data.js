/**
 * Arsenal FC Synthetic Data Seeding Script
 * ==========================================
 * 
 * Generates 300 performance entries over 120 days for each Arsenal player.
 * Seeds data through backend API routes for proper metric calculation.
 * 
 * This script will:
 * 1. Delete existing athletes and activities for the specified user
 * 2. Create 26 Arsenal FC players via API
 * 3. Generate and log 300 activities per player (workouts + matches)
 * 4. Backend automatically calculates:
 *    - Body part workloads from exercises
 *    - Injury risk from activity patterns
 *    - Recovery metrics
 * 
 * PREREQUISITES:
 * - Backend server MUST be running (npm run dev in backend/)
 * - .env file configured with SUPABASE credentials
 * 
 * Run with: node seed-arsenal-data.js
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

// Arsenal FC 2024-25 Squad
const ARSENAL_SQUAD = [
  // Goalkeepers
  { name: 'David Raya', age: 28, position: 'Goalkeeper', height: '183cm', weight: '74kg', number: 22 },
  { name: 'Aaron Ramsdale', age: 25, position: 'Goalkeeper', height: '188cm', weight: '82kg', number: 1 },
  
  // Defenders
  { name: 'William Saliba', age: 22, position: 'Center Back', height: '192cm', weight: '85kg', number: 2 },
  { name: 'Gabriel Magalhães', age: 26, position: 'Center Back', height: '190cm', weight: '84kg', number: 6 },
  { name: 'Ben White', age: 26, position: 'Right Back', height: '186cm', weight: '73kg', number: 4 },
  { name: 'Takehiro Tomiyasu', age: 25, position: 'Right Back', height: '188cm', weight: '80kg', number: 18 },
  { name: 'Oleksandr Zinchenko', age: 27, position: 'Left Back', height: '175cm', weight: '64kg', number: 35 },
  { name: 'Jurrien Timber', age: 22, position: 'Defender', height: '179cm', weight: '73kg', number: 12 },
  { name: 'Jakub Kiwior', age: 23, position: 'Center Back', height: '189cm', weight: '80kg', number: 15 },
  
  // Midfielders
  { name: 'Martin Ødegaard', age: 25, position: 'Attacking Midfield', height: '178cm', weight: '68kg', number: 8 },
  { name: 'Declan Rice', age: 24, position: 'Defensive Midfield', height: '185cm', weight: '80kg', number: 41 },
  { name: 'Thomas Partey', age: 30, position: 'Defensive Midfield', height: '185cm', weight: '77kg', number: 5 },
  { name: 'Jorginho', age: 32, position: 'Defensive Midfield', height: '180cm', weight: '65kg', number: 20 },
  { name: 'Kai Havertz', age: 24, position: 'Attacking Midfield', height: '190cm', weight: '80kg', number: 29 },
  { name: 'Fabio Vieira', age: 23, position: 'Attacking Midfield', height: '170cm', weight: '62kg', number: 21 },
  { name: 'Emile Smith Rowe', age: 23, position: 'Attacking Midfield', height: '182cm', weight: '71kg', number: 10 },
  
  // Forwards
  { name: 'Bukayo Saka', age: 22, position: 'Right Winger', height: '178cm', weight: '70kg', number: 7 },
  { name: 'Gabriel Martinelli', age: 22, position: 'Left Winger', height: '178cm', weight: '72kg', number: 11 },
  { name: 'Leandro Trossard', age: 28, position: 'Left Winger', height: '172cm', weight: '61kg', number: 19 },
  { name: 'Gabriel Jesus', age: 26, position: 'Striker', height: '175cm', weight: '73kg', number: 9 },
  { name: 'Eddie Nketiah', age: 24, position: 'Striker', height: '175cm', weight: '70kg', number: 14 },
  { name: 'Reiss Nelson', age: 24, position: 'Winger', height: '175cm', weight: '64kg', number: 24 },
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

function generateWorkoutActivity(athlete, date, position) {
  const workoutTypes = ['strength', 'cardio', 'hiit', 'flexibility', 'recovery'];
  const intensityLevels = ['very-light', 'light', 'moderate', 'hard', 'very-hard'];
  
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
  const intensity = randomChoice(intensityLevels);
  
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
    'Manchester City', 'Liverpool', 'Chelsea', 'Manchester United', 
    'Tottenham', 'Newcastle', 'Aston Villa', 'Brighton', 'West Ham',
    'Brentford', 'Fulham', 'Crystal Palace', 'Wolves', 'Everton'
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
  
  // Check for injury (5% probability)
  const hasInjury = Math.random() < 0.05;
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
    location: Math.random() > 0.5 ? 'Emirates Stadium' : 'Away Stadium',
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
        team: 'Arsenal FC',
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

async function seedActivitiesForAthlete(athlete, entriesCount = 300, daysRange = 120) {
  console.log(`\nSeeding ${entriesCount} activities for ${athlete.name} over ${daysRange} days...`);
  
  // Generate dates
  const dates = [];
  for (let i = 0; i < daysRange; i++) {
    dates.push(getDateDaysAgo(i));
  }
  
  // Calculate match frequency (roughly 2-3 matches per week during season)
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
    const workoutActivity = generateWorkoutActivity(athlete, date, athlete.position);
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
  console.log('ARSENAL FC SYNTHETIC DATA SEEDING');
  console.log('='.repeat(80));
  console.log(`Backend API: ${API_URL}`);
  console.log(`User ID: ${USER_ID}`);
  console.log(`Players: ${ARSENAL_SQUAD.length}`);
  console.log(`Activities per player: 300`);
  console.log(`Time range: 120 days`);
  console.log(`Total activities: ${ARSENAL_SQUAD.length * 300}`);
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
    const athletes = [];
    
    for (const player of ARSENAL_SQUAD) {
      const athlete = await createAthlete(player);
      if (athlete) {
        athletes.push(athlete);
      }
    }
    
    console.log(`\n✓ Created ${athletes.length} athletes\n`);
    
    // Seed activities
    console.log('Phase 2: Seeding Activities');
    console.log('-'.repeat(80));
    
    let totalActivities = 0;
    for (const athlete of athletes) {
      const count = await seedActivitiesForAthlete(athlete, 300, 120);
      totalActivities += count;
    }
    
    console.log(`\n✓ Total activities inserted: ${totalActivities}\n`);
    
    // Complete
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log('='.repeat(80));
    console.log('SEEDING COMPLETED SUCCESSFULLY');
    console.log('='.repeat(80));
    console.log(`Athletes created: ${athletes.length}`);
    console.log(`Activities seeded: ${totalActivities}`);
    console.log(`Time taken: ${duration}s`);
    console.log(`Average: ${(totalActivities / duration).toFixed(0)} activities/second`);
    console.log('='.repeat(80));
    
  } catch (error) {
    console.error('\n❌ Fatal error during seeding:', error);
    process.exit(1);
  }
}

// Run the script
main();

