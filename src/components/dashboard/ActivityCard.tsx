import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit2, Sun, Target, Clock, Moon, CheckCircle, XCircle } from 'lucide-react';
import { Activity } from '@/types';
import { useActivities } from '@/hooks/useActivities';
import { useState } from 'react';
import { ActivityForm } from './ActivityForm';

interface ActivityCardProps {
  activity: Activity;
  selectedDate: string;
}

export const ActivityCard = ({ activity, selectedDate }: ActivityCardProps) => {
  const { canEditActivity } = useActivities();
  const [showEditForm, setShowEditForm] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Badge 
            variant={activity.mangalaAarti ? "default" : "secondary"}
            className={`px-3 py-1 text-sm font-medium ${
              activity.mangalaAarti 
                ? 'bg-gradient-divine text-white border-primary/20' 
                : 'bg-muted text-muted-foreground border-muted-foreground/20'
            }`}
          >
            {activity.mangalaAarti ? (
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3" />
                🌅 Attended Mangala Aarti
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <XCircle className="w-3 h-3" />
                ⏰ Missed Mangala Aarti
              </div>
            )}
          </Badge>
          {canEditActivity(selectedDate) && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowEditForm(true)}
              className="border-primary/20 hover:border-primary/50 transition-sacred hover-divine"
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Sacred Record
            </Button>
          )}
        </div>
      </div>

      {/* Sacred Statistics Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-lotus p-4 rounded-lg border border-primary/10 divine-glow transition-sacred hover-divine">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-5 h-5 text-primary animate-sacred-pulse" />
            <p className="text-sm font-medium text-muted-foreground">Sacred Japa Rounds</p>
          </div>
          <p className="text-2xl font-bold text-primary">{activity.japaRounds}</p>
          <p className="text-xs text-muted-foreground mt-1">📿 Mantras chanted</p>
        </div>

        <div className="bg-gradient-lotus p-4 rounded-lg border border-accent/10 divine-glow transition-sacred hover-divine">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-accent animate-divine-float" />
            <p className="text-sm font-medium text-muted-foreground">Lecture Duration</p>
          </div>
          <p className="text-2xl font-bold text-accent">{activity.lectureDuration}</p>
          <p className="text-xs text-muted-foreground mt-1">📚 Minutes of learning</p>
        </div>

        <div className="bg-gradient-lotus p-4 rounded-lg border border-primary/10 divine-glow transition-sacred hover-divine">
          <div className="flex items-center gap-3 mb-2">
            <Sun className="w-5 h-5 text-primary animate-sacred-pulse" />
            <p className="text-sm font-medium text-muted-foreground">Sacred Wake Time</p>
          </div>
          <p className="text-2xl font-bold text-primary">
            {activity.wakeUpTime ? (
              new Date(`2000-01-01T${activity.wakeUpTime}`).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              })
            ) : "Not set"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">🌅 Early rising</p>
        </div>

        <div className="bg-gradient-lotus p-4 rounded-lg border border-accent/10 divine-glow transition-sacred hover-divine">
          <div className="flex items-center gap-3 mb-2">
            <Moon className="w-5 h-5 text-accent animate-divine-float" />
            <p className="text-sm font-medium text-muted-foreground">Rest Time</p>
          </div>
          <p className="text-2xl font-bold text-accent">
            {activity.sleepTime ? (
              new Date(`2000-01-01T${activity.sleepTime}`).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              })
            ) : "Not set"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">🌙 Peaceful rest</p>
        </div>
      </div>

      {/* Spiritual Progress Indicator */}
      <div className="bg-gradient-sacred p-4 rounded-lg border border-primary/10 divine-glow">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-foreground">Daily Spiritual Progress</h4>
          <span className="text-xs text-muted-foreground">Sacred Journey</span>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">🌅 Morning Prayer</span>
            <div className={`px-2 py-1 rounded-full text-xs ${
              activity.mangalaAarti ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
            }`}>
              {activity.mangalaAarti ? 'Complete' : 'Pending'}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">📿 Japa Practice</span>
            <div className={`px-2 py-1 rounded-full text-xs ${
              activity.japaRounds >= 16 ? 'bg-primary/20 text-primary' : 
              activity.japaRounds > 0 ? 'bg-accent/20 text-accent' : 'bg-muted text-muted-foreground'
            }`}>
              {activity.japaRounds >= 16 ? 'Excellent' : activity.japaRounds > 0 ? 'Good' : 'Not Done'}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">📚 Study Session</span>
            <div className={`px-2 py-1 rounded-full text-xs ${
              activity.lectureDuration >= 30 ? 'bg-primary/20 text-primary' : 
              activity.lectureDuration > 0 ? 'bg-accent/20 text-accent' : 'bg-muted text-muted-foreground'
            }`}>
              {activity.lectureDuration >= 30 ? 'Excellent' : activity.lectureDuration > 0 ? 'Good' : 'Not Done'}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm">🙏 Preaching Contacts</span>
            <div className={`px-2 py-1 rounded-full text-xs ${
              (activity.preachingContacts?.length || 0) > 0 ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
            }`}>
              {(activity.preachingContacts?.length || 0) > 0 ? `${activity.preachingContacts?.length} joined` : 'None'}
            </div>
          </div>
        </div>
      </div>

      {showEditForm && (
        <ActivityForm 
          onClose={() => setShowEditForm(false)} 
          activityId={activity.id}
        />
      )}
    </div>
  );
};