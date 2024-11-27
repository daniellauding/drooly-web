import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "./ui/button";
import { Bell, MessageSquare, PlusCircle } from "lucide-react";
import { Badge } from "./ui/badge";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useToast } from "./ui/use-toast";
import { SearchDialog } from "./navigation/SearchDialog";
import { AuthModal } from "./auth/AuthModal";
import { EmailVerificationBanner } from "./auth/EmailVerificationBanner";
import { EditProfileModal } from "./profile/EditProfileModal";
import { MobileMenu } from "./navigation/MobileMenu";
import { Logo } from "./navigation/Logo";
import { SearchBar } from "./navigation/SearchBar";

export function TopBar() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchOpen, setSearchOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);

  // Check if user is verified through either method or is superadmin
  const isVerifiedOrSuperadmin = user?.emailVerified || user?.manuallyVerified || user?.role === 'superadmin';

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

  const handleRestrictedAction = () => {
    if (!isVerifiedOrSuperadmin) {
      toast({
        title: "Email verification required",
        description: "Please verify your email to access this feature.",
        variant: "destructive"
      });
      return true;
    }
    return false;
  };

  const handleNotificationsClick = () => {
    if (handleRestrictedAction()) return;
    
    toast({
      title: "Coming Soon",
      description: "Notifications feature will be available soon!",
    });
  };

  const handleCreateClick = () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    if (handleRestrictedAction()) return;
    
    navigate('/create');
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b">
      <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 md:gap-4">
          <Logo />
          <MobileMenu 
            onAuthModalOpen={() => setAuthModalOpen(true)}
            onEditProfileOpen={() => setEditProfileOpen(true)}
          />
        </div>

        {/* Search Bar - Shown inline on mobile */}
        <div className="flex md:hidden flex-1 mx-2">
          <SearchBar onSearchClick={() => setSearchOpen(true)} />
        </div>

        {/* Right Actions - Hidden on Mobile */}
        <div className="hidden sm:flex items-center gap-2">
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
                onClick={() => {
                  if (handleRestrictedAction()) return;
                  navigate('/messages');
                }}
              >
                <MessageSquare className="h-5 w-5" />
                {unreadMessagesCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">
                    {unreadMessagesCount}
                  </Badge>
                )}
              </Button>
              {isVerifiedOrSuperadmin && (
                <Button
                  variant="default"
                  className="gap-2"
                  onClick={handleCreateClick}
                >
                  <PlusCircle className="h-4 w-4" />
                  Create
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
      <EmailVerificationBanner />
      {user && (
        <EditProfileModal
          open={editProfileOpen}
          onOpenChange={setEditProfileOpen}
          userData={{
            id: user.uid,
            name: user.displayName || "",
            email: user.email || "",
            avatarUrl: user.photoURL || "",
          }}
          isAdmin={user?.role === 'superadmin'}
          onUpdate={() => {
            console.log("Profile updated");
            setEditProfileOpen(false);
          }}
        />
      )}
    </div>
  );
}
