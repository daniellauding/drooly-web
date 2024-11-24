import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp,
  updateDoc,
  doc,
  deleteDoc,
  getDoc
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Message } from "@/types/chat";
import { useToast } from "@/components/ui/use-toast";

export function useChat(conversationId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
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

  const sendMessage = async (text: string, replyToId?: string) => {
    if (!text.trim() || !user || !conversationId) return;
    
    try {
      console.log("Sending message:", text);
      const messagesRef = collection(db, `conversations/${conversationId}/messages`);
      await addDoc(messagesRef, {
        text,
        senderId: user.uid,
        timestamp: serverTimestamp(),
        seen: false,
        edited: false,
        replyTo: replyToId
      });

      setReplyTo(null);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        variant: "destructive",
        title: "Error sending message",
        description: "Please try again later."
      });
    }
  };

  const editMessage = async (messageId: string, newText: string) => {
    try {
      const messageRef = doc(db, `conversations/${conversationId}/messages/${messageId}`);
      await updateDoc(messageRef, {
        text: newText,
        edited: true
      });
    } catch (error) {
      console.error("Error editing message:", error);
      toast({
        variant: "destructive",
        title: "Error editing message",
        description: "Please try again later."
      });
    }
  };

  const deleteMessage = async (messageId: string) => {
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

  const markUnread = async (messageId: string) => {
    try {
      const messageRef = doc(db, `conversations/${conversationId}/messages/${messageId}`);
      await updateDoc(messageRef, { seen: false });
      
      const conversationRef = doc(db, "conversations", conversationId);
      const conversationDoc = await getDoc(conversationRef);
      if (conversationDoc.exists()) {
        await updateDoc(conversationRef, {
          unreadCount: (conversationDoc.data().unreadCount || 0) + 1
        });
      }

      toast({
        title: "Message marked as unread",
        description: "The message has been marked as unread."
      });
    } catch (error) {
      console.error("Error marking message as unread:", error);
      toast({
        variant: "destructive",
        title: "Error marking message as unread",
        description: "Please try again later."
      });
    }
  };

  const findReplyToMessage = (replyToId: string) => {
    return messages.find(m => m.id === replyToId);
  };

  return {
    messages,
    replyTo,
    setReplyTo,
    sendMessage,
    editMessage,
    deleteMessage,
    markUnread,
    findReplyToMessage
  };
}