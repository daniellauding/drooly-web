import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, LogOut, User, Settings, LayoutDashboard, Bell, MessageSquare, Calendar, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface MobileMenuProps {
  onAuthModalOpen: () => void;
  onEditProfileOpen: () => void;
  onSearchClick: () => void;
  unreadNotifications: number;
  unreadMessages: number;
  isVerifiedOrSuperadmin: boolean;
  handleNotificationsClick: () => void;
  handleCreateClick: () => void;
}

export function MobileMenu({ 
  onAuthModalOpen, 
  onEditProfileOpen,
  onSearchClick,
  unreadNotifications,
  unreadMessages,
  isVerifiedOrSuperadmin,
  handleNotificationsClick,
  handleCreateClick
}: MobileMenuProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-4">
            {user ? (
              <>
                <Avatar className="h-10 w-10">
                  {user.photoURL && (
                    <AvatarImage 
                      src={user.photoURL} 
                      alt={user.displayName || user.email || "User avatar"}
                    />
                  )}
                  <AvatarFallback>
                    {(user.displayName || user.email || "U")[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <p className="font-semibold">{user.displayName || 'User'}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </>
            ) : (
              <div className="text-left">Menu</div>
            )}
          </SheetTitle>
        </SheetHeader>
        <div className="py-4 space-y-4">
          <Button 
            variant="ghost" 
            className="w-full justify-start" 
            onClick={onSearchClick}
          >
            Search
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start" 
            onClick={() => navigate('/')}
          >
            Home
          </Button>
          {user ? (
            <>
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={handleNotificationsClick}
              >
                <Bell className="mr-2 h-4 w-4" />
                Notifications
                {unreadNotifications > 0 && (
                  <Badge variant="secondary" className="ml-auto">
                    {unreadNotifications}
                  </Badge>
                )}
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => navigate('/messages')}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Messages
                {unreadMessages > 0 && (
                  <Badge variant="secondary" className="ml-auto">
                    {unreadMessages}
                  </Badge>
                )}
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => navigate('/events')}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Events
              </Button>
              {isVerifiedOrSuperadmin && (
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  onClick={handleCreateClick}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create
                </Button>
              )}
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => navigate('/profile')}
              >
                <User className="mr-2 h-4 w-4" />
                Profile
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={onEditProfileOpen}
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
              {user.role === 'superadmin' && (
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  onClick={() => navigate('/backoffice')}
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Backoffice
                </Button>
              )}
              <Button 
                variant="ghost" 
                className="w-full justify-start text-red-500"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </Button>
            </>
          ) : (
            <Button 
              variant="default" 
              className="w-full"
              onClick={onAuthModalOpen}
            >
              Login / Register
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}