import { Home, Search, Heart, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function BottomBar() {
  const location = useLocation();
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-xl border-t border-white/10">
      <nav className="flex items-center justify-around p-4 max-w-xl mx-auto">
        <Link to="/" className={`nav-item group ${location.pathname === "/" ? "text-purple-400" : "text-white/50"}`}>
          <div className="p-3 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors duration-300">
            <Home className="h-6 w-6" />
          </div>
          <span className="text-xs font-medium mt-1">Home</span>
        </Link>
        <Link to="/search" className={`nav-item group ${location.pathname === "/search" ? "text-purple-400" : "text-white/50"}`}>
          <div className="p-3 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors duration-300">
            <Search className="h-6 w-6" />
          </div>
          <span className="text-xs font-medium mt-1">Search</span>
        </Link>
        <Link to="/favorites" className={`nav-item group ${location.pathname === "/favorites" ? "text-purple-400" : "text-white/50"}`}>
          <div className="p-3 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors duration-300">
            <Heart className="h-6 w-6" />
          </div>
          <span className="text-xs font-medium mt-1">Favorites</span>
        </Link>
        <Link to="/profile" className={`nav-item group ${location.pathname === "/profile" ? "text-purple-400" : "text-white/50"}`}>
          <div className="p-3 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors duration-300">
            <User className="h-6 w-6" />
          </div>
          <span className="text-xs font-medium mt-1">Profile</span>
        </Link>
      </nav>
    </div>
  );
}