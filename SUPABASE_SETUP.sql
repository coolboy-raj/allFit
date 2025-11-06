-- TotalFit Database Schema for Supabase
-- Run this SQL in your Supabase SQL Editor

-- ============================================
-- DROP EXISTING OBJECTS (Clean Slate)
-- ============================================

-- Drop triggers first
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_health_scores_updated_at ON health_scores;
DROP TRIGGER IF EXISTS update_health_metrics_updated_at ON health_metrics;
DROP TRIGGER IF EXISTS update_user_goals_updated_at ON user_goals;

-- Drop views
DROP VIEW IF EXISTS latest_health_scores CASCADE;
DROP VIEW IF EXISTS weekly_summaries CASCADE;
DROP VIEW IF EXISTS user_weekly_summary CASCADE;
DROP VIEW IF EXISTS user_health_overview CASCADE;

-- Drop tables (CASCADE will drop dependent objects including RLS policies)
DROP TABLE IF EXISTS sync_logs CASCADE;
DROP TABLE IF EXISTS ai_recommendations CASCADE;
DROP TABLE IF EXISTS user_goals CASCADE;
DROP TABLE IF EXISTS injury_risk_assessments CASCADE;
DROP TABLE IF EXISTS workout_sessions CASCADE;
DROP TABLE IF EXISTS health_metrics CASCADE;
DROP TABLE IF EXISTS health_scores CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY, -- Using Google ID as primary key for simplicity
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  google_id TEXT UNIQUE NOT NULL,
  picture_url TEXT,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_sync_at TIMESTAMP WITH TIME ZONE
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ============================================
-- HEALTH SCORES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS health_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  overall_score INTEGER NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
  activity_level INTEGER NOT NULL CHECK (activity_level >= 0 AND activity_level <= 100),
  sleep_quality INTEGER NOT NULL CHECK (sleep_quality >= 0 AND sleep_quality <= 100),
  recovery_score INTEGER NOT NULL CHECK (recovery_score >= 0 AND recovery_score <= 100),
  consistency INTEGER NOT NULL CHECK (consistency >= 0 AND consistency <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_health_scores_user_date ON health_scores(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_health_scores_date ON health_scores(date DESC);

-- ============================================
-- HEALTH METRICS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS health_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  steps INTEGER DEFAULT 0,
  distance DECIMAL(10, 2) DEFAULT 0, -- in meters
  active_minutes INTEGER DEFAULT 0,
  heart_rate_avg INTEGER DEFAULT 0,
  heart_rate_resting INTEGER DEFAULT 0,
  heart_rate_max INTEGER DEFAULT 0,
  sleep_hours DECIMAL(4, 2) DEFAULT 0,
  sleep_deep_minutes INTEGER DEFAULT 0,
  sleep_light_minutes INTEGER DEFAULT 0,
  sleep_rem_minutes INTEGER DEFAULT 0,
  calories_burned INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_health_metrics_user_date ON health_metrics(user_id, date DESC);

-- ============================================
-- WORKOUT SESSIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS workout_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  exercise_type TEXT NOT NULL CHECK (exercise_type IN ('squat', 'pushup', 'deadlift', 'crunch')),
  sets JSONB NOT NULL DEFAULT '[]'::JSONB,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  total_reps INTEGER NOT NULL DEFAULT 0,
  average_form_score NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (average_form_score >= 0 AND average_form_score <= 100),
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_workout_sessions_user_date ON workout_sessions(user_id, start_time DESC);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_exercise ON workout_sessions(exercise_type);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_completed ON workout_sessions(completed);

-- ============================================
-- INJURY RISK ASSESSMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS injury_risk_assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH')),
  risk_score INTEGER NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
  risk_factors JSONB DEFAULT '[]'::JSONB,
  recommendations JSONB DEFAULT '[]'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_injury_risk_user_date ON injury_risk_assessments(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_injury_risk_level ON injury_risk_assessments(risk_level);

-- ============================================
-- AI RECOMMENDATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS ai_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('rest', 'activity', 'nutrition', 'hydration', 'sleep', 'warning')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_recommendations_user_date ON ai_recommendations(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_recommendations_priority ON ai_recommendations(priority);
CREATE INDEX IF NOT EXISTS idx_recommendations_completed ON ai_recommendations(completed);

-- ============================================
-- USER GOALS TABLE (Optional - for future use)
-- ============================================
CREATE TABLE IF NOT EXISTS user_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  goal_type TEXT NOT NULL CHECK (goal_type IN ('weight_loss', 'muscle_gain', 'endurance', 'general_health')),
  target_value DECIMAL(10, 2),
  target_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_goals_user ON user_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_user_goals_active ON user_goals(is_active);

-- ============================================
-- SYNC LOGS TABLE (Track Google Fit syncs)
-- ============================================
CREATE TABLE IF NOT EXISTS sync_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  sync_start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  sync_end_time TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'success', 'failed')),
  error_message TEXT,
  records_synced INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sync_logs_user ON sync_logs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sync_logs_status ON sync_logs(status);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updating updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_health_scores_updated_at BEFORE UPDATE ON health_scores
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_health_metrics_updated_at BEFORE UPDATE ON health_metrics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_goals_updated_at BEFORE UPDATE ON user_goals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- DISABLED FOR MVP - We're using Google OAuth, not Supabase Auth
-- RLS policies require auth.uid() which only works with Supabase Auth
-- TODO: Implement proper RLS when moving to production

-- For now, disable RLS to allow all operations
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE health_scores DISABLE ROW LEVEL SECURITY;
ALTER TABLE health_metrics DISABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE injury_risk_assessments DISABLE ROW LEVEL SECURITY;
ALTER TABLE ai_recommendations DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_goals DISABLE ROW LEVEL SECURITY;
ALTER TABLE sync_logs DISABLE ROW LEVEL SECURITY;

-- ============================================
-- INITIAL DATA / SEED (Optional)
-- ============================================

-- You can add seed data here if needed

-- ============================================
-- VIEWS (Optional - for easier queries)
-- ============================================

-- View for latest health scores
CREATE OR REPLACE VIEW latest_health_scores AS
SELECT DISTINCT ON (user_id) *
FROM health_scores
ORDER BY user_id, date DESC;

-- View for weekly summaries
CREATE OR REPLACE VIEW weekly_summaries AS
SELECT 
  user_id,
  DATE_TRUNC('week', date) as week_start,
  AVG(overall_score) as avg_health_score,
  AVG(activity_level) as avg_activity,
  AVG(sleep_quality) as avg_sleep,
  AVG(recovery_score) as avg_recovery
FROM health_scores
GROUP BY user_id, DATE_TRUNC('week', date);

-- ============================================
-- COMPLETION MESSAGE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE 'TotalFit database schema created successfully!';
  RAISE NOTICE 'Tables created: users, health_scores, health_metrics, workout_sessions, injury_risk_assessments, ai_recommendations, user_goals, sync_logs';
  RAISE NOTICE 'Row Level Security DISABLED for MVP (Google OAuth in use)';
  RAISE NOTICE 'You can now start using the database!';
END $$;

