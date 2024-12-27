import { useState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { User, Lock, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { FirebaseError } from 'firebase/app';

interface RegisterFormProps {
  onSignInClick: () => void;
  onOpenChange?: (open: boolean) => void;
  loading?: boolean;
}

export function RegisterForm({ onSignInClick, onOpenChange = () => {}, loading: externalLoading = false }: RegisterFormProps) {
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await register(email, password, name);
      
      // Close modal first
      onOpenChange(false);
      
      toast({
        title: "Account created successfully!",
        description: "Please check your email for verification.",
      });
      
      // Then navigate
      navigate('/');
    } catch (error: unknown) {
      let errorMessage = "Failed to create account. Please try again.";
      
      if (error instanceof FirebaseError) {
        // Handle Firebase specific errors
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = "This email is already registered.";
            break;
          case 'auth/invalid-email':
            errorMessage = "Please enter a valid email address.";
            break;
          case 'auth/weak-password':
            errorMessage = "Password should be at least 6 characters.";
            break;
          default:
            errorMessage = error.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md p-8 bg-white rounded-3xl border shadow-sm">
      <div className="text-center mb-8">
        <div className="w-20 h-20 mx-auto mb-6">
          <img src="/lovable-uploads/e7734f7b-7b98-4c29-9f0f-1cd60bacbfac.png" alt="Recipe App" className="w-full h-full" />
        </div>
        <h2 className="text-2xl font-bold text-[#2C3E50]">Create Account</h2>
        <p className="text-gray-600 mt-2">Join our community of food lovers</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="relative">
          <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Full Name"
            className="pl-10 bg-[#F7F9FC] border-none rounded-xl"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <Input
            type="email"
            placeholder="Email"
            className="pl-10 bg-[#F7F9FC] border-none rounded-xl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <Input
            type="password"
            placeholder="Password"
            className="pl-10 bg-[#F7F9FC] border-none rounded-xl"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button 
          type="submit" 
          className="w-full bg-[#4ECDC4] hover:bg-[#45B8B0] text-white font-medium rounded-xl h-12"
          disabled={isLoading || externalLoading}
        >
          {isLoading || externalLoading ? "Creating Account..." : "Create Account"}
        </Button>
      </form>
      <p className="text-center mt-6 text-sm text-gray-600">
        Already have an account?{' '}
        <button 
          onClick={onSignInClick}
          className="text-[#4ECDC4] hover:underline font-medium"
        >
          Sign in
        </button>
      </p>
    </Card>
  );
}