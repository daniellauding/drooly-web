import { useAuth } from "@/contexts/AuthContext";
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
    <div className="fixed bottom-4 right-4 max-w-md bg-white rounded-lg shadow-lg border p-6 z-50">
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Email verification required</h3>
          <p className="text-muted-foreground">
            Please check your inbox and verify your email to access all features.
          </p>
        </div>
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleResend}
            disabled={sending}
            className="min-w-[200px]"
          >
            {sending ? "Sending..." : "Resend verification email"}
          </Button>
        </div>
      </div>
    </div>
  );
}