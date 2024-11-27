import { Home, MessageSquare, User, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function BottomBar() {
  const location = useLocation();
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t md:hidden">
      <nav className="flex items-center justify-around p-4 max-w-xl mx-auto">
        <Link to="/" className={`nav-item ${location.pathname === "/" ? "active" : ""}`}>
          <div className="p-2 rounded-xl hover:bg-[#F7F9FC] transition-colors">
            <Home className="h-6 w-6" />
          </div>
          <span className="text-xs font-medium">Home</span>
        </Link>
        <Link to="/profile" className={`nav-item ${location.pathname === "/profile" ? "active" : ""}`}>
          <div className="p-2 rounded-xl hover:bg-[#F7F9FC] transition-colors">
            <User className="h-6 w-6" />
          </div>
          <span className="text-xs font-medium">Profile</span>
        </Link>
        <Link to="/messages" className={`nav-item ${location.pathname === "/messages" ? "active" : ""}`}>
          <div className="p-2 rounded-xl hover:bg-[#F7F9FC] transition-colors">
            <MessageSquare className="h-6 w-6" />
          </div>
          <span className="text-xs font-medium">Messages</span>
        </Link>
        <Link to="/settings" className={`nav-item ${location.pathname === "/settings" ? "active" : ""}`}>
          <div className="p-2 rounded-xl hover:bg-[#F7F9FC] transition-colors">
            <Settings className="h-6 w-6" />
          </div>
          <span className="text-xs font-medium">Settings</span>
        </Link>
      </nav>
    </div>
  );
}