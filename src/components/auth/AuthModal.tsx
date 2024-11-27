import { Dialog, DialogContent } from "@/components/ui/dialog";
import { LoginForm } from "@/components/LoginForm";
import { RegisterForm } from "@/components/RegisterForm";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: "login" | "register";
}

export function AuthModal({ open, onOpenChange, defaultTab = "login" }: AuthModalProps) {
  const { login, register } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(defaultTab === "login");

  const handleLogin = async (email: string, password: string) => {
    try {
      setLoading(true);
      await login(email, password);
      onOpenChange(false);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      await register(email, password, name);
      toast({
        title: "Registration successful",
        description: "Please check your email to verify your account before logging in.",
      });
      setIsLogin(true);
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0">
        {isLogin ? (
          <>
            <LoginForm onSubmit={handleLogin} loading={loading} />
            <p className="text-center pb-6 text-sm text-gray-600">
              Don't have an account?{' '}
              <button 
                onClick={() => setIsLogin(false)}
                className="text-primary hover:underline font-medium"
              >
                Sign up
              </button>
            </p>
          </>
        ) : (
          <>
            <RegisterForm onSubmit={handleRegister} loading={loading} />
            <p className="text-center pb-6 text-sm text-gray-600">
              Already have an account?{' '}
              <button 
                onClick={() => setIsLogin(true)}
                className="text-primary hover:underline font-medium"
              >
                Sign in
              </button>
            </p>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}