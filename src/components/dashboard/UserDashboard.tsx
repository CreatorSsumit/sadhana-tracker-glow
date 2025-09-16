import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, TrendingUp, Target, Clock, Award, Flower2, Sun, Star } from 'lucide-react';
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
  const totalJapaRounds = activities.reduce((sum, a) => sum + a.japaRounds, 0);
  const totalLectureTime = activities.reduce((sum, a) => sum + a.lectureDuration, 0);
  const mangalaAartiCount = activities.filter(a => a.mangalaAarti).length;

  return (
    <div className="min-h-screen gradient-sacred relative">
      {/* Floating spiritual elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <Sun className="absolute top-20 right-32 w-6 h-6 text-accent/10 animate-sacred-pulse" />
        <Flower2 className="absolute top-1/3 left-16 w-8 h-8 text-primary/15 animate-divine-float" />
        <Star className="absolute bottom-32 right-1/4 w-4 h-4 text-accent/20 animate-sacred-pulse" />
        <div className="absolute top-1/4 right-1/3 text-4xl text-primary/5 animate-divine-float">🕉️</div>
        <div className="absolute bottom-1/4 left-1/4 text-3xl text-accent/8 animate-sacred-pulse">🙏</div>
      </div>

      <div className="relative z-10 space-y-8 p-6">
        {/* Welcome Header */}
        <div className="flex items-center justify-between bg-card/80 backdrop-blur-sm rounded-2xl p-6 divine-glow">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="bg-gradient-divine p-3 rounded-full">
                <Flower2 className="w-8 h-8 text-white animate-divine-float" />
              </div>
              <div className="absolute inset-0 bg-gradient-divine rounded-full blur-xl opacity-30"></div>
            </div>
            <div>
              <h1 className="text-4xl font-elegant bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                प्रणाम, {auth.user?.name}
              </h1>
              <p className="text-lg text-muted-foreground mt-1">🌸 Continue your spiritual journey today</p>
            </div>
          </div>
          <Button 
            onClick={() => setShowActivityForm(true)}
            className="gradient-divine hover-divine transition-sacred text-white font-semibold px-4 py-2 text-sm md:px-6 md:py-3 md:text-base"
          >
            <Plus className="mr-1 h-4 w-4 md:mr-2 md:h-5 md:w-5" />
            <span className="hidden sm:inline">Add Sacred Activity</span>
            <span className="sm:hidden">Add Activity</span>
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <Card className="divine-glow transition-sacred hover-divine bg-gradient-lotus border-accent/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground">Mangala Aarti</CardTitle>
              <Sun className="h-6 w-6 text-accent animate-divine-float" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">{mangalaAartiCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Dawn prayers attended</p>
            </CardContent>
          </Card>

          <Card className="divine-glow transition-sacred hover-divine bg-gradient-lotus border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground">Japa Rounds</CardTitle>
              <Target className="h-6 w-6 text-primary animate-sacred-pulse" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{totalJapaRounds}</div>
              <p className="text-xs text-muted-foreground mt-1">Sacred mantras chanted</p>
            </CardContent>
          </Card>

          <Card className="divine-glow transition-sacred hover-divine bg-gradient-lotus border-accent/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground">Lecture Time</CardTitle>
              <Clock className="h-6 w-6 text-accent animate-divine-float" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">{totalLectureTime}</div>
              <p className="text-xs text-muted-foreground mt-1">Minutes of learning</p>
            </CardContent>
          </Card>

          <Card className="divine-glow transition-sacred hover-divine bg-gradient-lotus border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground">Bhoga Offerings</CardTitle>
              <Flower2 className="h-6 w-6 text-primary animate-sacred-pulse" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{activities.filter(a => a.bhogaOffering).length}</div>
              <p className="text-xs text-muted-foreground mt-1">Sacred food offerings</p>
            </CardContent>
          </Card>

          <Card className="divine-glow transition-sacred hover-divine bg-gradient-lotus border-accent/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground">Preaching</CardTitle>
              <Award className="h-6 w-6 text-accent animate-sacred-pulse" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">
                {activities.reduce((sum, a) => sum + (a.preachingContacts?.length || 0), 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Persons joined</p>
            </CardContent>
          </Card>
        </div>

        {/* Date Selector */}
        <Card className="divine-glow transition-sacred hover-divine bg-card/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <CalendarIcon className="h-5 w-5" />
              Select Sacred Date
            </CardTitle>
            <CardDescription>View your spiritual activities for any date</CardDescription>
          </CardHeader>
          <CardContent>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal py-6 border-primary/20 hover:border-primary/50 transition-sacred",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : <span>Pick a sacred date</span>}
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

        {/* Preaching Activities Card */}
        <Card className="divine-glow transition-sacred hover-divine bg-card/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Award className="h-5 w-5 animate-sacred-pulse" />
              Preaching Activities Summary
            </CardTitle>
            <CardDescription>Your efforts in spreading Krishna consciousness</CardDescription>
          </CardHeader>
          <CardContent>
            {/* List of All Joined Persons */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Star className="w-4 h-4 text-primary" />
                All Joined Persons with Contact Details
              </h3>
              <div className="max-h-64 overflow-y-auto space-y-3">
                {activities
                  .filter(activity => activity.preachingContacts && activity.preachingContacts.length > 0)
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((activity) => (
                    <div key={activity.id} className="border border-primary/20 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-accent">{format(new Date(activity.date), "MMM dd, yyyy")}</span>
                        <span className="text-xs bg-gradient-lotus px-2 py-1 rounded-full text-primary">
                          {activity.preachingContacts?.length || 0} contacts
                        </span>
                      </div>
                      <div className="space-y-2">
                        {activity.preachingContacts?.map((contact) => (
                          <div key={contact.id} className="bg-muted/30 p-2 rounded-lg flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Star className="w-3 h-3 text-primary" />
                              <span className="font-medium text-sm">{contact.name}</span>
                            </div>
                            <div className="flex gap-3 text-xs text-muted-foreground">
                              {contact.phone && (
                                <span className="flex items-center gap-1">
                                  📞 {contact.phone}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                
                {activities.filter(a => a.preachingContacts && a.preachingContacts.length > 0).length === 0 && (
                  <div className="text-center py-6 space-y-2">
                    <div className="text-3xl opacity-50">🙏</div>
                    <p className="text-sm text-muted-foreground">No preaching contacts recorded yet</p>
                    <p className="text-xs text-muted-foreground">Start spreading Krishna consciousness and record your contacts</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Today's Status */}
          <div className="space-y-6">
            <Card className="divine-glow transition-sacred hover-divine bg-card/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-accent">
                  <TrendingUp className="h-5 w-5" />
                  Today's Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                {todaysActivity ? (
                  <div className="space-y-3 text-center">
                    <div className="text-6xl animate-sacred-pulse">✨</div>
                    <p className="text-sm text-green-600 font-medium">Sacred activity completed today!</p>
                    <p className="text-xs text-muted-foreground">
                      Last updated: {format(new Date(todaysActivity.updatedAt), "HH:mm")}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 text-center">
                    <div className="text-6xl animate-sacred-pulse">🌅</div>
                    <p className="text-sm text-orange-600 font-medium">Awaiting today's sacred practice</p>
                    <p className="text-xs text-muted-foreground">Begin your spiritual journey today</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Activity Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="divine-glow transition-sacred hover-divine bg-card/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Star className="h-5 w-5 animate-sacred-pulse" />
                  Activity for {format(selectedDate, "PPP")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {getActivityByDate(selectedDateString) ? (
                  <ActivityCard
                    activity={getActivityByDate(selectedDateString)!}
                    selectedDate={selectedDateString}
                  />
                ) : (
                  <div className="text-center py-12 space-y-4">
                    <div className="text-6xl opacity-50">🙏</div>
                    <p className="text-muted-foreground">No sacred activity recorded for this date</p>
                    <p className="text-sm text-muted-foreground">Every day is an opportunity for spiritual growth</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="divine-glow transition-sacred hover-divine bg-card/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-accent">
                  <Flower2 className="h-5 w-5 animate-divine-float" />
                  Recent Sacred Journey
                </CardTitle>
                <CardDescription>Your latest spiritual practices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.slice(-5).reverse().map((activity, index) => (
                    <div key={activity.id} className="relative">
                      <div className="flex items-start gap-4 p-4 rounded-lg bg-gradient-lotus border border-primary/10 transition-sacred hover-divine">
                        <div className="bg-gradient-divine p-2 rounded-full">
                          <span className="text-white text-sm font-bold">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{format(new Date(activity.date), "PPP")}</p>
                          <div className="text-sm text-muted-foreground space-y-1 mt-2">
                            <p className="flex items-center gap-2">
                              <Sun className="w-3 h-3" />
                              Mangala Aarti: {activity.mangalaAarti ? "🌅 Attended" : "⏰ Missed"}
                            </p>
                            <p className="flex items-center gap-2">
                              <Target className="w-3 h-3" />
                              Japa Rounds: {activity.japaRounds} rounds
                            </p>
                            <p className="flex items-center gap-2">
                              <Clock className="w-3 h-3" />
                              Lecture: {activity.lectureDuration} minutes
                            </p>
                            <p className="flex items-center gap-2">
                              <Flower2 className="w-3 h-3" />
                              Bhoga: {activity.bhogaOffering ? "🍽️ Offered" : "⏰ Not offered"}
                            </p>
                            {activity.preachingContacts && activity.preachingContacts.length > 0 && (
                              <p className="flex items-center gap-2">
                                <Award className="w-3 h-3" />
                                Preaching: {activity.preachingContacts.length} contacts
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {activities.length === 0 && (
                    <div className="text-center py-8 space-y-4">
                      <div className="text-4xl opacity-50">🌱</div>
                      <p className="text-muted-foreground">Begin your spiritual journey today</p>
                      <p className="text-sm text-muted-foreground">Record your first sacred activity to see progress here</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Detailed Preaching Contacts List */}
            <Card className="divine-glow transition-sacred hover-divine bg-card/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Award className="h-5 w-5 animate-sacred-pulse" />
                  Preaching Contact Details for {format(selectedDate, "PPP")}
                </CardTitle>
                <CardDescription>Contacts made during preaching activities on selected date</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {activities
                    .filter(activity => 
                      activity.preachingContacts && 
                      activity.preachingContacts.length > 0 && 
                      activity.date === selectedDateString
                    )
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((activity) => (
                      <div key={activity.id} className="border border-primary/20 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-semibold text-foreground">{format(new Date(activity.date), "PPP")}</h4>
                          <span className="text-sm bg-gradient-lotus px-3 py-1 rounded-full text-primary">
                            {activity.preachingContacts?.length || 0} contacts
                          </span>
                        </div>
                        <div className="space-y-2">
                          {activity.preachingContacts?.map((contact) => (
                            <div key={contact.id} className="bg-muted/50 p-3 rounded-lg">
                              <div className="flex items-center gap-2 mb-1">
                                <Star className="w-4 h-4 text-primary" />
                                <span className="font-medium">{contact.name}</span>
                              </div>
                              <div className="flex gap-4 text-sm text-muted-foreground">
                                {contact.phone && (
                                  <span>📞 {contact.phone}</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  
                  {activities.filter(a => a.preachingContacts && a.preachingContacts.length > 0 && a.date === selectedDateString).length === 0 && (
                    <div className="text-center py-8 space-y-4">
                      <div className="text-4xl opacity-50">🙏</div>
                      <p className="text-muted-foreground">No preaching contacts recorded for this date</p>
                      <p className="text-sm text-muted-foreground">Select a different date or add preaching activities</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {showActivityForm && (
        <ActivityForm onClose={() => setShowActivityForm(false)} />
      )}
    </div>
  );
};