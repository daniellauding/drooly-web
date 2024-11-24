import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { MessageSquare, PlusSquare } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { fetchConversations } from "@/services/messageService";
import { ChatView } from "@/components/chat/ChatView";
import { ConversationList } from "@/components/chat/ConversationList";
import { UserSearchDialog } from "@/components/chat/UserSearchDialog";
import { TopBar } from "@/components/TopBar";
import { BottomBar } from "@/components/BottomBar";

export default function Messages() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { data: conversations, isLoading } = useQuery({
    queryKey: ["conversations", user?.uid],
    queryFn: () => fetchConversations(user?.uid || ""),
    enabled: !!user,
  });

  useEffect(() => {
    console.log("Messages page mounted");
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Please login to view messages</p>
      </div>
    );
  }

  const handleNewMessage = () => {
    setIsSearchOpen(true);
  };

  const NoMessagesPlaceholder = () => (
    <div className="flex flex-col items-center justify-center h-full space-y-4">
      <div className="relative w-full max-w-md aspect-video rounded-lg overflow-hidden mb-4">
        <img
          src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
          alt="No messages"
          className="object-cover w-full h-full"
        />
      </div>
      <MessageSquare className="h-16 w-16 text-muted-foreground" />
      <h3 className="text-xl font-semibold">No messages yet</h3>
      <p className="text-muted-foreground text-center max-w-sm">
        Start a conversation with someone to begin messaging
      </p>
      <Button onClick={handleNewMessage} className="gap-2">
        <PlusSquare className="h-5 w-5" />
        New Message
      </Button>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-background">
      <TopBar />
      <div className="flex-1 flex mt-16 mb-16">
        <div className="flex flex-col w-full max-w-screen-xl mx-auto">
          <div className="flex h-full">
            {/* Conversations List */}
            <div className="w-80 border-r">
              <div className="h-full flex flex-col">
                <div className="p-4 border-b flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Messages</h2>
                  <Button onClick={handleNewMessage} size="icon" variant="ghost">
                    <PlusSquare className="h-5 w-5" />
                  </Button>
                </div>
                {conversations?.length === 0 ? (
                  <NoMessagesPlaceholder />
                ) : (
                  <ConversationList conversations={conversations || []} />
                )}
              </div>
            </div>
            
            {/* Chat View */}
            <div className="flex-1">
              {conversations?.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Select a conversation or start a new one
                </div>
              ) : (
                <ChatView />
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