import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

export function EventVerificationAlert() {
  const { user, sendVerificationEmail } = useAuth();
  const { toast } = useToast();

  const handleResendVerification = async () => {
    try {
      await sendVerificationEmail();
      toast({
        title: "Verification email sent",
        description: "Please check your inbox for the verification link."
      });
    } catch (error) {
      console.error("Error sending verification email:", error);
      toast({
        title: "Error",
        description: "Failed to send verification email. Please try again later.",
        variant: "destructive"
      });
    }
  };

  if (!user || user.emailVerified) return null;

  return (
    <Alert variant="destructive" className="mb-6">
      <AlertDescription className="flex flex-col gap-2">
        <p>Try verifying your email again. Your request to verify your email has expired or the link has already been used.</p>
        <Button 
          variant="outline" 
          onClick={handleResendVerification}
          className="w-fit"
        >
          Resend verification email
        </Button>
      </AlertDescription>
    </Alert>
  );
}