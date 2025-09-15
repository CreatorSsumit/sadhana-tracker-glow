import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { useActivities } from '@/hooks/useActivities';
import { useToast } from '@/hooks/use-toast';
import { Flower2, Sun, Target, Clock, Moon, Save, X } from 'lucide-react';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canEditActivity(today)) {
      toast({
        title: "🚫 Cannot Edit",
        description: "You can only edit today's sacred activities",
        variant: "destructive",
      });
      return;
    }

    const existingActivity = getActivityByDate(today);
    
    if (existingActivity) {
      await updateActivity(existingActivity.id, formData);
      toast({
        title: "✨ Activity Updated",
        description: "Your sacred practice has been updated successfully",
      });
    } else {
      await addActivity({
        userId: auth.user!.id,
        date: today,
        ...formData,
      });
      toast({
        title: "🙏 Activity Recorded",
        description: "Your spiritual journey continues with divine blessings",
      });
    }
    
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl divine-glow bg-card/95 backdrop-blur-sm border-primary/20">
        <DialogHeader className="space-y-4 pb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <div className="bg-gradient-divine p-3 rounded-full">
                <Flower2 className="w-8 h-8 text-white animate-divine-float" />
              </div>
              <div className="absolute inset-0 bg-gradient-divine rounded-full blur-xl opacity-30"></div>
            </div>
          </div>
          
          <DialogTitle className="text-2xl font-elegant text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {getActivityByDate(today) ? "🌸 Update Sacred Practice" : "🌅 Record Divine Activity"}
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            Document your spiritual journey for today ({new Date(today).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })})
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Mangala Aarti */}
          <div className="bg-gradient-lotus p-4 rounded-lg border border-primary/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sun className="w-6 h-6 text-primary animate-sacred-pulse" />
                <div>
                  <Label htmlFor="mangalaAarti" className="text-base font-medium text-foreground">
                    Mangala Aarti Attendance
                  </Label>
                  <p className="text-sm text-muted-foreground">Did you attend the dawn prayer ceremony?</p>
                </div>
              </div>
              <Switch
                id="mangalaAarti"
                checked={formData.mangalaAarti}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, mangalaAarti: checked }))
                }
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </div>

          {/* Japa Rounds */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              <Label htmlFor="japaRounds" className="text-base font-medium text-foreground">
                Sacred Japa Rounds
              </Label>
            </div>
            <div className="relative">
              <Input
                id="japaRounds"
                type="number"
                min="0"
                max="108"
                value={formData.japaRounds}
                onChange={(e) => 
                  setFormData(prev => ({ ...prev, japaRounds: parseInt(e.target.value) || 0 }))
                }
                className="pl-4 pr-16 py-3 text-lg transition-sacred focus:divine-glow border-primary/20"
                placeholder="Enter rounds completed"
              />
              <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                rounds
              </span>
            </div>
            <p className="text-xs text-muted-foreground">📿 Traditional goal: 16 rounds daily</p>
          </div>

          {/* Lecture Duration */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-accent" />
              <Label htmlFor="lectureDuration" className="text-base font-medium text-foreground">
                Morning Lecture Duration
              </Label>
            </div>
            <div className="relative">
              <Input
                id="lectureDuration"
                type="number"
                min="0"
                max="180"
                value={formData.lectureDuration}
                onChange={(e) => 
                  setFormData(prev => ({ ...prev, lectureDuration: parseInt(e.target.value) || 0 }))
                }
                className="pl-4 pr-20 py-3 text-lg transition-sacred focus:divine-glow border-accent/20"
                placeholder="Minutes of spiritual learning"
              />
              <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                minutes
              </span>
            </div>
            <p className="text-xs text-muted-foreground">📚 Daily spiritual education time</p>
          </div>

          {/* Time Schedule */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Sun className="w-5 h-5 text-primary" />
                <Label htmlFor="wakeUpTime" className="text-base font-medium text-foreground">
                  Sacred Wake Time
                </Label>
              </div>
              <Input
                id="wakeUpTime"
                type="time"
                value={formData.wakeUpTime}
                onChange={(e) => 
                  setFormData(prev => ({ ...prev, wakeUpTime: e.target.value }))
                }
                className="py-3 text-lg transition-sacred focus:divine-glow border-primary/20"
              />
              <p className="text-xs text-muted-foreground">🌅 Early rising for spiritual practice</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Moon className="w-5 h-5 text-accent" />
                <Label htmlFor="sleepTime" className="text-base font-medium text-foreground">
                  Rest Time
                </Label>
              </div>
              <Input
                id="sleepTime"
                type="time"
                value={formData.sleepTime}
                onChange={(e) => 
                  setFormData(prev => ({ ...prev, sleepTime: e.target.value }))
                }
                className="py-3 text-lg transition-sacred focus:divine-glow border-accent/20"
              />
              <p className="text-xs text-muted-foreground">🌙 Rest for tomorrow's practice</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button 
              type="submit" 
              className="flex-1 gradient-divine hover-divine transition-sacred text-white font-semibold py-4 text-lg"
            >
              <Save className="w-5 h-5 mr-2" />
              {getActivityByDate(today) ? "Update Sacred Record" : "Save Divine Practice"}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="px-6 py-4 border-primary/20 hover:border-primary/50 transition-sacred"
            >
              <X className="w-5 h-5 mr-2" />
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};