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
    <div className="fixed bottom-4 left-4 max-w-md bg-white rounded-lg shadow-lg border border-amber-200 p-6 z-50">
      <div className="flex items-center gap-2 text-amber-800 mb-4">
        <Mail className="h-5 w-5 text-amber-600" />
        <h3 className="font-semibold">Email verification required</h3>
      </div>
      <p className="text-amber-700 mb-6">
        Please verify your email address to access all features.
      </p>
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleResend}
          disabled={sending}
          className="border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-800 hover:text-amber-900"
        >
          {sending ? "Sending..." : "Resend verification email"}
        </Button>
      </div>
    </div>
  );
}