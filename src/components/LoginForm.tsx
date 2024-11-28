import { useState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { User, Lock } from "lucide-react";

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  loading?: boolean;
  onSignUpClick: () => void;
}

export function LoginForm({ onSubmit, loading = false, onSignUpClick }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(email, password);
  };

  return (
    <Card className="w-full max-w-md p-8 bg-white rounded-3xl border shadow-sm">
      <div className="text-center mb-8">
        <div className="w-20 h-20 mx-auto mb-6">
          <img src="/lovable-uploads/e7734f7b-7b98-4c29-9f0f-1cd60bacbfac.png" alt="Recipe App" className="w-full h-full" />
        </div>
        <h2 className="text-2xl font-bold text-[#2C3E50]">Welcome Back</h2>
        <p className="text-gray-600 mt-2">Sign in to access your recipes</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="relative">
          <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
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
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>
      <p className="text-center mt-6 text-sm text-gray-600">
        Don't have an account?{' '}
        <button 
          onClick={onSignUpClick}
          className="text-[#4ECDC4] hover:underline font-medium"
        >
          Sign up
        </button>
      </p>
    </Card>
  );
}