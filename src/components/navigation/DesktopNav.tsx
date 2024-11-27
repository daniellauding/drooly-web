import { Link } from "react-router-dom";
import { Home, MessageSquare, Bell, Calendar, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProfileDropdown } from "./ProfileDropdown";
import { SearchBar } from "./SearchBar";

interface DesktopNavProps {
  unreadNotifications: number;
  unreadMessages: number;
  isVerifiedOrSuperadmin: boolean;
  handleNotificationsClick: () => void;
  handleCreateClick: () => void;
  onAuthModalOpen: () => void;
  onSearchClick: () => void;
}

export function DesktopNav({
  unreadNotifications,
  unreadMessages,
  isVerifiedOrSuperadmin,
  handleNotificationsClick,
  handleCreateClick,
  onAuthModalOpen,
  onSearchClick,
}: DesktopNavProps) {
  return (
    <div className="flex items-center gap-4">
      <Link to="/" className="text-gray-600 hover:text-gray-900">
        <Home className="h-5 w-5" />
      </Link>
      
      <div className="flex-1 max-w-xl mx-4">
        <SearchBar onSearchClick={onSearchClick} />
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          onClick={handleNotificationsClick}
        >
          <Bell className="h-5 w-5" />
          {unreadNotifications > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">
              {unreadNotifications}
            </Badge>
          )}
        </Button>

        <Link to="/messages" className="relative">
          <Button variant="ghost" size="icon">
            <MessageSquare className="h-5 w-5" />
            {unreadMessages > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">
                {unreadMessages}
              </Badge>
            )}
          </Button>
        </Link>

        <Link to="/events">
          <Button variant="ghost" size="icon">
            <Calendar className="h-5 w-5" />
          </Button>
        </Link>

        {isVerifiedOrSuperadmin && (
          <Button
            variant="default"
            size="icon"
            onClick={handleCreateClick}
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}

        <ProfileDropdown onAuthModalOpen={onAuthModalOpen} />
      </div>
    </div>
  );
}