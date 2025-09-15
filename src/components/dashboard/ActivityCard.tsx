import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit } from 'lucide-react';
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant={activity.mangalaAarti ? "default" : "secondary"}>
            Mangala Aarti: {activity.mangalaAarti ? "Attended" : "Not Attended"}
          </Badge>
          {canEditActivity(selectedDate) && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowEditForm(true)}
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Japa Rounds</p>
          <p className="text-lg font-semibold">{activity.japaRounds}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Lecture Duration</p>
          <p className="text-lg font-semibold">{activity.lectureDuration} min</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Wake Up Time</p>
          <p className="text-lg font-semibold">{activity.wakeUpTime || "Not set"}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Sleep Time</p>
          <p className="text-lg font-semibold">{activity.sleepTime || "Not set"}</p>
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