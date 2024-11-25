import { useState } from "react";
import { Button } from "@/components/ui/button";
import { List, Users, Heart } from "lucide-react";
import { FollowersDialog } from "./FollowersDialog";
import { FollowingDialog } from "./FollowingDialog";
import { useQuery } from "@tanstack/react-query";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface ProfileStatsProps {
  userId: string;
  recipesCount: number;
  followersCount: number;
  followingCount: number;
}

export function ProfileStats({ userId, recipesCount, followersCount, followingCount }: ProfileStatsProps) {
  const [followersDialogOpen, setFollowersDialogOpen] = useState(false);
  const [followingDialogOpen, setFollowingDialogOpen] = useState(false);

  const { data: favorites = [] } = useQuery({
    queryKey: ['favorites', userId],
    queryFn: async () => {
      console.log('Fetching favorites for user:', userId);
      const favoritesRef = collection(db, "favorites");
      const q = query(favoritesRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
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
          <span>{followersCount}</span>
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
          <span>{followingCount}</span>
        </div>
        <span className="text-sm text-muted-foreground">Following</span>
      </Button>

      <div className="flex flex-col items-center gap-1">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Heart className="h-5 w-5 text-muted-foreground" />
          <span>{favorites.length}</span>
        </div>
        <span className="text-sm text-muted-foreground">Favorites</span>
      </div>

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