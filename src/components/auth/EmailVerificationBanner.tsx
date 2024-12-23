import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { auth } from "@/lib/firebase";

export function EmailVerificationBanner() {
  const { user, sendVerificationEmail, loading } = useAuth();
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  // Don't show banner if loading, user not logged in, or already verified
  if (loading || !user || user.emailVerified || !auth.currentUser) {
    return null;
  }

  const handleResend = async () => {
    if (!auth.currentUser) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please log in again to verify your email",
      });
      return;
    }

    try {
      setSending(true);
      await sendVerificationEmail();
      toast({
        title: "Verification email sent",
        description: "Please check your inbox and spam folder",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to send verification email",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <Mail className="h-5 w-5 text-yellow-400" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-yellow-700">
            Please verify your email address. Haven't received the email?
          </p>
        </div>
        <div className="ml-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={handleResend}
            disabled={sending}
          >
            {sending ? "Sending..." : "Resend verification email"}
          </Button>
        </div>
      </div>
    </div>
  );
}