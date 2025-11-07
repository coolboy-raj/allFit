-- ============================================
-- INJURY ANALYSIS DATABASE SCHEMA
-- Comprehensive tracking for professional athletes
-- ============================================

-- ============================================
-- CLEAN UP EXISTING OBJECTS
-- Drop tables in reverse dependency order
-- ============================================
DROP TABLE IF EXISTS recovery_events CASCADE;
DROP TABLE IF EXISTS injury_risk_snapshots CASCADE;
DROP TABLE IF EXISTS injury_history CASCADE;
DROP TABLE IF EXISTS body_part_workload CASCADE;
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS athletes CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop views if they exist
DROP VIEW IF EXISTS active_injuries CASCADE;
DROP VIEW IF EXISTS latest_injury_risk_snapshot CASCADE;
DROP VIEW IF EXISTS latest_body_part_workload CASCADE;

-- Drop functions if they exist
DROP FUNCTION IF EXISTS update_injury_updated_at_column() CASCADE;

-- ============================================
-- EXTENSIONS
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- Store coach/trainer profiles (created via Google OAuth)
-- ============================================
CREATE TABLE users (
  id TEXT PRIMARY KEY, -- Google ID
  google_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  picture_url TEXT,
  access_token TEXT,
  refresh_token TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_google_id ON users(google_id);
CREATE INDEX idx_users_email ON users(email);

-- ============================================
-- ATHLETES TABLE
-- Store athlete profiles and current state
-- Note: One coach (user) can manage multiple athletes
-- ============================================
CREATE TABLE athletes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  age INTEGER,
  position TEXT,
  height TEXT,
  weight TEXT,
  primary_sport TEXT,
  team TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'recovering', 'injured')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Note: user_id is NOT unique - one coach can manage many athletes
CREATE INDEX idx_athletes_user_id ON athletes(user_id);
CREATE INDEX idx_athletes_status ON athletes(status);

