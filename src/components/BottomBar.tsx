import { Home, Search, Heart, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function BottomBar() {
  const location = useLocation();
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/80 backdrop-blur-sm">
      <nav className="flex items-center justify-around p-3">
        <Link to="/" className={`nav-item ${location.pathname === "/" ? "active" : ""}`}>
          <Home className="h-6 w-6" />
          <span className="text-xs">Home</span>
        </Link>
        <Link to="/search" className={`nav-item ${location.pathname === "/search" ? "active" : ""}`}>
          <Search className="h-6 w-6" />
          <span className="text-xs">Search</span>
        </Link>
        <Link to="/favorites" className={`nav-item ${location.pathname === "/favorites" ? "active" : ""}`}>
          <Heart className="h-6 w-6" />
          <span className="text-xs">Favorites</span>
        </Link>
        <Link to="/profile" className={`nav-item ${location.pathname === "/profile" ? "active" : ""}`}>
          <User className="h-6 w-6" />
          <span className="text-xs">Profile</span>
        </Link>
      </nav>
    </div>
  );
}