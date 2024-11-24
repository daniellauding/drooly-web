import { ScrollArea } from "@/components/ui/scroll-area";
import { Message as MessageType } from "@/types/chat";
import { MessageComponent } from "./Message";

interface MessageListProps {
  messages: MessageType[];
  currentUserId?: string;
  onEdit: (id: string, newText: string) => void;
  onDelete: (id: string) => void;
  onReply: (message: MessageType) => void;
  onMarkUnread: (id: string) => void;
  findReplyToMessage: (replyToId: string) => MessageType | undefined;
  recipientAvatar?: string;
  recipientInitials?: string;
}

export function MessageList({
  messages,
  currentUserId,
  onEdit,
  onDelete,
  onReply,
  onMarkUnread,
  findReplyToMessage,
  recipientAvatar,
  recipientInitials
}: MessageListProps) {
  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {messages.map((msg) => (
          <MessageComponent
            key={msg.id}
            message={msg}
            isOwnMessage={msg.senderId === currentUserId}
            onEdit={onEdit}
            onDelete={onDelete}
            onReply={onReply}
            onMarkUnread={onMarkUnread}
            replyToMessage={msg.replyTo ? findReplyToMessage(msg.replyTo) : null}
            recipientAvatar={recipientAvatar}
            recipientInitials={recipientInitials}
          />
        ))}
      </div>
    </ScrollArea>
  );
}