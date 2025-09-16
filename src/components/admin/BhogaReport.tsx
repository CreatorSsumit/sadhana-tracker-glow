import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useActivities } from '@/hooks/useActivities';
import { format, isToday, isTomorrow, addDays } from 'date-fns';
import { UtensilsCrossed, Calendar, User } from 'lucide-react';

export const BhogaReport = () => {
  const { activities } = useActivities();

  // Get today's and upcoming bhoga offerings
  const today = new Date();
  const upcomingDays = Array.from({ length: 7 }, (_, i) => addDays(today, i));
  
  const getBhogaOfferingsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return activities.filter(activity => 
      activity.date === dateStr && activity.bhogaOffering
    );
  };

  return (
    <Card className="divine-glow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-accent">
          <UtensilsCrossed className="w-6 h-6" />
          Bhoga Offering Schedule
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {upcomingDays.map((date) => {
          const offerings = getBhogaOfferingsForDate(date);
          const dateLabel = isToday(date) ? 'Today' : 
                           isTomorrow(date) ? 'Tomorrow' : 
                           format(date, 'MMM dd, yyyy');
          
          return (
            <div key={date.toISOString()} className="border border-primary/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-4 h-4 text-primary" />
                <h3 className="font-semibold">{dateLabel}</h3>
                <span className="text-sm text-muted-foreground">
                  ({format(date, 'EEEE')})
                </span>
              </div>
              
              {offerings.length > 0 ? (
                <div className="space-y-2">
                  {offerings.map((activity) => {
                    // Get user name from activity (you may need to fetch user details)
                    return (
                      <div key={activity.id} className="flex items-center gap-2 p-2 bg-accent/10 rounded">
                        <User className="w-4 h-4 text-accent" />
                        <span className="font-medium">User ID: {activity.userId}</span>
                        <span className="text-sm text-muted-foreground">offering bhoga</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  No bhoga offerings scheduled
                </p>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};