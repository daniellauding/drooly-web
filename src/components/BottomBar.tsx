import { Home, Search, Heart, User, Calendar } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function BottomBar() {
  const location = useLocation();
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t">
      <nav className="flex items-center justify-around p-4 max-w-xl mx-auto">
        <Link to="/" className={`nav-item ${location.pathname === "/" ? "active" : ""}`}>
          <div className="p-2 rounded-xl hover:bg-[#F7F9FC] transition-colors">
            <Home className="h-6 w-6" />
          </div>
          <span className="text-xs font-medium">Home</span>
        </Link>
        <Link to="/plan" className={`nav-item ${location.pathname === "/plan" ? "active" : ""}`}>
          <div className="p-2 rounded-xl hover:bg-[#F7F9FC] transition-colors">
            <Calendar className="h-6 w-6" />
          </div>
          <span className="text-xs font-medium">Plan</span>
        </Link>
        <Link to="/search" className={`nav-item ${location.pathname === "/search" ? "active" : ""}`}>
          <div className="p-2 rounded-xl hover:bg-[#F7F9FC] transition-colors">
            <Search className="h-6 w-6" />
          </div>
          <span className="text-xs font-medium">Search</span>
        </Link>
        <Link to="/favorites" className={`nav-item ${location.pathname === "/favorites" ? "active" : ""}`}>
          <div className="p-2 rounded-xl hover:bg-[#F7F9FC] transition-colors">
            <Heart className="h-6 w-6" />
          </div>
          <span className="text-xs font-medium">Favorites</span>
        </Link>
        <Link to="/profile" className={`nav-item ${location.pathname === "/profile" ? "active" : ""}`}>
          <div className="p-2 rounded-xl hover:bg-[#F7F9FC] transition-colors">
            <User className="h-6 w-6" />
          </div>
          <span className="text-xs font-medium">Profile</span>
        </Link>
      </nav>
    </div>
  );
}