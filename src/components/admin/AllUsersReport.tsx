import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useActivities } from '@/hooks/useActivities';
import { User, Activity, PreachingContact } from '@/types';
import { format } from 'date-fns';
import { Eye, Users, Phone } from 'lucide-react';

interface AllUsersReportProps {
  searchTerm: string;
  dateRange: { start: string; end: string };
}

export const AllUsersReport = ({ searchTerm, dateRange }: AllUsersReportProps) => {
  const { activities } = useActivities();
  const users: User[] = JSON.parse(localStorage.getItem('sadhna_users') || '[]')
    .filter((u: User) => u.role !== 'admin');
  const [selectedContacts, setSelectedContacts] = useState<PreachingContact[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredData = useMemo(() => {
    let filteredActivities = activities;
    let filteredUsers = users;

    // Filter users by search term
    if (searchTerm) {
      filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter activities by date range
    if (dateRange.start && dateRange.end) {
      filteredActivities = activities.filter(activity => 
        activity.date >= dateRange.start && activity.date <= dateRange.end
      );
    }

    // Filter activities by filtered users
    if (searchTerm) {
      const userIds = filteredUsers.map(u => u.id);
      filteredActivities = filteredActivities.filter(a => userIds.includes(a.userId));
    }

    return { users: filteredUsers, activities: filteredActivities };
  }, [users, activities, searchTerm, dateRange]);

  const getUserStats = (userId: string) => {
    const userActivities = filteredData.activities.filter(a => a.userId === userId);
    const allContacts = userActivities.flatMap(a => a.preachingContacts || []);
    return {
      totalActivities: userActivities.length,
      mangalaAartiCount: userActivities.filter(a => a.mangalaAarti).length,
      totalJapaRounds: userActivities.reduce((sum, a) => sum + a.japaRounds, 0),
      totalLectureDuration: userActivities.reduce((sum, a) => sum + a.lectureDuration, 0),
      preachingContacts: allContacts.length,
      preachingContactsList: allContacts,
    };
  };

  const handleViewContacts = (contacts: PreachingContact[]) => {
    setSelectedContacts(contacts);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>All Users Overview</CardTitle>
          <CardDescription>
            Summary of all devotees and their activities
            {(searchTerm || dateRange.start || dateRange.end) && " (filtered)"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Total Activities</TableHead>
                <TableHead>Mangala Aarti</TableHead>
                <TableHead>Total Japa Rounds</TableHead>
                <TableHead>Lecture Duration</TableHead>
                <TableHead>Preaching Contacts</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.users.map((user) => {
                const stats = getUserStats(user.id);
                return (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{stats.totalActivities}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={stats.mangalaAartiCount > 0 ? "default" : "outline"}>
                        {stats.mangalaAartiCount}
                      </Badge>
                    </TableCell>
                    <TableCell>{stats.totalJapaRounds}</TableCell>
                    <TableCell>{stats.totalLectureDuration} min</TableCell>
                    <TableCell>
                      {stats.preachingContacts > 0 ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewContacts(stats.preachingContactsList)}
                          className="flex items-center gap-1 h-8 px-2 text-primary hover:text-primary"
                        >
                          <Eye className="w-4 h-4" />
                          {stats.preachingContacts}
                        </Button>
                      ) : (
                        <span className="text-muted-foreground">0</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredData.users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>Latest activity reports from all users</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Mangala Aarti</TableHead>
                <TableHead>Japa Rounds</TableHead>
                <TableHead>Lecture Duration</TableHead>
                <TableHead>Wake Up</TableHead>
                <TableHead>Sleep</TableHead>
                <TableHead>Preaching</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.activities
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 20)
                .map((activity) => {
                  const user = users.find(u => u.id === activity.userId);
                  return (
                    <TableRow key={activity.id}>
                      <TableCell>{format(new Date(activity.date), "MMM dd, yyyy")}</TableCell>
                      <TableCell className="font-medium">{user?.name || "Unknown"}</TableCell>
                      <TableCell>
                        <Badge variant={activity.mangalaAarti ? "default" : "outline"}>
                          {activity.mangalaAarti ? "Yes" : "No"}
                        </Badge>
                      </TableCell>
                      <TableCell>{activity.japaRounds}</TableCell>
                      <TableCell>{activity.lectureDuration} min</TableCell>
                      <TableCell>{activity.wakeUpTime || "-"}</TableCell>
                      <TableCell>{activity.sleepTime || "-"}</TableCell>
                      <TableCell>
                        {activity.preachingContacts && activity.preachingContacts.length > 0 ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewContacts(activity.preachingContacts)}
                            className="flex items-center gap-1 h-8 px-2 text-primary hover:text-primary"
                          >
                            <Eye className="w-4 h-4" />
                            {activity.preachingContacts.length}
                          </Button>
                        ) : (
                          <span className="text-muted-foreground">0</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              {filteredData.activities.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground">
                    No activities found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Preaching Contacts Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-primary">
              <Users className="w-5 h-5" />
              Preaching Contacts ({selectedContacts.length})
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            {selectedContacts.length > 0 ? (
              selectedContacts.map((contact) => (
                <div key={contact.id} className="bg-muted/50 p-3 rounded-lg border border-primary/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="font-medium text-foreground">{contact.name}</span>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    {contact.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3 h-3" />
                        {contact.phone}
                      </div>
                    )}
                    <div className="text-xs">
                      Added: {format(new Date(contact.addedDate), 'MMM dd, yyyy')}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-4">No contacts found</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};