import { useState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { User, Lock } from "lucide-react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt with:", { email, password });
  };

  return (
    <Card className="w-full max-w-md p-8 animate-bounce-in bg-gradient-to-br from-white via-white/95 to-white/90 backdrop-blur-xl border-none shadow-xl">
      <div className="text-center mb-8">
        <div className="relative w-24 h-24 mx-auto mb-4">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent rounded-2xl rotate-6" />
          <div className="absolute inset-0 bg-white rounded-2xl">
            <img src="/lovable-uploads/e7734f7b-7b98-4c29-9f0f-1cd60bacbfac.png" alt="Recipe App" className="h-full w-full p-4" />
          </div>
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Welcome Back!</h2>
        <p className="text-muted-foreground mt-2">Sign in to access your recipes</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="email"
            placeholder="Email"
            className="pl-10 bg-white/50 hover:bg-white/80 transition-colors border-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="password"
            placeholder="Password"
            className="pl-10 bg-white/50 hover:bg-white/80 transition-colors border-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit" className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity text-white font-medium">
          Sign In
        </Button>
      </form>
    </Card>
  );
}