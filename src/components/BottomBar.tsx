import { Home, Search, Heart, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function BottomBar() {
  const location = useLocation();
  
  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 bg-white/80 backdrop-blur-lg rounded-2xl border shadow-lg">
      <nav className="flex items-center justify-around p-3">
        <Link to="/" className={`nav-item ${location.pathname === "/" ? "active" : ""}`}>
          <div className="p-2 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 hover:from-primary/20 hover:to-secondary/20 transition-colors">
            <Home className="h-6 w-6" />
          </div>
          <span className="text-xs font-medium">Home</span>
        </Link>
        <Link to="/search" className={`nav-item ${location.pathname === "/search" ? "active" : ""}`}>
          <div className="p-2 rounded-xl bg-gradient-to-r from-secondary/10 to-accent/10 hover:from-secondary/20 hover:to-accent/20 transition-colors">
            <Search className="h-6 w-6" />
          </div>
          <span className="text-xs font-medium">Search</span>
        </Link>
        <Link to="/favorites" className={`nav-item ${location.pathname === "/favorites" ? "active" : ""}`}>
          <div className="p-2 rounded-xl bg-gradient-to-r from-accent/10 to-primary/10 hover:from-accent/20 hover:to-primary/20 transition-colors">
            <Heart className="h-6 w-6" />
          </div>
          <span className="text-xs font-medium">Favorites</span>
        </Link>
        <Link to="/profile" className={`nav-item ${location.pathname === "/profile" ? "active" : ""}`}>
          <div className="p-2 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 hover:from-primary/20 hover:to-accent/20 transition-colors">
            <User className="h-6 w-6" />
          </div>
          <span className="text-xs font-medium">Profile</span>
        </Link>
      </nav>
    </div>
  );
}