import { useChat } from "@/hooks/useChat";
import { MessageInput } from "./MessageInput";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";

interface ChatViewProps {
  conversationId: string;
  onDeleteConversation: (id: string) => void;
  recipientName: string;
  recipientAvatar?: string;
  recipientInitials?: string;
}

export function ChatView({ 
  conversationId, 
  onDeleteConversation,
  recipientName,
  recipientAvatar,
  recipientInitials 
}: ChatViewProps) {
  const { 
    messages,
    replyTo,
    setReplyTo,
    sendMessage,
    editMessage,
    deleteMessage,
    markUnread,
    findReplyToMessage
  } = useChat(conversationId);

  return (
    <div className="flex flex-col h-full">
      <ChatHeader
        recipientName={recipientName}
        recipientAvatar={recipientAvatar}
        recipientInitials={recipientInitials}
        onDeleteConversation={() => onDeleteConversation(conversationId)}
      />
      
      <MessageList
        messages={messages}
        onEdit={editMessage}
        onDelete={deleteMessage}
        onReply={(message) => setReplyTo(message)}
        onMarkUnread={markUnread}
        findReplyToMessage={findReplyToMessage}
        recipientAvatar={recipientAvatar}
        recipientInitials={recipientInitials}
      />

      <MessageInput
        onSend={sendMessage}
        replyTo={replyTo ? { id: replyTo.id, text: replyTo.text } : null}
        onCancelReply={() => setReplyTo(null)}
      />
    </div>
  );
}