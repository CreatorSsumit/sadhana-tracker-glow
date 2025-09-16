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
  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState(false);

  useEffect(() => {
    // Check if Supabase is properly configured
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const configured = supabaseUrl && supabaseUrl !== 'https://placeholder.supabase.co';
    setIsSupabaseConfigured(configured);

    if (configured) {
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
    } else {
      // Fallback to localStorage for demo mode
      const storedAuth = localStorage.getItem('sadhna_auth');
      if (storedAuth) {
        setAuth(JSON.parse(storedAuth));
      }
      setLoading(false);
    }
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
    if (!isSupabaseConfigured) {
      // Fallback to localStorage demo mode
      const users = JSON.parse(localStorage.getItem('sadhna_users') || '[]');
      const user = users.find((u: User) => u.email === email);
      
      if (user && password === 'password') {
        const authState = { isAuthenticated: true, user };
        setAuth(authState);
        localStorage.setItem('sadhna_auth', JSON.stringify(authState));
        // Navigate to dashboard after successful login
        window.location.reload(); // This will trigger a re-render with authenticated state
        return true;
      }
      return false;
    }

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
    if (!isSupabaseConfigured) {
      // Fallback to localStorage demo mode
      setAuth({ isAuthenticated: false, user: null });
      localStorage.removeItem('sadhna_auth');
      return;
    }

    try {
      await supabase.auth.signOut();
      setAuth({ isAuthenticated: false, user: null });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const registerUser = async (name: string, email: string): Promise<boolean> => {
    if (!isSupabaseConfigured) {
      // Fallback to localStorage demo mode
      const users = JSON.parse(localStorage.getItem('sadhna_users') || '[]');
      
      if (users.find((u: User) => u.email === email)) {
        return false; // User already exists
      }

      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        role: 'user',
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      localStorage.setItem('sadhna_users', JSON.stringify(users));
      return true;
    }

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

  // Initialize demo data when not using Supabase
  useEffect(() => {
    if (!isSupabaseConfigured) {
      const users = JSON.parse(localStorage.getItem('sadhna_users') || '[]');
      if (users.length === 0) {
        const adminUser: User = {
          id: 'admin1',
          name: 'Admin',
          email: 'admin@sadhna.com',
          role: 'admin',
          createdAt: new Date().toISOString(),
        };
        localStorage.setItem('sadhna_users', JSON.stringify([adminUser]));
      }
    }
  }, [isSupabaseConfigured]);

  return { auth, login, logout, registerUser, loading };
};