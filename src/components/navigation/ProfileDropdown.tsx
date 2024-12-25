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
import { Settings, LogOut, User, ChevronDown, LayoutDashboard } from "lucide-react";
import { useState, useEffect } from "react";
import { EditProfileModal } from "@/components/profile/EditProfileModal";
import { useToast } from "@/hooks/use-toast";
import { signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { debugViews } from "@/utils/debugViews";
import { useViewLogger } from '@/hooks/useViewLogger';

interface ProfileDropdownProps {
  onAuthModalOpen: () => void;
}

export function ProfileDropdown({ onAuthModalOpen }: ProfileDropdownProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const viewId = useViewLogger('ProfileDropdown');

  useEffect(() => {
    if (user) {
      debugViews.log('ProfileDropdown', 'USER_STATE', {
        viewId,
        userId: user.uid,
        role: user.role,
        hasAvatar: !!user.photoURL,
        timestamp: Date.now()
      });
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      // First try Firebase signout
      await firebaseSignOut(auth);
      
      // Then clear all storage
      localStorage.clear();
      sessionStorage.clear();
      
      // Show success message
      toast({
        title: "Success",
        description: "You have been logged out successfully"
      });

      // Force page reload to clear any cached states
      window.location.href = '/';
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log out. Please try again."
      });
    }
  };

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

  const userInitial = (user.displayName || user.email || "U")[0].toUpperCase();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center gap-2 cursor-pointer">
            <Avatar className="h-8 w-8">
              {user.photoURL ? (
                <AvatarImage 
                  src={user.photoURL} 
                  alt={user.displayName || user.email || "User avatar"}
                  className="object-cover w-full h-full"
                />
              ) : (
                <AvatarFallback>{userInitial}</AvatarFallback>
              )}
            </Avatar>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={() => navigate('/profile')}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          {user.role === 'superadmin' && (
            <DropdownMenuItem onClick={() => navigate('/backoffice')}>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Backoffice</span>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => setEditProfileOpen(true)}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={handleLogout}>
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