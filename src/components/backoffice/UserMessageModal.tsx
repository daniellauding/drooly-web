import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import { useChat } from "@/hooks/useChat";
import { MessageComponent } from "@/components/chat/Message";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface UserMessageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  userEmail: string;
}

export function UserMessageModal({ open, onOpenChange, userId, userEmail }: UserMessageModalProps) {
  const [message, setMessage] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const { user: currentUser } = useAuth();
  const { messages, sendMessage } = useChat(conversationId || "");

  useEffect(() => {
    const findOrCreateConversation = async () => {
      if (!currentUser?.uid || !userId) return;

      const conversationsRef = collection(db, "conversations");
      const q = query(
        conversationsRef,
        where("participants", "array-contains", currentUser.uid)
      );
      
      const querySnapshot = await getDocs(q);
      const conversation = querySnapshot.docs.find(doc => 
        doc.data().participants.includes(userId)
      );

      if (conversation) {
        setConversationId(conversation.id);
      } else {
        // Create new conversation logic would go here
        console.log("Would create new conversation between", currentUser.uid, "and", userId);
      }
    };

    findOrCreateConversation();
  }, [currentUser?.uid, userId]);

  const handleSend = async () => {
    if (!message.trim() || !conversationId) return;
    await sendMessage(message);
    setMessage("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>Message {userEmail}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col h-full">
          <ScrollArea className="flex-1 p-4">
            {messages.map((msg) => (
              <MessageComponent
                key={msg.id}
                message={msg}
                isOwnMessage={msg.senderId === currentUser?.uid}
                onEdit={() => {}}
                onDelete={() => {}}
                onReply={() => {}}
                onMarkUnread={() => {}}
              />
            ))}
          </ScrollArea>
          <div className="p-4 border-t flex gap-2">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="min-h-[80px]"
            />
            <Button onClick={handleSend}>Send</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}