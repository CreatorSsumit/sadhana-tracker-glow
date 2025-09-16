import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Users, Activity, Crown, TrendingUp, Calendar, Filter, Flower2, Sun, Star } from 'lucide-react';
import { UserRegistrationForm } from './UserRegistrationForm';
import { AllUsersReport } from './AllUsersReport';
import { BhogaReport } from './BhogaReport';
import { PreachingReport } from './PreachingReport';
import { useActivities } from '@/hooks/useActivities';

export const AdminDashboard = () => {
  const [showUserForm, setShowUserForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const { activities } = useActivities();
  
  const users = JSON.parse(localStorage.getItem('sadhna_users') || '[]');
  const regularUsers = users.filter((u: any) => u.role !== 'admin');
  const todaysActivities = activities.filter(a => a.date === new Date().toISOString().split('T')[0]);
  const totalJapaRounds = activities.reduce((sum, a) => sum + a.japaRounds, 0);
  const averageJapaPerUser = regularUsers.length > 0 ? Math.round(totalJapaRounds / regularUsers.length) : 0;

  return (
    <div className="min-h-screen gradient-sacred relative">
      {/* Floating sacred elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <Crown className="absolute top-20 right-20 w-8 h-8 text-primary/10 animate-sacred-pulse" />
        <Flower2 className="absolute top-1/3 left-20 w-6 h-6 text-accent/15 animate-divine-float" />
        <Star className="absolute bottom-32 right-1/3 w-5 h-5 text-primary/20 animate-sacred-pulse" />
        <div className="absolute top-1/4 right-1/4 text-5xl text-accent/5 animate-divine-float">🔱</div>
        <div className="absolute bottom-1/3 left-1/3 text-3xl text-primary/8 animate-sacred-pulse">⚡</div>
      </div>

      <div className="relative z-10 space-y-8 p-6">
        {/* Admin Header */}
        <div className="flex items-center justify-between bg-card/80 backdrop-blur-sm rounded-2xl p-6 divine-glow">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="bg-gradient-divine p-3 rounded-full">
                <Crown className="w-8 h-8 text-white animate-sacred-pulse" />
              </div>
              <div className="absolute inset-0 bg-gradient-divine rounded-full blur-xl opacity-30"></div>
            </div>
            <div>
              <h1 className="text-4xl font-elegant bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                🔱 Sacred Administration
              </h1>
              <p className="text-lg text-muted-foreground mt-1">Oversee the spiritual community & divine reports</p>
            </div>
          </div>
          <Button 
            onClick={() => setShowUserForm(true)}
            className="gradient-divine hover-divine transition-sacred text-white font-semibold px-6 py-3"
          >
            <Plus className="mr-2 h-5 w-5" />
            Register New Devotee
          </Button>
        </div>

        {/* Sacred Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="divine-glow transition-sacred hover-divine bg-gradient-lotus border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground">Sacred Community</CardTitle>
              <Users className="h-6 w-6 text-primary animate-divine-float" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{regularUsers.length}</div>
              <p className="text-xs text-muted-foreground mt-1">🙏 Registered devotees</p>
            </CardContent>
          </Card>

          <Card className="divine-glow transition-sacred hover-divine bg-gradient-lotus border-accent/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground">Divine Activities</CardTitle>
              <Activity className="h-6 w-6 text-accent animate-sacred-pulse" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">{activities.length}</div>
              <p className="text-xs text-muted-foreground mt-1">✨ Total spiritual practices</p>
            </CardContent>
          </Card>

          <Card className="divine-glow transition-sacred hover-divine bg-gradient-lotus border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground">Today's Devotion</CardTitle>
              <Sun className="h-6 w-6 text-primary animate-divine-float" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{todaysActivities.length}</div>
              <p className="text-xs text-muted-foreground mt-1">🌅 Activities recorded today</p>
            </CardContent>
          </Card>

          <Card className="divine-glow transition-sacred hover-divine bg-gradient-lotus border-accent/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground">Avg. Japa Rounds</CardTitle>
              <TrendingUp className="h-6 w-6 text-accent animate-sacred-pulse" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">{averageJapaPerUser}</div>
              <p className="text-xs text-muted-foreground mt-1">📿 Per devotee average</p>
            </CardContent>
          </Card>
        </div>

        {/* Sacred Filters */}
        <Card className="divine-glow transition-sacred hover-divine bg-card/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Filter className="h-5 w-5" />
              Sacred Filters & Divine Search
            </CardTitle>
            <CardDescription>Filter devotee reports by date range and search through the community</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Input
                  placeholder="Search devotees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-4 pr-10 py-3 transition-sacred focus:divine-glow border-primary/20"
                />
                <Users className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary/50" />
              </div>
              
              <div className="relative">
                <Input
                  type="date"
                  placeholder="Start date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="py-3 transition-sacred focus:divine-glow border-primary/20"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-accent/50 pointer-events-none" />
              </div>
              
              <div className="relative">
                <Input
                  type="date"
                  placeholder="End date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="py-3 transition-sacred focus:divine-glow border-primary/20"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-accent/50 pointer-events-none" />
              </div>
              
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setDateRange({ start: '', end: '' });
                }}
                className="py-3 border-primary/20 hover:border-primary/50 transition-sacred"
              >
                <Star className="w-4 h-4 mr-2 text-primary" />
                Clear Sacred Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Reports Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BhogaReport />
          <PreachingReport />
        </div>

        {/* Sacred Reports */}
        <AllUsersReport 
          searchTerm={searchTerm}
          dateRange={dateRange}
        />
      </div>

      {showUserForm && (
        <UserRegistrationForm onClose={() => setShowUserForm(false)} />
      )}
    </div>
  );
};