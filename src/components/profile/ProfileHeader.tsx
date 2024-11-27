import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { ProfileStats } from "./ProfileStats";
import { ProfileActions } from "./ProfileActions";

interface ProfileHeaderProps {
  userData: {
    id: string;
    name: string;
    username?: string;
    bio?: string;
    avatarUrl?: string;
    followers?: string[];
    following?: string[];
  };
  recipesCount: number;
  isOwnProfile: boolean;
  remainingInvites: number;
  onEditProfile: () => void;
  onInvite: () => void;
}

export function ProfileHeader({
  userData,
  recipesCount,
  isOwnProfile,
  remainingInvites,
  onEditProfile,
  onInvite
}: ProfileHeaderProps) {
  return (
    <div className="text-center space-y-4">
      <div className="relative inline-block">
        <div className="w-24 h-24 mx-auto bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
          {userData.avatarUrl ? (
            <img
              src={userData.avatarUrl}
              alt={userData.name || "Profile"}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-2xl">
              {(userData.name || "")?.[0]?.toUpperCase()}
            </span>
          )}
        </div>
        {isOwnProfile && (
          <Button
            variant="outline"
            size="icon"
            className="absolute -bottom-2 -right-2 rounded-full"
            onClick={onEditProfile}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">{userData.name}</h1>
        {userData.username && (
          <p className="text-muted-foreground">@{userData.username}</p>
        )}
        {userData.bio && (
          <p className="text-sm max-w-md mx-auto">{userData.bio}</p>
        )}
      </div>

      {!isOwnProfile && (
        <ProfileActions 
          userId={userData.id} 
          isFollowing={userData.followers?.includes(userData.id) || false}
        />
      )}

      <ProfileStats
        userId={userData.id}
        recipesCount={recipesCount}
        followersCount={userData.followers?.length || 0}
        followingCount={userData.following?.length || 0}
      />
      
      {isOwnProfile && remainingInvites > 0 && (
        <Button 
          variant="outline"
          onClick={onInvite}
          className="w-full sm:w-auto"
        >
          Invite Friends ({remainingInvites} remaining)
        </Button>
      )}
    </div>
  );
}