import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Sprout, ShoppingCart } from "lucide-react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  userType: 'farmer' | 'buyer';
}

export default function LoginModal({ isOpen, onClose, userType }: LoginModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const createUserMutation = useMutation({
    mutationFn: async (userData: any) => {
      const response = await apiRequest("POST", "/api/users", userData);
      return response.json();
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Starting authentication for:', { email, userType, isSignUp });
      
      if (isSignUp) {
        // Create Firebase user first
        console.log('Creating Firebase user...');
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;
        console.log('Firebase user created:', firebaseUser.uid);
        
        // Then create user record in our database
        console.log('Creating user record in database...');
        const userData = {
          email: firebaseUser.email,
          password: password, // Include password for backend validation
          name,
          location: location || null,
          userType,
        };
        console.log('User data to save:', userData);
        
        await createUserMutation.mutateAsync(userData);
        console.log('User record created successfully');

        toast({
          title: "Account created successfully!",
          description: `Welcome to ROOTED, ${name}!`,
        });
      } else {
        // Sign in existing user
        console.log('Signing in existing user...');
        await signInWithEmailAndPassword(auth, email, password);
        console.log('User signed in successfully');
        
        toast({
          title: "Logged in successfully!",
          description: `Welcome back!`,
        });
      }
      
      // Redirect to appropriate dashboard
      setTimeout(() => {
        if (userType === 'farmer') {
          window.location.href = '/farmer-dashboard';
        } else {
          window.location.href = '/buyer-marketplace';
        }
      }, 1000);
      
      onClose();
    } catch (error: any) {
      console.error('Authentication error:', error);
      let errorMessage = "Please check your credentials and try again.";
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "An account with this email already exists.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "Password should be at least 6 characters.";
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = "No account found with this email.";
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = "Incorrect password.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Please enter a valid email address.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: isSignUp ? "Sign up failed" : "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setLocation("");
  };

  const handleToggleMode = () => {
    setIsSignUp(!isSignUp);
    resetForm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {userType === 'farmer' ? (
              <Sprout className="h-5 w-5 text-rooted-primary" />
            ) : (
              <ShoppingCart className="h-5 w-5 text-rooted-primary" />
            )}
            {isSignUp ? 'Sign Up' : 'Login'} as {userType === 'farmer' ? 'Farmer' : 'Buyer'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  type="text"
                  placeholder="Enter your location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>
            </>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-rooted-primary hover:bg-rooted-secondary"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Login')}
          </Button>

          <div className="text-center">
            <Button
              type="button"
              variant="link"
              onClick={handleToggleMode}
              className="text-rooted-primary"
            >
              {isSignUp 
                ? 'Already have an account? Login' 
                : "Don't have an account? Sign up"
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
