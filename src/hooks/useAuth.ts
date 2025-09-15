import { useState, useEffect } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { User, AuthState } from '@/types';

export const useAuth = () => {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUserProfile(session.user);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await loadUserProfile(session.user);
        } else {
          setAuth({ isAuthenticated: false, user: null });
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (error && error.code === 'PGRST116') {
        // Profile doesn't exist, create one
        const newProfile = {
          id: supabaseUser.id,
          name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
          email: supabaseUser.email!,
          role: supabaseUser.email === 'admin@sadhna.com' ? 'admin' as const : 'user' as const,
        };

        const { data: insertedProfile, error: insertError } = await supabase
          .from('profiles')
          .insert(newProfile)
          .select()
          .single();

        if (insertError) throw insertError;

        const user: User = {
          id: insertedProfile.id,
          name: insertedProfile.name,
          email: insertedProfile.email,
          role: insertedProfile.role,
          createdAt: insertedProfile.created_at,
        };

        setAuth({ isAuthenticated: true, user });
      } else if (error) {
        throw error;
      } else {
        const user: User = {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          role: profile.role,
          createdAt: profile.created_at,
        };

        setAuth({ isAuthenticated: true, user });
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setAuth({ isAuthenticated: false, user: null });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const registerUser = async (name: string, email: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: 'password', // Default password
        options: {
          data: {
            name,
          },
        },
      });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  return { auth, login, logout, registerUser, loading };
};