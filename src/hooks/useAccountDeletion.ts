import { useAuth } from "@/contexts/AuthContext";
import { getFunctions, httpsCallable } from "firebase/functions";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { deleteUserAccount } from "@/services/authService";
import { logger } from "@/utils/logger";

export function useAccountDeletion() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const functions = getFunctions();

  const deleteAccount = async () => {
    if (!user) {
      logger.error("Attempt to delete account without being logged in");
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to delete your account",
      });
      return;
    }

    try {
      logger.info("Starting account deletion process for user:", user.uid);
      
      // Call the Cloud Function to delete user data
      const deleteUserAccountFn = httpsCallable(functions, 'deleteUserAccount');
      await deleteUserAccountFn();
      
      // Delete local user data and clear session
      await deleteUserAccount(user.uid);
      
      logger.info("Account deletion completed successfully");
      
      toast({
        title: "Account deleted",
        description: "Your account has been successfully deleted.",
      });
      
      navigate('/');
    } catch (error: any) {
      logger.error('Error deleting account:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete account. Please try again.",
      });
    }
  };

  return { deleteAccount };
}