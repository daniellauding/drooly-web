import { User } from "./types";
import { CheckCircle2, XCircle, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserVerificationStatusProps {
  user: User;
  onResendVerification: () => void;
}

export function UserVerificationStatus({ user, onResendVerification }: UserVerificationStatusProps) {
  return (
    <div className="flex items-center gap-2">
      {user.emailVerified ? (
        <div className="flex items-center text-green-600">
          <CheckCircle2 className="h-4 w-4 mr-1" />
          <span>Verified</span>
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
          >
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}