import { useState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { User, Lock, Mail, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useViewLogger } from '@/hooks/useViewLogger';
import { useToast } from "@/hooks/use-toast";
import { resetPassword } from "@/services/authService";
import { trackLogin, trackError } from '../services/analyticsService';
import { useTranslation } from 'react-i18next';

interface LoginFormProps {
  onSignUpClick: () => void;
  onOpenChange?: (open: boolean) => void;
}

export function LoginForm({ onSignUpClick, onOpenChange }: LoginFormProps) {
  const { t } = useTranslation();
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const [showResetView, setShowResetView] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useViewLogger('LoginForm');

  const clearForm = () => {
    setEmail("");
    setPassword("");
    setResetEmail("");
    setShowResetView(false);
    setIsResetting(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log('[LoginForm] Attempting login...');
      await login(email, password);
      trackLogin('email');
      
      // Clear form
      clearForm();
      
      // Close modal and navigate
      if (onOpenChange) {
        onOpenChange(false);
      }
      
      // Clear session and force reload to dashboard
      sessionStorage.clear();
      window.location.href = '/';
      
    } catch (error: unknown) {
      const err = error as Error;
      console.error('[LoginForm] Login failed:', err);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: err.message || "Failed to sign in. Please try again.",
      });
      trackError('login_error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      toast({
        variant: "destructive",
        title: "Email Required",
        description: "Please enter your email address.",
      });
      return;
    }

    try {
      setIsResetting(true);
      await resetPassword(resetEmail);
      
      // Close modal first
      onOpenChange(false);
      
      toast({
        title: "Reset Email Sent",
        description: "Check your email for password reset instructions.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Reset Failed",
        description: error.message || "Failed to send reset email.",
      });
    } finally {
      setIsResetting(false);
    }
  };

  if (showResetView) {
    return (
      <Card className="w-full max-w-md p-8 bg-white rounded-3xl border shadow-sm">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-6">
            <img src="/lovable-uploads/e7734f7b-7b98-4c29-9f0f-1cd60bacbfac.png" alt="Recipe App" className="w-full h-full" />
          </div>
          <h2 className="text-2xl font-bold text-[#2C3E50]">Reset Password</h2>
          <p className="text-gray-600 mt-2">Enter your email to receive reset instructions</p>
        </div>
        <form onSubmit={handleForgotPassword} className="space-y-5">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              type="email"
              placeholder={t('auth.email')}
              className="pl-10 bg-[#F7F9FC] border-none rounded-xl"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              required
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-[#4ECDC4] hover:bg-[#45B8B0] text-white font-medium rounded-xl h-12"
            disabled={isResetting}
          >
            {isResetting ? "Sending..." : "Send Reset Link"}
          </Button>
          <button
            type="button"
            onClick={() => setShowResetView(false)}
            className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </button>
        </form>
      </Card>
    );
  }

  // Original login view
  return (
    <Card className="w-full max-w-md p-8 bg-white rounded-3xl border shadow-sm">
      <div className="text-center mb-8">
        <div className="w-20 h-20 mx-auto mb-6">
          <img src="/lovable-uploads/e7734f7b-7b98-4c29-9f0f-1cd60bacbfac.png" alt={t('common.app_name')} className="w-full h-full" />
        </div>
        <h2 className="text-2xl font-bold text-[#2C3E50]">{t('auth.welcome_back')}</h2>
        <p className="text-gray-600 mt-2">{t('auth.sign_in_prompt')}</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5" role="form">
        <div className="relative">
          <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <Input
            type="email"
            placeholder={t('auth.email')}
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
            placeholder={t('auth.password')}
            className="pl-10 bg-[#F7F9FC] border-none rounded-xl"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="text-right">
          <button
            type="button"
            onClick={() => setShowResetView(true)}
            className="text-sm text-[#4ECDC4] hover:underline"
          >
            {t('auth.forgot_password')}
          </button>
        </div>
        <Button 
          type="submit" 
          className="w-full bg-[#4ECDC4] hover:bg-[#45B8B0] text-white font-medium rounded-xl h-12"
          disabled={loading}
        >
          {loading ? t('common.signing_in') : t('auth.sign_in')}
        </Button>
      </form>
      <p className="text-center mt-6 text-sm text-gray-600">
        {t('auth.no_account')}{' '}
        <button 
          onClick={onSignUpClick}
          className="text-[#4ECDC4] hover:underline font-medium"
        >
          {t('auth.sign_up')}
        </button>
      </p>
    </Card>
  );
}