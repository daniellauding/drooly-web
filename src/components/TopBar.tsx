import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search, Bell, MessageSquare, PlusCircle, Menu } from "lucide-react";
import { Badge } from "./ui/badge";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useToast } from "./ui/use-toast";
import { useState } from "react";
import { SearchDialog } from "./navigation/SearchDialog";
import { ProfileDropdown } from "./navigation/ProfileDropdown";
import { AuthModal } from "./auth/AuthModal";
import { EmailVerificationBanner } from "./auth/EmailVerificationBanner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function TopBar() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchOpen, setSearchOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

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
        {/* Mobile Menu */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="py-4 space-y-4">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start" 
                  onClick={() => navigate('/')}
                >
                  Home
                </Button>
                {user && (
                  <>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start"
                      onClick={() => navigate('/profile')}
                    >
                      Profile
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start"
                      onClick={() => navigate('/messages')}
                    >
                      Messages
                    </Button>
                    {user.role === 'superadmin' && (
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start"
                        onClick={() => navigate('/backoffice')}
                      >
                        Backoffice
                      </Button>
                    )}
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo */}
        <div className="flex items-center gap-3">
          <img src="/lovable-uploads/e7734f7b-7b98-4c29-9f0f-1cd60bacbfac.png" alt="Recipe App" className="h-8 w-8" />
          <h1 className="text-2xl font-bold text-[#2C3E50] hidden sm:block">Yummy</h1>
        </div>

        {/* Search Bar - Hidden on Mobile */}
        <div className="hidden md:flex items-center gap-4 flex-1 justify-center max-w-xl">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              className="pl-9 bg-[#F7F9FC] border-none rounded-2xl" 
              placeholder="Search recipes..." 
              onClick={() => setSearchOpen(true)}
              readOnly
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {user && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="relative hidden sm:flex"
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
                className="relative hidden sm:flex"
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
                  className="gap-2 hidden sm:flex"
                  onClick={handleCreateClick}
                >
                  <PlusCircle className="h-4 w-4" />
                  Create
                </Button>
              )}
            </>
          )}
          <ProfileDropdown onAuthModalOpen={() => setAuthModalOpen(true)} />
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            className="pl-9 bg-[#F7F9FC] border-none rounded-2xl" 
            placeholder="Search recipes..." 
            onClick={() => setSearchOpen(true)}
            readOnly
          />
        </div>
      </div>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
      <EmailVerificationBanner />
    </div>
  );
}