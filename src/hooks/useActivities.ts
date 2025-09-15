import { useState, useEffect } from 'react';
import { Activity } from '@/types';

export const useActivities = (userId?: string) => {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const storedActivities = JSON.parse(localStorage.getItem('sadhna_activities') || '[]');
    if (userId) {
      setActivities(storedActivities.filter((a: Activity) => a.userId === userId));
    } else {
      setActivities(storedActivities);
    }
  }, [userId]);

  const addActivity = (activity: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newActivity: Activity = {
      ...activity,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const allActivities = JSON.parse(localStorage.getItem('sadhna_activities') || '[]');
    allActivities.push(newActivity);
    localStorage.setItem('sadhna_activities', JSON.stringify(allActivities));
    
    if (!userId || activity.userId === userId) {
      setActivities(prev => [...prev, newActivity]);
    }
  };

  const updateActivity = (id: string, updates: Partial<Activity>) => {
    const allActivities = JSON.parse(localStorage.getItem('sadhna_activities') || '[]');
    const index = allActivities.findIndex((a: Activity) => a.id === id);
    
    if (index !== -1) {
      allActivities[index] = {
        ...allActivities[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem('sadhna_activities', JSON.stringify(allActivities));
      
      setActivities(prev => 
        prev.map(a => a.id === id ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a)
      );
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
  };
};