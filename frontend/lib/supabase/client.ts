/**
 * Supabase Client Configuration
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Debug logging
console.log('[Supabase] 🔧 Initializing client with:', {
  url: supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : 'NOT SET',
  anonKey: supabaseAnonKey ? supabaseAnonKey.substring(0, 20) + '...' : 'NOT SET',
  configured: !!(supabaseUrl && supabaseAnonKey),
});

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          google_id: string;
          picture_url: string | null;
          access_token: string | null;
          refresh_token: string | null;
          token_expires_at: string | null;
          created_at: string;
          updated_at: string;
          last_sync_at: string | null;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          google_id: string;
          picture_url?: string | null;
          access_token?: string | null;
          refresh_token?: string | null;
          token_expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
          last_sync_at?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          google_id?: string;
          picture_url?: string | null;
          access_token?: string | null;
          refresh_token?: string | null;
          token_expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
          last_sync_at?: string | null;
        };
      };
      health_scores: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          overall_score: number;
          activity_level: number;
          sleep_quality: number;
          recovery_score: number;
          consistency: number;
          created_at: string;
          updated_at: string;
        };
      };
      health_metrics: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          steps: number;
          distance: number;
          active_minutes: number;
          heart_rate_avg: number;
          heart_rate_resting: number;
          heart_rate_max: number;
          sleep_hours: number;
          sleep_deep_minutes: number;
          sleep_light_minutes: number;
          sleep_rem_minutes: number;
          calories_burned: number;
          created_at: string;
          updated_at: string;
        };
      };
      ai_recommendations: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          type: string;
          title: string;
          description: string;
          priority: string;
          completed: boolean;
          completed_at: string | null;
          created_at: string;
        };
      };
      injury_risk_assessments: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          risk_level: "LOW" | "MEDIUM" | "HIGH";
          risk_score: number;
          risk_factors: string[];
          recommendations: string[];
          created_at: string;
        };
      };
    };
  };
}

