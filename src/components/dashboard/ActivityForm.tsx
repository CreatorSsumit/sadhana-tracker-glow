import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { useActivities } from '@/hooks/useActivities';
import { useToast } from '@/hooks/use-toast';

interface ActivityFormProps {
  onClose: () => void;
  activityId?: string;
}

export const ActivityForm = ({ onClose, activityId }: ActivityFormProps) => {
  const { auth } = useAuth();
  const { addActivity, updateActivity, getActivityByDate, canEditActivity } = useActivities(auth.user?.id);
  const { toast } = useToast();
  
  const today = new Date().toISOString().split('T')[0];
  const [formData, setFormData] = useState({
    mangalaAarti: false,
    japaRounds: 0,
    lectureDuration: 0,
    wakeUpTime: '',
    sleepTime: '',
  });

  useEffect(() => {
    if (activityId) {
      const activity = getActivityByDate(today);
      if (activity) {
        setFormData({
          mangalaAarti: activity.mangalaAarti,
          japaRounds: activity.japaRounds,
          lectureDuration: activity.lectureDuration,
          wakeUpTime: activity.wakeUpTime,
          sleepTime: activity.sleepTime,
        });
      }
    }
  }, [activityId, getActivityByDate, today]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canEditActivity(today)) {
      toast({
        title: "Cannot Edit",
        description: "You can only edit today's activities",
        variant: "destructive",
      });
      return;
    }

    const existingActivity = getActivityByDate(today);
    
    if (existingActivity) {
      updateActivity(existingActivity.id, formData);
      toast({
        title: "Activity Updated",
        description: "Your activity has been updated successfully",
      });
    } else {
      addActivity({
        userId: auth.user!.id,
        date: today,
        ...formData,
      });
      toast({
        title: "Activity Added",
        description: "Your activity has been recorded successfully",
      });
    }
    
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {getActivityByDate(today) ? "Update Today's Activity" : "Add Today's Activity"}
          </DialogTitle>
          <DialogDescription>
            Record your spiritual activities for today ({today})
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="mangalaAarti"
              checked={formData.mangalaAarti}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, mangalaAarti: checked }))
              }
            />
            <Label htmlFor="mangalaAarti">Attended Mangala Aarti</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="japaRounds">Japa Rounds</Label>
            <Input
              id="japaRounds"
              type="number"
              min="0"
              value={formData.japaRounds}
              onChange={(e) => 
                setFormData(prev => ({ ...prev, japaRounds: parseInt(e.target.value) || 0 }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lectureDuration">Morning Lecture Duration (minutes)</Label>
            <Input
              id="lectureDuration"
              type="number"
              min="0"
              value={formData.lectureDuration}
              onChange={(e) => 
                setFormData(prev => ({ ...prev, lectureDuration: parseInt(e.target.value) || 0 }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="wakeUpTime">Wake Up Time</Label>
            <Input
              id="wakeUpTime"
              type="time"
              value={formData.wakeUpTime}
              onChange={(e) => 
                setFormData(prev => ({ ...prev, wakeUpTime: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sleepTime">Sleep Time</Label>
            <Input
              id="sleepTime"
              type="time"
              value={formData.sleepTime}
              onChange={(e) => 
                setFormData(prev => ({ ...prev, sleepTime: e.target.value }))
              }
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              {getActivityByDate(today) ? "Update Activity" : "Save Activity"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};