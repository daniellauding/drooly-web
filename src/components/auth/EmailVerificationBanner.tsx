import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { DeleteConfirmationDialog } from "@/components/backoffice/DeleteConfirmationDialog";

export function EmailVerificationBanner() {
  const { user, sendVerificationEmail } = useAuth();
  const [sending, setSending] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
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
      setDialogOpen(false);
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
    <div className="fixed top-20 left-0 right-0 z-50 mx-4 md:mx-auto max-w-2xl">
      <div className="bg-destructive text-destructive-foreground rounded-lg p-6">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Email verification required</h3>
          <p className="text-lg opacity-90">
            Please verify your email to access this feature.
          </p>
          <div className="flex justify-end mt-4">
            <Button 
              variant="secondary"
              size="sm" 
              onClick={() => setDialogOpen(true)}
              className="min-w-[200px] bg-white text-destructive hover:bg-white/90"
            >
              <Mail className="h-4 w-4 mr-2" />
              Resend verification email
            </Button>
          </div>
        </div>
      </div>

      <DeleteConfirmationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onConfirm={handleResend}
        title="Resend Verification Email"
        description="Would you like to receive a new verification email?"
        confirmText="Send Email"
        cancelText="Cancel"
      />
    </div>
  );
}