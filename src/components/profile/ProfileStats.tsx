import { useState } from "react";
import { Button } from "@/components/ui/button";
import { List, Users } from "lucide-react";
import { FollowersDialog } from "./FollowersDialog";
import { FollowingDialog } from "./FollowingDialog";
import { useQuery } from "@tanstack/react-query";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface ProfileStatsProps {
  userId: string;
  recipesCount: number;
}

export function ProfileStats({ userId, recipesCount }: ProfileStatsProps) {
  const [followersDialogOpen, setFollowersDialogOpen] = useState(false);
  const [followingDialogOpen, setFollowingDialogOpen] = useState(false);

  const { data: followers = [] } = useQuery({
    queryKey: ['followers', userId],
    queryFn: async () => {
      console.log('Fetching followers count for user:', userId);
      const userDoc = await getDocs(query(
        collection(db, "users"),
        where("following", "array-contains", userId)
      ));
      return userDoc.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    }
  });

  const { data: following = [] } = useQuery({
    queryKey: ['following', userId],
    queryFn: async () => {
      console.log('Fetching following count for user:', userId);
      const userDoc = await getDocs(query(
        collection(db, "users"),
        where("followers", "array-contains", userId)
      ));
      return userDoc.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    }
  });

  return (
    <div className="flex justify-center items-center gap-12 my-8 px-4">
      <div className="flex flex-col items-center gap-1">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <List className="h-5 w-5 text-muted-foreground" />
          <span>{recipesCount}</span>
        </div>
        <span className="text-sm text-muted-foreground">Recipes</span>
      </div>
      
      <Button
        variant="ghost"
        className="flex flex-col items-center gap-1 h-auto py-2 hover:bg-transparent"
        onClick={() => setFollowersDialogOpen(true)}
      >
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Users className="h-5 w-5 text-muted-foreground" />
          <span>{followers.length}</span>
        </div>
        <span className="text-sm text-muted-foreground">Followers</span>
      </Button>

      <Button
        variant="ghost"
        className="flex flex-col items-center gap-1 h-auto py-2 hover:bg-transparent"
        onClick={() => setFollowingDialogOpen(true)}
      >
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Users className="h-5 w-5 text-muted-foreground" />
          <span>{following.length}</span>
        </div>
        <span className="text-sm text-muted-foreground">Following</span>
      </Button>

      <FollowersDialog
        userId={userId}
        open={followersDialogOpen}
        onOpenChange={setFollowersDialogOpen}
      />
      <FollowingDialog
        userId={userId}
        open={followingDialogOpen}
        onOpenChange={setFollowingDialogOpen}
      />
    </div>
  );
}