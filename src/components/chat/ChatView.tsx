import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Message } from "@/types/chat";

interface ChatViewProps {
  conversationId: string;
}

export function ChatView({ conversationId }: ChatViewProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!conversationId) return;

    console.log("Setting up messages listener for conversation:", conversationId);
    const messagesRef = collection(db, `conversations/${conversationId}/messages`);
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      console.log("Received messages update:", messagesData);
      setMessages(messagesData);
    });

    return () => unsubscribe();
  }, [conversationId]);

  const handleSendMessage = async () => {
    if (!message.trim() || !user || !conversationId) return;
    
    try {
      console.log("Sending message:", message);
      const messagesRef = collection(db, `conversations/${conversationId}/messages`);
      await addDoc(messagesRef, {
        text: message,
        senderId: user.uid,
        timestamp: serverTimestamp(),
        seen: false,
        edited: false
      });

      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h3 className="font-semibold">Chat</h3>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.senderId === user?.uid ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  msg.senderId === user?.uid
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p>{msg.text}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="min-h-[80px]"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button onClick={handleSendMessage}>Send</Button>
        </div>
      </div>
    </div>
  );
}