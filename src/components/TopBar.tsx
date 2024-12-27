import { Link, useNavigate } from "react-router-dom";
import { Logo } from "./navigation/Logo";
import { DesktopNav } from "./navigation/DesktopNav";
import { MobileMenu } from "./navigation/MobileMenu";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "./auth/AuthModal";
import { MoodInput } from "./home/MoodInput";
import { Home } from "lucide-react";
import { Button } from "./ui/button";
import { FeedbackBanner } from "./home/FeedbackBanner";
import { FeedbackModal } from "./home/FeedbackModal";
import { logger, LOG_GROUPS } from "@/utils/logger";

export function TopBar() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const unreadNotifications = 0;
  const unreadMessages = 0;
  const isVerifiedOrSuperadmin = user?.emailVerified || user?.role === 'superadmin';

  const handleFeedbackClick = () => {
    logger.log(LOG_GROUPS.UI, 'Feedback button clicked');
    setFeedbackModalOpen(true);
  };

  const handleNotificationsClick = () => {
    console.log("Notifications clicked");
  };

  const handleCreateClick = () => {
    console.log("Create clicked");
  };

  const handleMoodFilter = (category: string) => {
    console.log("Filtering by mood:", category);
    navigate('/?mood=' + category);
  };

  const handleAuthModalChange = (open: boolean) => {
    console.log('[TopBar] Setting auth modal state:', open);
    setAuthModalOpen(open);
  };

  return (
    <div>
      <FeedbackBanner onFeedbackClick={handleFeedbackClick} />
      
      <header className="z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center gap-4">
            <div className="flex items-center gap-4">
              <Logo />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/')}
                className="text-muted-foreground hover:text-foreground"
              >
                <Home className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex flex-1 items-center justify-between gap-4">
              {user && (
                <div className="flex-1">
                  <MoodInput onFilterChange={handleMoodFilter} />
                </div>
              )}
              <div className="hidden md:flex items-center gap-4">
                <DesktopNav 
                  unreadNotifications={unreadNotifications}
                  unreadMessages={unreadMessages}
                  isVerifiedOrSuperadmin={isVerifiedOrSuperadmin}
                  handleNotificationsClick={handleNotificationsClick}
                  handleCreateClick={handleCreateClick}
                  onAuthModalOpen={() => setAuthModalOpen(true)}
                />
              </div>
            </div>

            <div className="md:hidden">
              <MobileMenu 
                onAuthModalOpen={() => setAuthModalOpen(true)}
                onEditProfileOpen={() => {}}
                unreadNotifications={unreadNotifications}
                unreadMessages={unreadMessages}
                isVerifiedOrSuperadmin={isVerifiedOrSuperadmin}
                handleNotificationsClick={handleNotificationsClick}
                handleCreateClick={handleCreateClick}
              />
            </div>
          </div>
        </div>

        <AuthModal 
          open={authModalOpen}
          onOpenChange={handleAuthModalChange}
          defaultTab="login"
        />
        
        <FeedbackModal 
          open={feedbackModalOpen}
          onOpenChange={setFeedbackModalOpen}
        />
      </header>
    </div>
  );
}