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

  // Don't show banner for verified users, superadmins, or non-logged in users
  if (!user || user.emailVerified || user.role === 'superadmin') return null;

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
    <div className="fixed bottom-24 right-4 w-[400px] bg-white rounded-xl shadow-lg border p-4 z-50">
      <div className="space-y-3">
        <h3 className="text-xl font-semibold">Email verification required</h3>
        <p className="text-gray-600">
          Please check your inbox and verify your email to access all features.
        </p>
        <Button 
          variant="default"
          size="sm"
          onClick={() => setDialogOpen(true)}
          className="w-full"
          disabled={sending}
        >
          <Mail className="h-4 w-4 mr-2" />
          Resend verification email
        </Button>
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