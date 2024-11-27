import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

export interface ProfileHeaderProps {
  userData: {
    name: string;
    username: string;
    bio: string;
    avatarUrl: string;
  };
  isOwnProfile: boolean;
  remainingInvites: number;
  onEditProfile: () => void;
  onInvite: () => void;
}

export function ProfileHeader({
  userData,
  isOwnProfile,
  remainingInvites,
  onEditProfile,
  onInvite
}: ProfileHeaderProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className="h-24 w-24">
        <AvatarImage src={userData.avatarUrl} alt={userData.name} />
        <AvatarFallback>{userData.name?.[0]}</AvatarFallback>
      </Avatar>
      
      <div className="text-center">
        <h1 className="text-2xl font-bold">{userData.name}</h1>
        <p className="text-muted-foreground">@{userData.username}</p>
      </div>

      {userData.bio && (
        <p className="text-center max-w-md text-muted-foreground">
          {userData.bio}
        </p>
      )}

      <div className="flex gap-2">
        {isOwnProfile ? (
          <>
            <Button onClick={onEditProfile} variant="outline">
              Edit Profile
            </Button>
            {remainingInvites > 0 && (
              <Button onClick={onInvite} variant="outline">
                <UserPlus className="mr-2 h-4 w-4" />
                Invite Friends ({remainingInvites})
              </Button>
            )}
          </>
        ) : (
          <Button>Follow</Button>
        )}
      </div>
    </div>
  );
}