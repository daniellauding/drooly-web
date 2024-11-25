import { useQuery } from "@tanstack/react-query";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
import { ProfileActions } from "./ProfileActions";

interface FollowersDialogProps {
  userId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FollowersDialog({ userId, open, onOpenChange }: FollowersDialogProps) {
  const navigate = useNavigate();

  const { data: followers, isLoading } = useQuery({
    queryKey: ['followers', userId],
    queryFn: async () => {
      console.log('Fetching followers for user:', userId);
      const userDoc = await getDocs(query(
        collection(db, "users"),
        where("following", "array-contains", userId)
      ));
      
      return userDoc.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    },
    enabled: open
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Followers</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          {isLoading ? (
            <div className="text-center py-4">Loading followers...</div>
          ) : followers?.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">No followers yet</div>
          ) : (
            <div className="space-y-4">
              {followers?.map((follower: any) => (
                <div
                  key={follower.id}
                  className="flex items-center justify-between p-2 hover:bg-accent rounded-lg cursor-pointer"
                  onClick={() => {
                    onOpenChange(false);
                    navigate(`/profile/${follower.id}`);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={follower.avatarUrl} />
                      <AvatarFallback>
                        {follower.name?.[0]?.toUpperCase() || follower.email?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{follower.name || follower.email}</p>
                      {follower.username && (
                        <p className="text-sm text-muted-foreground">@{follower.username}</p>
                      )}
                    </div>
                  </div>
                  <ProfileActions userId={follower.id} isFollowing={true} />
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}