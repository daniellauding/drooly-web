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

interface FollowingDialogProps {
  userId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FollowingDialog({ userId, open, onOpenChange }: FollowingDialogProps) {
  const navigate = useNavigate();

  const { data: following, isLoading } = useQuery({
    queryKey: ['following', userId],
    queryFn: async () => {
      console.log('Fetching following for user:', userId);
      const userDoc = await getDocs(query(
        collection(db, "users"),
        where("followers", "array-contains", userId)
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
          <DialogTitle>Following</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          {isLoading ? (
            <div className="text-center py-4">Loading following...</div>
          ) : following?.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">Not following anyone yet</div>
          ) : (
            <div className="space-y-4">
              {following?.map((followedUser: any) => (
                <div
                  key={followedUser.id}
                  className="flex items-center justify-between p-2 hover:bg-accent rounded-lg cursor-pointer"
                  onClick={() => {
                    onOpenChange(false);
                    navigate(`/profile/${followedUser.id}`);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={followedUser.avatarUrl} />
                      <AvatarFallback>
                        {followedUser.name?.[0]?.toUpperCase() || followedUser.email?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{followedUser.name || followedUser.email}</p>
                      {followedUser.username && (
                        <p className="text-sm text-muted-foreground">@{followedUser.username}</p>
                      )}
                    </div>
                  </div>
                  <ProfileActions userId={followedUser.id} isFollowing={true} />
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}