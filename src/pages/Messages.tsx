import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ChatView } from "@/components/chat/ChatView";
import { ConversationList } from "@/components/chat/ConversationList";
import { UserSearchDialog } from "@/components/chat/UserSearchDialog";
import { TopBar } from "@/components/TopBar";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Conversation } from "@/types/chat";

export default function Messages() {
  const { user } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    console.log("Setting up conversations listener for user:", user.uid);
    const conversationsRef = collection(db, "conversations");
    const q = query(
      conversationsRef,
      where("participants", "array-contains", user.uid),
      orderBy("lastMessageAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log("Received conversations snapshot");
      const conversationsData = snapshot.docs.map(doc => ({
        id: doc.id,
        participants: doc.data().participants,
        participantEmails: doc.data().participantEmails,
        name: doc.data().participantEmails.find((email: string) => email !== user.email) || "Unknown",
        lastMessage: doc.data().lastMessage || "No messages yet",
        unreadCount: doc.data().unreadCount || 0,
      })) as Conversation[];
      console.log("Received conversations update:", conversationsData);
      setConversations(conversationsData);
    });

    return () => {
      console.log("Cleaning up conversations listener");
      unsubscribe();
    };
  }, [user]);

  const handleConversationSelect = (conversationId: string) => {
    console.log("Selected conversation:", conversationId);
    setSelectedConversationId(conversationId);
  };

  const handleStartNewChat = () => {
    console.log("Opening new chat dialog");
    setIsSearchOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <div className="container mx-auto px-4 pt-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
          <div className="md:col-span-1 bg-white rounded-lg shadow-sm border">
            <ConversationList
              conversations={conversations}
              selectedConversationId={selectedConversationId}
              onConversationSelect={handleConversationSelect}
              onStartNewChat={handleStartNewChat}
            />
          </div>
          <div className="md:col-span-2 bg-white rounded-lg shadow-sm border">
            {selectedConversationId ? (
              <ChatView
                conversationId={selectedConversationId}
                recipientEmail={
                  conversations.find(c => c.id === selectedConversationId)?.participantEmails.find(
                    email => email !== user?.email
                  ) || ""
                }
              />
            ) : (
              <div className="h-[600px] flex items-center justify-center text-muted-foreground">
                Select a conversation or start a new chat
              </div>
            )}
          </div>
        </div>
      </div>
      <UserSearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </div>
  );
}