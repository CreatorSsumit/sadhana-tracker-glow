import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useActivities } from '@/hooks/useActivities';
import { format, subDays, startOfDay } from 'date-fns';
import { Users, TrendingUp, User, Phone, Mail } from 'lucide-react';

export const PreachingReport = () => {
  const { activities } = useActivities();

  // Get preaching data for the last 30 days
  const today = new Date();
  const last30Days = Array.from({ length: 30 }, (_, i) => 
    format(subDays(today, i), 'yyyy-MM-dd')
  ).reverse();

  const preachingData = activities
    .filter(activity => 
      activity.preachingContacts && 
      activity.preachingContacts.length > 0 &&
      last30Days.includes(activity.date)
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalContacts = preachingData.reduce(
    (sum, activity) => sum + (activity.preachingContacts?.length || 0), 
    0
  );

  const uniqueDevotees = new Set(preachingData.map(activity => activity.userId)).size;

  return (
    <Card className="divine-glow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Users className="w-6 h-6" />
          Preaching Activity Report
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-lotus p-4 rounded-lg text-center">
            <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-primary">{totalContacts}</p>
            <p className="text-sm text-muted-foreground">Total Contacts (30 days)</p>
          </div>
          <div className="bg-gradient-lotus p-4 rounded-lg text-center">
            <User className="w-8 h-8 text-accent mx-auto mb-2" />
            <p className="text-2xl font-bold text-accent">{uniqueDevotees}</p>
            <p className="text-sm text-muted-foreground">Active Preachers</p>
          </div>
          <div className="bg-gradient-lotus p-4 rounded-lg text-center">
            <Users className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-primary">
              {totalContacts > 0 ? Math.round(totalContacts / uniqueDevotees * 10) / 10 : 0}
            </p>
            <p className="text-sm text-muted-foreground">Avg Contacts/Devotee</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">Recent Preaching Activity</h3>
          <div className="h-full overflow-y-auto space-y-3">
            {preachingData.slice(0, 10).map((activity) => (
              <div key={activity.id} className="border border-primary/20 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    <span className="font-medium">User ID: {activity.userId}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(activity.date), 'MMM dd, yyyy')}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-accent">
                    {activity.preachingContacts?.length || 0} new contacts added:
                  </p>
                  {activity.preachingContacts?.map((contact) => (
                    <div key={contact.id} className="bg-muted/50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="w-4 h-4 text-primary" />
                        <span className="font-medium">{contact.name}</span>
                      </div>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        {contact.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {contact.phone}
                          </div>
                        )}
                        {/* {contact.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {contact.email}
                          </div>
                        )} */}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            {preachingData.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No preaching activity recorded in the last 30 days
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};