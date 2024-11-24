import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { MessageSquare, PlusSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatView } from "@/components/chat/ChatView";
import { ConversationList } from "@/components/chat/ConversationList";
import { UserSearchDialog } from "@/components/chat/UserSearchDialog";
import { TopBar } from "@/components/TopBar";
import { BottomBar } from "@/components/BottomBar";
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
      orderBy("lastMessageTimestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const conversationsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        name: doc.data().participantEmails.find((email: string) => email !== user.email) || "Unknown",
        lastMessage: doc.data().lastMessage || "No messages yet",
        unreadCount: doc.data().unreadCount || 0,
      })) as Conversation[];
      console.log("Received conversations update:", conversationsData);
      setConversations(conversationsData);
    });

    return () => unsubscribe();
  }, [user]);

  const handleNewMessage = () => {
    setIsSearchOpen(true);
  };

  const handleSelectConversation = (conversationId: string) => {
    console.log("Selected conversation:", conversationId);
    setSelectedConversationId(conversationId);
  };

  const handleDeleteConversation = (conversationId: string) => {
    setSelectedConversationId(null);
  };

  const selectedConversation = conversations.find(c => c.id === selectedConversationId);

  return (
    <div className="flex flex-col h-screen bg-background">
      <TopBar />
      <div className="flex-1 flex mt-16 mb-16">
        <div className="flex flex-col w-full max-w-screen-xl mx-auto">
          <div className="flex h-full">
            <div className="w-80 border-r">
              <div className="h-full flex flex-col">
                <div className="p-4 border-b flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Messages</h2>
                  <Button onClick={handleNewMessage} size="icon" variant="ghost">
                    <PlusSquare className="h-5 w-5" />
                  </Button>
                </div>
                <ConversationList
                  conversations={conversations}
                  onSelectConversation={handleSelectConversation}
                />
              </div>
            </div>
            
            <div className="flex-1">
              {!selectedConversationId ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Select a conversation or start a new one
                </div>
              ) : (
                <ChatView
                  conversationId={selectedConversationId}
                  onDeleteConversation={handleDeleteConversation}
                  recipientName={selectedConversation?.name || "Unknown"}
                  recipientAvatar={selectedConversation?.participantAvatar}
                  recipientInitials={selectedConversation?.name?.[0]?.toUpperCase()}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <BottomBar />
      <UserSearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </div>
  );
}