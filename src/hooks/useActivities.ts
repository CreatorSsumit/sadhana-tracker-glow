import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Activity } from '@/types';

export const useActivities = (userId?: string) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActivities();
  }, [userId]);

  const loadActivities = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('activities')
        .select('*')
        .order('date', { ascending: false });

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;

      if (error) throw error;

      const transformedActivities: Activity[] = data?.map(item => ({
        id: item.id,
        userId: item.user_id,
        date: item.date,
        mangalaAarti: item.mangala_aarti,
        japaRounds: item.japa_rounds,
        lectureDuration: item.lecture_duration,
        wakeUpTime: item.wake_up_time || '',
        sleepTime: item.sleep_time || '',
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      })) || [];

      setActivities(transformedActivities);
    } catch (error) {
      console.error('Error loading activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const addActivity = async (activity: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const { data, error } = await supabase
        .from('activities')
        .insert({
          user_id: activity.userId,
          date: activity.date,
          mangala_aarti: activity.mangalaAarti,
          japa_rounds: activity.japaRounds,
          lecture_duration: activity.lectureDuration,
          wake_up_time: activity.wakeUpTime || '',
          sleep_time: activity.sleepTime || '',
        })
        .select()
        .single();

      if (error) throw error;

      const newActivity: Activity = {
        id: data.id,
        userId: data.user_id,
        date: data.date,
        mangalaAarti: data.mangala_aarti,
        japaRounds: data.japa_rounds,
        lectureDuration: data.lecture_duration,
        wakeUpTime: data.wake_up_time || '',
        sleepTime: data.sleep_time || '',
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };

      setActivities(prev => [newActivity, ...prev]);
      return true;
    } catch (error) {
      console.error('Error adding activity:', error);
      return false;
    }
  };

  const updateActivity = async (id: string, updates: Partial<Activity>) => {
    try {
      const updateData: any = {};
      if (updates.mangalaAarti !== undefined) updateData.mangala_aarti = updates.mangalaAarti;
      if (updates.japaRounds !== undefined) updateData.japa_rounds = updates.japaRounds;
      if (updates.lectureDuration !== undefined) updateData.lecture_duration = updates.lectureDuration;
      if (updates.wakeUpTime !== undefined) updateData.wake_up_time = updates.wakeUpTime;
      if (updates.sleepTime !== undefined) updateData.sleep_time = updates.sleepTime;

      const { error } = await supabase
        .from('activities')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      setActivities(prev =>
        prev.map(a => a.id === id ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a)
      );
      return true;
    } catch (error) {
      console.error('Error updating activity:', error);
      return false;
    }
  };

  const getActivityByDate = (date: string) => {
    return activities.find(a => a.date === date);
  };

  const canEditActivity = (date: string) => {
    const today = new Date().toISOString().split('T')[0];
    return date === today;
  };

  return {
    activities,
    addActivity,
    updateActivity,
    getActivityByDate,
    canEditActivity,
    loading,
  };
};