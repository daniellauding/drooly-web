import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, LogOut, User, ChevronDown } from "lucide-react";
import { useState } from "react";
import { EditProfileModal } from "@/components/profile/EditProfileModal";

interface ProfileDropdownProps {
  onAuthModalOpen: () => void;
}

export function ProfileDropdown({ onAuthModalOpen }: ProfileDropdownProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [editProfileOpen, setEditProfileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // If user is not logged in, show a simple avatar that opens auth modal
  if (!user) {
    return (
      <div 
        onClick={onAuthModalOpen}
        className="cursor-pointer flex items-center gap-2"
        title="Login or Register"
      >
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-gray-100">
            <User className="h-4 w-4 text-gray-500" />
          </AvatarFallback>
        </Avatar>
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center gap-2 cursor-pointer">
            <Avatar className="h-8 w-8">
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
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={() => navigate('/profile')}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setEditProfileOpen(true)}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

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
    </>
  );
}