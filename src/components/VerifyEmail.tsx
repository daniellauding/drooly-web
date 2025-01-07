import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { applyActionCode } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';

export function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    const oobCode = searchParams.get('oobCode');
    console.log('URL Parameters:', {
      oobCode,
      fullUrl: window.location.href,
      allParams: Object.fromEntries(searchParams)
    });

    // If no code, redirect to home
    if (!oobCode) {
      console.log('No verification code, redirecting to home');
      navigate('/');
      return;
    }

    const verifyEmail = async () => {
      try {
        console.log('Attempting to verify email with code:', oobCode);
        await applyActionCode(auth, oobCode);
        
        // Reload user to update status
        if (auth.currentUser) {
          await auth.currentUser.reload();
          console.log('Verification status:', auth.currentUser.emailVerified);
        }

        toast({
          title: t('auth.email_verified'),
          description: t('auth.email_verified_description'),
        });

        // Redirect to home after short delay
        setTimeout(() => {
          navigate('/');
        }, 2000);

      } catch (err) {
        console.error('Verification error:', err);
        toast({
          variant: "destructive",
          title: t('auth.verification_failed'),
          description: err instanceof Error ? err.message : t('auth.unknown_error'),
        });
        // Redirect on error after showing message
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } finally {
        setVerifying(false);
      }
    };

    verifyEmail();
  }, [searchParams, toast, t, navigate]);

  return (
    <div className="container flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md p-6 space-y-6">
        <h1 className="text-2xl font-semibold text-center">
          {t('auth.email_verification')}
        </h1>
        
        <div className="text-center space-y-4">
          <div className="flex justify-center items-center space-x-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <p>{t('auth.verifying_email')}</p>
          </div>
        </div>
      </Card>
    </div>
  );
} 