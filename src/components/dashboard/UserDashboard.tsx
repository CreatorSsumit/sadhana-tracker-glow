import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useActivities } from '@/hooks/useActivities';
import { ActivityForm } from './ActivityForm';
import { ActivityCard } from './ActivityCard';

export const UserDashboard = () => {
  const { auth } = useAuth();
  const { activities, getActivityByDate } = useActivities(auth.user?.id);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showActivityForm, setShowActivityForm] = useState(false);

  const selectedDateString = format(selectedDate, 'yyyy-MM-dd');
  const todaysActivity = getActivityByDate(selectedDateString);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {auth.user?.name}</h1>
          <p className="text-muted-foreground">Track your daily spiritual activities</p>
        </div>
        <Button onClick={() => setShowActivityForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Today's Activity
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Activities</p>
                <p className="text-2xl font-bold">{activities.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Mangala Aarti Count</p>
                <p className="text-2xl font-bold">
                  {activities.filter(a => a.mangalaAarti).length}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Japa Rounds</p>
                <p className="text-2xl font-bold">
                  {activities.reduce((sum, a) => sum + a.japaRounds, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
            <CardDescription>View activities for any date</CardDescription>
          </CardHeader>
          <CardContent>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today's Status</CardTitle>
          </CardHeader>
          <CardContent>
            {todaysActivity ? (
              <div className="space-y-2">
                <p className="text-sm text-green-600">✓ Activity recorded for today</p>
                <p className="text-xs text-muted-foreground">
                  Last updated: {format(new Date(todaysActivity.updatedAt), "HH:mm")}
                </p>
              </div>
            ) : (
              <p className="text-sm text-orange-600">⚠ No activity recorded today</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Activity for {format(selectedDate, "PPP")}</CardTitle>
          </CardHeader>
          <CardContent>
            {getActivityByDate(selectedDateString) ? (
              <ActivityCard
                activity={getActivityByDate(selectedDateString)!}
                selectedDate={selectedDateString}
              />
            ) : (
              <p className="text-muted-foreground">No activity recorded for this date</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.slice(-5).reverse().map((activity) => (
                <div key={activity.id} className="border-l-2 border-primary pl-4">
                  <p className="font-medium">{format(new Date(activity.date), "PPP")}</p>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Mangala Aarti: {activity.mangalaAarti ? "Yes" : "No"}</p>
                    <p>Japa Rounds: {activity.japaRounds}</p>
                    <p>Lecture: {activity.lectureDuration} min</p>
                  </div>
                </div>
              ))}
              {activities.length === 0 && (
                <p className="text-muted-foreground">No activities recorded yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {showActivityForm && (
        <ActivityForm onClose={() => setShowActivityForm(false)} />
      )}
    </div>
  );
};