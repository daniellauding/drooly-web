import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatHeaderProps {
  recipientName: string;
  recipientAvatar?: string;
  recipientInitials?: string;
  onDeleteConversation: () => void;
}

export function ChatHeader({ 
  recipientName, 
  recipientAvatar,
  recipientInitials = "U",
  onDeleteConversation 
}: ChatHeaderProps) {
  return (
    <div className="p-4 border-b flex justify-between items-center">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={recipientAvatar} />
          <AvatarFallback>{recipientInitials}</AvatarFallback>
        </Avatar>
        <h3 className="font-semibold">{recipientName}</h3>
      </div>
      <Button
        variant="destructive"
        size="sm"
        onClick={onDeleteConversation}
      >
        Delete Conversation
      </Button>
    </div>
  );
}