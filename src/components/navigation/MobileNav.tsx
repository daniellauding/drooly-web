import { Link } from "react-router-dom";
import { Home, MessageSquare, User, Plus } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

export function MobileNav() {
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const handleCreateClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      toast({
        title: "Login Required",
        description: "Please login to create content",
        variant: "destructive"
      });
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t md:hidden">
      <div className="flex items-center justify-around p-4 max-w-xl mx-auto">
        <Link to="/" className={`nav-item ${location.pathname === "/" ? "active" : ""}`}>
          <div className="p-2 rounded-xl hover:bg-[#F7F9FC] transition-colors">
            <Home className="h-6 w-6" />
          </div>
          <span className="text-xs font-medium">Home</span>
        </Link>
        <Link 
          to={user ? "/create" : "/login"} 
          onClick={handleCreateClick}
          className={`nav-item ${location.pathname === "/create" ? "active" : ""}`}
        >
          <div className="p-2 rounded-full bg-[#4ECDC4] hover:bg-[#45b8b0] transition-colors">
            <Plus className="h-6 w-6 text-white" />
          </div>
        </Link>
        <Link to="/profile" className={`nav-item ${location.pathname === "/profile" ? "active" : ""}`}>
          <div className="p-2 rounded-xl hover:bg-[#F7F9FC] transition-colors">
            <User className="h-6 w-6" />
          </div>
          <span className="text-xs font-medium">Profile</span>
        </Link>
      </div>
    </nav>
  );
}