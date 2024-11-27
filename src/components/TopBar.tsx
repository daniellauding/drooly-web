import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "./ui/use-toast";
import { SearchDialog } from "./navigation/SearchDialog";
import { AuthModal } from "./auth/AuthModal";
import { EmailVerificationBanner } from "./auth/EmailVerificationBanner";
import { EditProfileModal } from "./profile/EditProfileModal";
import { MobileMenu } from "./navigation/MobileMenu";
import { Logo } from "./navigation/Logo";
import { DesktopNav } from "./navigation/DesktopNav";
import { SearchBar } from "./navigation/SearchBar";

export function TopBar() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchOpen, setSearchOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);

  const isVerifiedOrSuperadmin = user?.emailVerified || user?.manuallyVerified || user?.role === 'superadmin';

  const { data: unreadMessagesCount = 0 } = useQuery({
    queryKey: ['unreadMessages', user?.uid],
    queryFn: async () => {
      if (!user) return 0;
      const messagesRef = collection(db, "messages");
      const q = query(
        messagesRef,
        where("recipientId", "==", user.uid),
        where("read", "==", false)
      );
      const snapshot = await getDocs(q);
      return snapshot.size;
    },
    enabled: !!user,
  });

  const { data: unreadNotificationsCount = 0 } = useQuery({
    queryKey: ['unreadNotifications', user?.uid],
    queryFn: async () => {
      if (!user) return 0;
      const notificationsRef = collection(db, "notifications");
      const q = query(
        notificationsRef,
        where("userId", "==", user.uid),
        where("read", "==", false)
      );
      const snapshot = await getDocs(q);
      return snapshot.size;
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
        <div className="flex items-center gap-6">
          <Logo />
          <div className="hidden md:flex items-center gap-6">
            <DesktopNav
              unreadNotifications={unreadNotificationsCount}
              unreadMessages={unreadMessagesCount}
              isVerifiedOrSuperadmin={isVerifiedOrSuperadmin}
              handleNotificationsClick={handleNotificationsClick}
              handleCreateClick={handleCreateClick}
              onAuthModalOpen={() => setAuthModalOpen(true)}
              onSearchClick={() => setSearchOpen(true)}
            />
          </div>
        </div>

        <div className="md:hidden">
          <MobileMenu 
            onAuthModalOpen={() => setAuthModalOpen(true)}
            onEditProfileOpen={() => setEditProfileOpen(true)}
            onSearchClick={() => setSearchOpen(true)}
            unreadNotifications={unreadNotificationsCount}
            unreadMessages={unreadMessagesCount}
            isVerifiedOrSuperadmin={isVerifiedOrSuperadmin}
            handleNotificationsClick={handleNotificationsClick}
            handleCreateClick={handleCreateClick}
          />
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
