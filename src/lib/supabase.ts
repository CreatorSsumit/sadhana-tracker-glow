import { createClient } from '@supabase/supabase-js';

// For Lovable Supabase integration, these will be automatically provided
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          email: string;
          role: 'admin' | 'user';
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          email: string;
          role?: 'admin' | 'user';
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          role?: 'admin' | 'user';
          created_at?: string;
        };
      };
      activities: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          mangala_aarti: boolean;
          japa_rounds: number;
          lecture_duration: number;
          wake_up_time: string;
          sleep_time: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          mangala_aarti?: boolean;
          japa_rounds?: number;
          lecture_duration?: number;
          wake_up_time?: string;
          sleep_time?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          mangala_aarti?: boolean;
          japa_rounds?: number;
          lecture_duration?: number;
          wake_up_time?: string;
          sleep_time?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}