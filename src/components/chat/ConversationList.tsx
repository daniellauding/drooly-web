import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Conversation } from "@/types/chat";

interface ConversationListProps {
  conversations: Conversation[];
  onSelectConversation: (id: string) => void;
}

export function ConversationList({ conversations, onSelectConversation }: ConversationListProps) {
  return (
    <ScrollArea className="flex-1">
      <div className="space-y-2 p-4">
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent cursor-pointer relative group"
            onClick={() => onSelectConversation(conversation.id)}
          >
            <div className="flex-shrink-0">
              {conversation.isGroup ? (
                <Users className="h-10 w-10 text-muted-foreground" />
              ) : (
                <MessageCircle className="h-10 w-10 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <p className="font-medium truncate">
                  {conversation.name}
                </p>
                {conversation.unreadCount > 0 && (
                  <Badge variant="default" className="ml-2">
                    {conversation.unreadCount}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground truncate">
                {conversation.lastMessage}
              </p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}