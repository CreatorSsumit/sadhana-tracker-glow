import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Flower2, Sun, Star, UserPlus } from 'lucide-react';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export const RegisterForm = ({ onSwitchToLogin }: RegisterFormProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { registerUser } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const success = await registerUser(name, email);
    
    if (success) {
      toast({
        title: "🙏 Registration Successful",
        description: `Welcome to the spiritual journey, ${name}!`,
      });
      onSwitchToLogin();
    } else {
      toast({
        title: "Registration Failed",
        description: "A devotee with this email already exists",
        variant: "destructive",
      });
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 gradient-sacred relative overflow-hidden">
      {/* Sacred background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-sacred-pulse"></div>
        <div className="absolute bottom-32 right-20 w-40 h-40 bg-accent/5 rounded-full blur-3xl animate-divine-float"></div>
        <Sun className="absolute top-32 right-32 w-6 h-6 text-primary/20 animate-sacred-pulse" />
        <Flower2 className="absolute top-1/2 left-16 w-8 h-8 text-accent/25 animate-divine-float" />
        <Star className="absolute bottom-40 left-40 w-4 h-4 text-primary/30 animate-sacred-pulse" />
        <Star className="absolute top-1/4 right-20 w-5 h-5 text-accent/20 animate-divine-float" />
        
        {/* Floating sacred symbols */}
        <div className="absolute top-1/3 left-1/4 text-6xl text-primary/5 animate-divine-float">🕉️</div>
        <div className="absolute bottom-1/4 right-1/3 text-4xl text-accent/10 animate-sacred-pulse">🙏</div>
      </div>

      <Card className="w-full max-w-lg divine-glow transition-sacred hover-divine animate-lotus-bloom relative z-10">
        <CardHeader className="text-center space-y-6 pb-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-divine rounded-full blur-2xl opacity-40 animate-sacred-pulse"></div>
              <div className="relative bg-gradient-divine p-4 rounded-full">
                <UserPlus className="w-12 h-12 text-white animate-divine-float" />
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <CardTitle className="text-4xl font-elegant bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Join Our Sacred Community
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground leading-relaxed">
              🌸 Begin your spiritual journey with us <br />
              Register as a devoted practitioner
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="name" className="text-sm font-medium text-foreground">
                Devotee Name
              </Label>
              <div className="relative">
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your spiritual name"
                  className="pl-4 pr-12 py-6 text-lg transition-sacred focus:divine-glow border-primary/20 focus:border-primary/50"
                  required
                  disabled={loading}
                />
                <Flower2 className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary/50" />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Sacred Email
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@temple.org"
                  className="pl-4 pr-12 py-6 text-lg transition-sacred focus:divine-glow border-primary/20 focus:border-primary/50"
                  required
                  disabled={loading}
                />
                <Sun className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-accent/50" />
              </div>
            </div>

            <div className="bg-gradient-lotus p-4 rounded-lg border border-primary/10">
              <p className="text-sm text-muted-foreground text-center">
                🔐 Default password: <code className="bg-primary/10 px-2 py-1 rounded font-mono">password</code>
              </p>
              <p className="text-xs text-muted-foreground text-center mt-2">
                You can change this after your first login
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full gradient-divine hover-divine transition-sacred text-white font-semibold py-6 text-lg"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <Flower2 className="w-5 h-5 animate-spin" />
                  Creating Sacred Account...
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <UserPlus className="w-5 h-5" />
                  Join Sacred Community
                </div>
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-primary/20" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-card px-4 text-muted-foreground">Already a devotee?</span>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={onSwitchToLogin}
            className="w-full py-6 border-primary/20 hover:border-primary/50 transition-sacred text-lg"
            disabled={loading}
          >
            <Star className="w-5 h-5 mr-3 text-accent" />
            Return to Sacred Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};