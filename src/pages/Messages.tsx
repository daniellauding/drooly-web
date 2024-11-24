import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { MessageCircle, Users, Trash2, Edit, Eye } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { fetchConversations } from "@/services/messageService";
import { ChatView } from "@/components/chat/ChatView";
import { ConversationList } from "@/components/chat/ConversationList";

export default function Messages() {
  const { user } = useAuth();
  const { toast } = useToast();

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

  return (
    <div className="flex h-screen bg-background">
      <div className="flex flex-col w-full max-w-screen-xl mx-auto">
        <div className="flex h-[calc(100vh-4rem)] mt-16">
          {/* Conversations List */}
          <div className="w-80 border-r">
            <ConversationList conversations={conversations || []} />
          </div>
          
          {/* Chat View */}
          <div className="flex-1">
            <ChatView />
          </div>
        </div>
      </div>
    </div>
  );
}