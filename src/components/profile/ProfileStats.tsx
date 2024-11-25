import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { List, Users } from "lucide-react";
import { FollowersDialog } from "./FollowersDialog";
import { FollowingDialog } from "./FollowingDialog";

interface ProfileStatsProps {
  userId: string;
  recipesCount: number;
  followersCount: number;
  followingCount: number;
}

export function ProfileStats({ 
  userId,
  recipesCount,
  followersCount,
  followingCount 
}: ProfileStatsProps) {
  const [followersDialogOpen, setFollowersDialogOpen] = useState(false);
  const [followingDialogOpen, setFollowingDialogOpen] = useState(false);

  return (
    <div className="flex justify-center gap-8 my-6">
      <div className="text-center">
        <div className="flex items-center gap-2">
          <List className="h-4 w-4" />
          <span className="font-semibold">{recipesCount}</span>
        </div>
        <span className="text-sm text-muted-foreground">Recipes</span>
      </div>
      
      <Button
        variant="ghost"
        className="text-center"
        onClick={() => setFollowersDialogOpen(true)}
      >
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span className="font-semibold">{followersCount}</span>
        </div>
        <span className="text-sm text-muted-foreground">Followers</span>
      </Button>

      <Button
        variant="ghost"
        className="text-center"
        onClick={() => setFollowingDialogOpen(true)}
      >
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span className="font-semibold">{followingCount}</span>
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