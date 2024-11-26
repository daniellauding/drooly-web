import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export function EmailVerificationBanner() {
  const { user, sendVerificationEmail } = useAuth();
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  if (!user || user.emailVerified) return null;

  const handleResend = async () => {
    try {
      setSending(true);
      await sendVerificationEmail();
      toast({
        title: "Verification email sent",
        description: "Please check your inbox and verify your email address.",
      });
    } catch (error: any) {
      console.error("Error sending verification email:", error);
      let errorMessage = "Failed to send verification email. Please try again.";
      
      if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many attempts. Please try again later.";
      }
      
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Alert variant="destructive" className="mb-4">
      <Mail className="h-4 w-4" />
      <AlertTitle>Email verification required</AlertTitle>
      <AlertDescription className="flex items-center gap-4">
        <span>Please verify your email address to access all features.</span>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleResend}
          disabled={sending}
        >
          {sending ? "Sending..." : "Resend verification email"}
        </Button>
      </AlertDescription>
    </Alert>
  );
}