-- ============================================
-- ACTIVITY LOGS TABLE
-- Log all workouts and sports activities
-- ============================================
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  athlete_id UUID REFERENCES athletes(id) ON DELETE CASCADE NOT NULL,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('workout', 'sports')),
  date DATE NOT NULL,
  start_time TIME,
  duration INTEGER NOT NULL, -- in minutes
  
  -- Workout specific fields
  workout_type TEXT, -- strength, cardio, hiit, etc.
  exercises JSONB DEFAULT '[]'::JSONB, -- Array of exercises with sets/reps/weight
  equipment_used TEXT[], -- Array of equipment
  
  -- Sports specific fields
  sport TEXT,
  position TEXT,
  match_type TEXT, -- competitive, friendly, practice, etc.
  location TEXT,
  opponent TEXT,
  result TEXT,
  minutes_played INTEGER,
  intensity_level TEXT, -- very-light, light, moderate, hard, very-hard, maximum
  performance_metrics JSONB DEFAULT '{}'::JSONB,
  injuries JSONB DEFAULT '[]'::JSONB, -- Array of injury records
  medical_attention TEXT,
  surface_type TEXT,
  weather_conditions TEXT,
  
  -- Common fields
  heart_rate_avg INTEGER,
  heart_rate_max INTEGER,
  calories_burned INTEGER,
  affected_body_parts TEXT[], -- Array of body part identifiers
  recovery_status TEXT NOT NULL DEFAULT 'normal',
  fatigue_level INTEGER CHECK (fatigue_level >= 1 AND fatigue_level <= 10),
  notes TEXT,
  coach_feedback TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_athlete_id ON activity_logs(athlete_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_date ON activity_logs(date DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_type ON activity_logs(activity_type);
CREATE INDEX IF NOT EXISTS idx_activity_logs_sport ON activity_logs(sport);

-- ============================================
-- BODY PART WORKLOAD TABLE
-- Track cumulative workload per body part
-- ============================================
CREATE TABLE body_part_workload (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  athlete_id UUID REFERENCES athletes(id) ON DELETE CASCADE NOT NULL,
  body_part TEXT NOT NULL CHECK (body_part IN (
    'head', 'orbit', 'neck', 'chest', 
    'right-shoulder', 'left-shoulder',
    'right-arm', 'left-arm',
    'right-hand', 'left-hand',
    'abdomen',
    'right-leg', 'left-leg',
    'right-foot', 'left-foot'
  )),
  date DATE NOT NULL,
  
  -- Workload metrics
  workload_score DECIMAL(10, 2) NOT NULL DEFAULT 0, -- Calculated workload for the day
  cumulative_7day DECIMAL(10, 2) DEFAULT 0, -- Rolling 7-day cumulative
  cumulative_30day DECIMAL(10, 2) DEFAULT 0, -- Rolling 30-day cumulative
  
  -- Injury risk metrics
  injury_risk_percentage INTEGER DEFAULT 0 CHECK (injury_risk_percentage >= 0 AND injury_risk_percentage <= 100),
  risk_level TEXT CHECK (risk_level IN ('minimal', 'low', 'medium', 'high', 'critical')),
  
  -- Recovery tracking
  recovery_rate DECIMAL(5, 2) DEFAULT 100.0, -- Recovery percentage (100 = fully recovered)
  days_since_last_activity INTEGER DEFAULT 0,
  
  -- Activity context
  activity_count INTEGER DEFAULT 0, -- Number of activities affecting this body part
  total_duration INTEGER DEFAULT 0, -- Total minutes of activity
  avg_intensity DECIMAL(5, 2) DEFAULT 0, -- Average intensity
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(athlete_id, body_part, date)
);

CREATE INDEX IF NOT EXISTS idx_body_part_workload_athlete_date ON body_part_workload(athlete_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_body_part_workload_body_part ON body_part_workload(body_part);
CREATE INDEX IF NOT EXISTS idx_body_part_workload_risk ON body_part_workload(injury_risk_percentage DESC);

-- ============================================
-- INJURY HISTORY TABLE
-- Track actual injuries sustained
-- ============================================
CREATE TABLE injury_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  athlete_id UUID REFERENCES athletes(id) ON DELETE CASCADE NOT NULL,
  activity_log_id UUID REFERENCES activity_logs(id) ON DELETE SET NULL,
  
  body_part TEXT NOT NULL,
  injury_type TEXT NOT NULL, -- strain, sprain, tear, fracture, etc.
  severity TEXT NOT NULL CHECK (severity IN ('minor', 'moderate', 'severe', 'critical')),
  
  injury_date DATE NOT NULL,
  time_occurred TIME,
  mechanism TEXT, -- How the injury occurred
  
  -- Medical info
  diagnosis TEXT,
  treatment TEXT,
  expected_recovery_days INTEGER,
  actual_recovery_days INTEGER,
  
  -- Status tracking
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'healing', 'recovered')),
  return_to_play_date DATE,
  
  notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_injury_history_athlete ON injury_history(athlete_id, injury_date DESC);
CREATE INDEX IF NOT EXISTS idx_injury_history_body_part ON injury_history(body_part);
CREATE INDEX IF NOT EXISTS idx_injury_history_status ON injury_history(status);

-- ============================================
-- RECOVERY EVENTS TABLE
-- Track recovery periods and rest days
-- ============================================
CREATE TABLE recovery_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  athlete_id UUID REFERENCES athletes(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  recovery_type TEXT NOT NULL CHECK (recovery_type IN ('rest', 'active_recovery', 'physiotherapy', 'massage', 'ice_bath', 'other')),
  body_parts TEXT[], -- Specific body parts targeted
  duration INTEGER, -- in minutes
  notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(athlete_id, date, recovery_type)
);

CREATE INDEX IF NOT EXISTS idx_recovery_events_athlete ON recovery_events(athlete_id, date DESC);

-- ============================================
-- INJURY RISK SNAPSHOTS TABLE
-- Daily snapshots of overall injury risk
-- ============================================
CREATE TABLE injury_risk_snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  athlete_id UUID REFERENCES athletes(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  
  -- Overall metrics
  overall_risk_score INTEGER CHECK (overall_risk_score >= 0 AND overall_risk_score <= 100),
  risk_level TEXT CHECK (risk_level IN ('minimal', 'low', 'medium', 'high', 'critical')),
  
  -- Contributing factors
  training_load_score DECIMAL(10, 2),
  fatigue_index DECIMAL(10, 2),
  recovery_score DECIMAL(10, 2),
  
  -- Body part breakdown
  high_risk_body_parts TEXT[],
  medium_risk_body_parts TEXT[],
  
  -- Recommendations
  recommendations JSONB DEFAULT '[]'::JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(athlete_id, date)
);

CREATE INDEX IF NOT EXISTS idx_injury_risk_snapshots_athlete ON injury_risk_snapshots(athlete_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_injury_risk_snapshots_risk_level ON injury_risk_snapshots(risk_level);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_injury_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updating updated_at
CREATE TRIGGER update_athletes_updated_at BEFORE UPDATE ON athletes
  FOR EACH ROW EXECUTE FUNCTION update_injury_updated_at_column();

CREATE TRIGGER update_activity_logs_updated_at BEFORE UPDATE ON activity_logs
  FOR EACH ROW EXECUTE FUNCTION update_injury_updated_at_column();

CREATE TRIGGER update_body_part_workload_updated_at BEFORE UPDATE ON body_part_workload
  FOR EACH ROW EXECUTE FUNCTION update_injury_updated_at_column();

CREATE TRIGGER update_injury_history_updated_at BEFORE UPDATE ON injury_history
  FOR EACH ROW EXECUTE FUNCTION update_injury_updated_at_column();

-- ============================================
-- VIEWS
-- ============================================

-- Latest body part workload for each athlete
CREATE OR REPLACE VIEW latest_body_part_workload AS
SELECT DISTINCT ON (athlete_id, body_part) *
FROM body_part_workload
ORDER BY athlete_id, body_part, date DESC;

-- Latest injury risk snapshot for each athlete
CREATE OR REPLACE VIEW latest_injury_risk_snapshot AS
SELECT DISTINCT ON (athlete_id) *
FROM injury_risk_snapshots
ORDER BY athlete_id, date DESC;

-- Active injuries per athlete
CREATE OR REPLACE VIEW active_injuries AS
SELECT 
  athlete_id,
  COUNT(*) as active_injury_count,
  array_agg(body_part) as injured_body_parts
FROM injury_history
WHERE status = 'active'
GROUP BY athlete_id;

-- ============================================
-- DISABLE RLS FOR MVP
-- ============================================
ALTER TABLE athletes DISABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE body_part_workload DISABLE ROW LEVEL SECURITY;
ALTER TABLE injury_history DISABLE ROW LEVEL SECURITY;
ALTER TABLE recovery_events DISABLE ROW LEVEL SECURITY;
ALTER TABLE injury_risk_snapshots DISABLE ROW LEVEL SECURITY;

-- ============================================
-- COMPLETION MESSAGE
-- ============================================
DO $$
BEGIN
  RAISE NOTICE 'Injury Analysis schema created successfully!';
  RAISE NOTICE 'Tables: athletes, activity_logs, body_part_workload, injury_history, recovery_events, injury_risk_snapshots';
  RAISE NOTICE 'Ready for professional athlete injury prediction tracking!';
END $$;

