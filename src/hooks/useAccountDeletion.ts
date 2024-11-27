import { useAuth } from "@/contexts/AuthContext";
import { getFunctions, httpsCallable } from "firebase/functions";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

export function useAccountDeletion() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const functions = getFunctions();
  const auth = getAuth();

  const deleteAccount = async () => {
    if (!user || !auth.currentUser) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to delete your account",
      });
      return;
    }

    try {
      // First delete the user from client-side Authentication
      await auth.currentUser.delete();
      console.log("Deleted user from client-side Authentication");

      // Then call the Cloud Function to clean up all associated data
      const deleteUserAccount = httpsCallable(functions, 'deleteUserAccount');
      await deleteUserAccount();
      
      // Finally logout
      await logout();
      
      toast({
        title: "Account deleted",
        description: "Your account has been successfully deleted.",
      });
      
      navigate('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete account. Please try again.",
      });
    }
  };

  return { deleteAccount };
} 