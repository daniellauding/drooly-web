import { User } from "./types";
import { CheckCircle2, XCircle, RotateCw, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/components/ui/use-toast";

interface UserVerificationStatusProps {
  user: User;
  onResendVerification: () => void;
}

export function UserVerificationStatus({ user, onResendVerification }: UserVerificationStatusProps) {
  const { toast } = useToast();

  const handleManualVerification = async () => {
    try {
      console.log("Manually verifying user:", user.id);
      await updateDoc(doc(db, "users", user.id), {
        manuallyVerified: true,
        verifiedAt: new Date()
      });
      
      toast({
        title: "User manually verified",
        description: "The user has been manually verified successfully.",
      });
    } catch (error) {
      console.error("Error manually verifying user:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to manually verify user. Please try again.",
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      {user.emailVerified || user.manuallyVerified ? (
        <div className="flex items-center text-green-600">
          <CheckCircle2 className="h-4 w-4 mr-1" />
          <span>{user.manuallyVerified ? "Manually verified" : "Email verified"}</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <div className="flex items-center text-red-600">
            <XCircle className="h-4 w-4 mr-1" />
            <span>Not verified</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onResendVerification}
            title="Resend verification email"
          >
            <RotateCw className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleManualVerification}
            title="Manually verify user"
          >
            <Shield className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}