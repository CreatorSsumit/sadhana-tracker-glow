import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Flower2, Sun, Star } from 'lucide-react';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const success = await login(email, password);
    
    if (success) {
      toast({
        title: "प्रणाम 🙏",
        description: "Welcome to your spiritual journey",
      });
    } else {
      toast({
        title: "Authentication Failed",
        description: "Please check your credentials",
        variant: "destructive",
      });
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 gradient-sacred">
      {/* Floating spiritual elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Sun className="absolute top-20 left-20 w-6 h-6 text-primary/20 animate-sacred-pulse" />
        <Flower2 className="absolute top-40 right-32 w-8 h-8 text-primary/30 animate-divine-float" />
        <Star className="absolute bottom-32 left-32 w-4 h-4 text-accent/40 animate-sacred-pulse" />
        <Star className="absolute bottom-20 right-20 w-6 h-6 text-accent/30 animate-divine-float" />
      </div>

      <Card className="w-full max-w-md divine-glow transition-sacred hover-divine animate-lotus-bloom">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Flower2 className="w-16 h-16 text-primary animate-divine-float" />
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl"></div>
            </div>
          </div>
          <CardTitle className="text-3xl font-elegant bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            साधना Report System
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            🕉️ Track your spiritual journey with devotion
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="devotee@temple.org"
                className="transition-sacred focus:divine-glow"
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your sacred password"
                className="transition-sacred focus:divine-glow"
                required
                disabled={loading}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full gradient-divine hover-divine transition-sacred text-primary-foreground font-medium py-6"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Flower2 className="w-4 h-4 animate-spin" />
                  Authenticating...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4" />
                  Enter Sacred Space
                </div>
              )}
            </Button>
          </form>
          <div className="mt-6 p-4 gradient-lotus rounded-lg">
            <p className="text-xs text-muted-foreground text-center font-medium">
              🙏 Demo credentials for testing
            </p>
            <div className="text-xs text-muted-foreground text-center mt-2 space-y-1">
              <p>Admin: admin@sadhna.com / password</p>
              <p>Any registered devotee / password</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};