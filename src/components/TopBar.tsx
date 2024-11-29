import { Link } from "react-router-dom";
import { Logo } from "./navigation/Logo";
import { DesktopNav } from "./navigation/DesktopNav";
import { MobileMenu } from "./navigation/MobileMenu";
import { useState } from "react";
import { SearchDialog } from "./navigation/SearchDialog";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "./auth/AuthModal";

export function TopBar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { user } = useAuth();

  const unreadNotifications = 0; // This would come from a notifications context/service
  const unreadMessages = 0; // This would come from a messages context/service
  const isVerifiedOrSuperadmin = user?.emailVerified || user?.role === 'superadmin';

  const handleNotificationsClick = () => {
    console.log("Notifications clicked");
  };

  const handleCreateClick = () => {
    console.log("Create clicked");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <Logo />
          
          <div className="hidden md:flex flex-1 items-center justify-end gap-4">
            <DesktopNav 
              unreadNotifications={unreadNotifications}
              unreadMessages={unreadMessages}
              isVerifiedOrSuperadmin={isVerifiedOrSuperadmin}
              handleNotificationsClick={handleNotificationsClick}
              handleCreateClick={handleCreateClick}
              onAuthModalOpen={() => setAuthModalOpen(true)}
              onSearchClick={() => setSearchOpen(true)}
            />
          </div>

          <div className="md:hidden">
            <MobileMenu 
              onAuthModalOpen={() => setAuthModalOpen(true)}
              onEditProfileOpen={() => {}}
              onSearchClick={() => setSearchOpen(true)}
              unreadNotifications={unreadNotifications}
              unreadMessages={unreadMessages}
              isVerifiedOrSuperadmin={isVerifiedOrSuperadmin}
              handleNotificationsClick={handleNotificationsClick}
              handleCreateClick={handleCreateClick}
            />
          </div>
        </div>
      </div>

      <SearchDialog 
        open={searchOpen} 
        onOpenChange={setSearchOpen} 
      />

      <AuthModal 
        open={authModalOpen}
        onOpenChange={setAuthModalOpen}
        defaultTab="login"
      />
    </header>
  );
}