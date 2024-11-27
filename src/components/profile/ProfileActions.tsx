import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { MessageSquare, UserPlus, UserMinus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface ProfileActionsProps {
  userId: string;
  isFollowing: boolean;
}

export function ProfileActions({ userId, isFollowing }: ProfileActionsProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [following, setFollowing] = useState(isFollowing);

  if (user?.uid === userId) return null;

  const handleFollow = async () => {
    if (!user) return;
    
    try {
      const userRef = doc(db, "users", user.uid);
      const targetUserRef = doc(db, "users", userId);
      
      if (following) {
        await updateDoc(userRef, {
          following: arrayRemove(userId)
        });
        await updateDoc(targetUserRef, {
          followers: arrayRemove(user.uid)
        });
        setFollowing(false);
        toast({
          title: "Unfollowed successfully"
        });
      } else {
        await updateDoc(userRef, {
          following: arrayUnion(userId)
        });
        await updateDoc(targetUserRef, {
          followers: arrayUnion(user.uid)
        });
        setFollowing(true);
        toast({
          title: "Following successfully"
        });
      }
    } catch (error) {
      console.error("Error updating follow status:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update follow status"
      });
    }
  };

  const handleMessage = () => {
    navigate(`/messages?userId=${userId}`);
  };

  return (
    <div className="flex gap-2 mt-4">
      <Button
        variant={following ? "outline" : "default"}
        onClick={handleFollow}
        className="w-32"
      >
        {following ? (
          <>
            <UserMinus className="h-4 w-4 mr-2" />
            Unfollow
          </>
        ) : (
          <>
            <UserPlus className="h-4 w-4 mr-2" />
            Follow
          </>
        )}
      </Button>
      <Button variant="outline" onClick={handleMessage}>
        <MessageSquare className="h-4 w-4 mr-2" />
        Message
      </Button>
    </div>
  );
}