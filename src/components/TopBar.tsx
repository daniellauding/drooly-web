import { Search, Bell, MessageSquare, PlusCircle, Home } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { Badge } from "./ui/badge";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "./ui/use-toast";
import { useState } from "react";
import { SearchDialog } from "./navigation/SearchDialog";
import { ProfileDropdown } from "./navigation/ProfileDropdown";
import { AuthModal } from "./auth/AuthModal";

export function TopBar() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchOpen, setSearchOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const { data: unreadMessagesCount = 0 } = useQuery({
    queryKey: ['unreadMessages', user?.uid],
    queryFn: async () => {
      if (!user) return 0;
      try {
        const messagesRef = collection(db, "messages");
        const q = query(
          messagesRef,
          where("recipientId", "==", user.uid),
          where("read", "==", false)
        );
        const snapshot = await getDocs(q);
        return snapshot.size;
      } catch (error) {
        console.error("Error fetching unread messages:", error);
        return 0;
      }
    },
    enabled: !!user,
  });

  // Fetch notifications count
  const { data: unreadNotificationsCount = 0 } = useQuery({
    queryKey: ['unreadNotifications', user?.uid],
    queryFn: async () => {
      if (!user) return 0;
      try {
        const notificationsRef = collection(db, "notifications");
        const q = query(
          notificationsRef,
          where("userId", "==", user.uid),
          where("read", "==", false)
        );
        const snapshot = await getDocs(q);
        return snapshot.size;
      } catch (error) {
        console.error("Error fetching notifications:", error);
        return 0;
      }
    },
    enabled: !!user,
  });

  const handleNotificationsClick = () => {
    toast({
      title: "Coming Soon",
      description: "Notifications feature will be available soon!",
    });
  };

  const handleCreateClick = () => {
    if (!user) {
      setAuthModalOpen(true);
    } else {
      navigate('/create');
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b">
      <div className="flex items-center gap-4 px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <img src="/lovable-uploads/e7734f7b-7b98-4c29-9f0f-1cd60bacbfac.png" alt="Recipe App" className="h-8 w-8" />
          <h1 className="text-2xl font-bold text-[#2C3E50]">Yummy</h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="ml-2"
          onClick={() => navigate('/')}
        >
          <Home className="h-5 w-5" />
        </Button>
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            className="pl-9 bg-[#F7F9FC] border-none rounded-2xl" 
            placeholder="Search recipes, users, events..." 
            onClick={() => setSearchOpen(true)}
            readOnly
          />
        </div>
        <div className="flex items-center gap-2">
          {user && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={handleNotificationsClick}
              >
                <Bell className="h-5 w-5" />
                {unreadNotificationsCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">
                    {unreadNotificationsCount}
                  </Badge>
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => navigate('/messages')}
              >
                <MessageSquare className="h-5 w-5" />
                {unreadMessagesCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">
                    {unreadMessagesCount}
                  </Badge>
                )}
              </Button>
            </>
          )}
          <Button
            variant="default"
            className="gap-2"
            onClick={handleCreateClick}
          >
            <PlusCircle className="h-4 w-4" />
            Create
          </Button>
          <ProfileDropdown />
        </div>
      </div>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </div>
  );
}
