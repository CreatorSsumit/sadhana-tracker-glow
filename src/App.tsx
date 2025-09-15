import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { AuthPage } from "@/components/auth/AuthPage";
import { UserDashboard } from "@/components/dashboard/UserDashboard";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { Button } from "@/components/ui/button";
import { LogOut, Flower2, Sun, Star } from "lucide-react";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const MainApp = () => {
  const { auth, logout, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-sacred">
        <div className="text-center space-y-4">
          <Flower2 className="w-12 h-12 text-primary animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading your spiritual journey...</p>
        </div>
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen gradient-sacred">
      <header className="border-b border-border/50 bg-card/95 backdrop-blur-sm divine-glow">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Flower2 className="w-8 h-8 text-primary animate-divine-float" />
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg"></div>
            </div>
            <div>
              <h1 className="text-2xl font-elegant bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                साधना Report System
              </h1>
              <p className="text-xs text-muted-foreground">Spiritual Journey Tracker</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">
                प्रणाम, {auth.user?.name}
              </p>
              <p className="text-xs text-muted-foreground capitalize">
                {auth.user?.role === 'admin' ? '🔱 Administrator' : '🕉️ Devotee'}
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={logout}
              className="transition-sacred hover-divine border-primary/20"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Exit Sacred Space
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        {auth.user?.role === 'admin' ? <AdminDashboard /> : <UserDashboard />}
      </main>

      {/* Floating spiritual elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <Sun className="absolute top-32 right-20 w-4 h-4 text-accent/20 animate-sacred-pulse" />
        <Star className="absolute top-1/2 left-10 w-3 h-3 text-primary/30 animate-divine-float" />
        <Flower2 className="absolute bottom-20 right-32 w-5 h-5 text-accent/25 animate-sacred-pulse" />
      </div>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainApp />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
