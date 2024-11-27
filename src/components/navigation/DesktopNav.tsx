import { Link } from "react-router-dom";
import { Home, MessageSquare, Bell, Calendar, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProfileDropdown } from "./ProfileDropdown";
import { SearchBar } from "./SearchBar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CreateOptions } from "../create/CreateOptions";

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
  onAuthModalOpen,
}: DesktopNavProps) {
  return (
    <div className="flex items-center gap-6">
      <Link to="/" className="text-gray-600 hover:text-gray-900">
        <Home className="h-5 w-5" />
      </Link>

      <div className="w-[320px]">
        <SearchBar onSearchClick={() => onSearchClick()} />
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
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-4">Create</h2>
                <CreateOptions />
              </div>
            </DialogContent>
          </Dialog>
        )}

        <ProfileDropdown onAuthModalOpen={onAuthModalOpen} />
      </div>
    </div>
  );
}