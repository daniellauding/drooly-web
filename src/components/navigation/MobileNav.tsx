import { Link, useLocation } from "react-router-dom";
import { Home, PlusCircle, User, Settings, CookingPot } from "lucide-react";

export function MobileNav() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t h-16 px-4 flex items-center justify-around z-50 md:hidden">
      <Link 
        to="/" 
        className={`flex flex-col items-center ${isActive('/') ? 'text-primary' : 'text-muted-foreground'}`}
      >
        <Home className="h-6 w-6" />
        <span className="text-xs mt-1">Home</span>
      </Link>
      
      <Link 
        to="/ingredients" 
        className={`flex flex-col items-center ${isActive('/ingredients') ? 'text-primary' : 'text-muted-foreground'}`}
      >
        <CookingPot className="h-6 w-6" />
        <span className="text-xs mt-1">To Cook</span>
      </Link>

      <Link 
        to="/create" 
        className={`flex flex-col items-center ${isActive('/create') ? 'text-primary' : 'text-muted-foreground'}`}
      >
        <PlusCircle className="h-6 w-6" />
        <span className="text-xs mt-1">Create</span>
      </Link>

      <Link 
        to="/profile" 
        className={`flex flex-col items-center ${isActive('/profile') ? 'text-primary' : 'text-muted-foreground'}`}
      >
        <User className="h-6 w-6" />
        <span className="text-xs mt-1">Profile</span>
      </Link>

      <Link 
        to="/settings" 
        className={`flex flex-col items-center ${isActive('/settings') ? 'text-primary' : 'text-muted-foreground'}`}
      >
        <Settings className="h-6 w-6" />
        <span className="text-xs mt-1">Settings</span>
      </Link>
    </nav>
  );
}