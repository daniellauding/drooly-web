import { UserInvite } from "./types";
import { Badge } from "@/components/ui/badge";

interface UserInviteStatusProps {
  invites?: UserInvite[];
}

export function UserInviteStatus({ invites }: UserInviteStatusProps) {
  if (!invites || invites.length === 0) return null;

  const latestInvite = invites[invites.length - 1];
  
  const statusColors = {
    pending: "bg-yellow-500",
    sent: "bg-blue-500",
    opened: "bg-purple-500",
    accepted: "bg-green-500",
    rejected: "bg-red-500"
  };

  return (
    <div className="flex items-center gap-2">
      <Badge 
        className={`${statusColors[latestInvite.status]} text-white`}
      >
        {latestInvite.status}
      </Badge>
      <span className="text-xs text-muted-foreground">
        {new Date(latestInvite.createdAt).toLocaleDateString()}
      </span>
    </div>
  );
}