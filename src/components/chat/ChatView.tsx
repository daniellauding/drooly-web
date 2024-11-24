import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { Pencil, Trash2, Reply } from "lucide-react";
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp,
  updateDoc,
  doc,
  deleteDoc
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Message } from "@/types/chat";
import { useToast } from "@/components/ui/use-toast";

interface ChatViewProps {
  conversationId: string;
  onDeleteConversation: (id: string) => void;
}

export function ChatView({ conversationId, onDeleteConversation }: ChatViewProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();

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

      // Mark messages as seen
      messagesData.forEach(async (msg) => {
        if (msg.senderId !== user?.uid && !msg.seen) {
          const messageRef = doc(db, `conversations/${conversationId}/messages/${msg.id}`);
          await updateDoc(messageRef, { seen: true });
        }
      });
    });

    return () => unsubscribe();
  }, [conversationId, user?.uid]);

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
      toast({
        variant: "destructive",
        title: "Error sending message",
        description: "Please try again later."
      });
    }
  };

  const handleEditMessage = async (messageId: string) => {
    if (!editText.trim() || !user) return;

    try {
      const messageRef = doc(db, `conversations/${conversationId}/messages/${messageId}`);
      await updateDoc(messageRef, {
        text: editText,
        edited: true
      });
      setEditingMessageId(null);
      setEditText("");
    } catch (error) {
      console.error("Error editing message:", error);
      toast({
        variant: "destructive",
        title: "Error editing message",
        description: "Please try again later."
      });
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      const messageRef = doc(db, `conversations/${conversationId}/messages/${messageId}`);
      await deleteDoc(messageRef);
      toast({
        title: "Message deleted",
        description: "The message has been removed from the conversation."
      });
    } catch (error) {
      console.error("Error deleting message:", error);
      toast({
        variant: "destructive",
        title: "Error deleting message",
        description: "Please try again later."
      });
    }
  };

  const handleDeleteConversation = async () => {
    try {
      await deleteDoc(doc(db, "conversations", conversationId));
      onDeleteConversation(conversationId);
      toast({
        title: "Conversation deleted",
        description: "The conversation has been removed."
      });
    } catch (error) {
      console.error("Error deleting conversation:", error);
      toast({
        variant: "destructive",
        title: "Error deleting conversation",
        description: "Please try again later."
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="font-semibold">Chat</h3>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDeleteConversation}
        >
          Delete Conversation
        </Button>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.senderId === user?.uid ? 'justify-end' : 'justify-start'}`}
            >
              <div className="flex flex-col max-w-[70%]">
                <div
                  className={`rounded-lg p-3 ${
                    msg.senderId === user?.uid
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  {editingMessageId === msg.id ? (
                    <div className="flex flex-col gap-2">
                      <Textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="min-h-[60px]"
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleEditMessage(msg.id)}
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingMessageId(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p>{msg.text}</p>
                      {msg.edited && (
                        <span className="text-xs opacity-70">(edited)</span>
                      )}
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  {msg.seen && msg.senderId === user?.uid && (
                    <span className="text-xs text-muted-foreground">Seen</span>
                  )}
                  {msg.senderId === user?.uid && (
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        onClick={() => {
                          setEditingMessageId(msg.id);
                          setEditText(msg.text);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        onClick={() => handleDeleteMessage(msg.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
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