import { Link, useNavigate } from "react-router-dom";
import { Home, User, Plus } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { CreateOptions } from "../create/CreateOptions";
import { useState } from "react";

export function MobileNav() {
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  
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

  const handleOptionSelect = (path: string) => {
    setOpen(false);
    navigate(path);
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
        
        {user ? (
          <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
              <button className="nav-item">
                <div className="p-2 rounded-full bg-primary hover:bg-primary/90 transition-colors">
                  <Plus className="h-6 w-6 text-primary-foreground" />
                </div>
              </button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-4">Create</h2>
                <div className="space-y-4">
                  {createOptions.map((option) => (
                    <button
                      key={option.title}
                      className="w-full flex items-start gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors text-left"
                      onClick={() => handleOptionSelect(option.path)}
                    >
                      <div className="p-2 rounded-full bg-purple-100">
                        <option.icon className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{option.title}</h3>
                        <p className="text-sm text-gray-600">{option.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        ) : (
          <Link 
            to="/login" 
            onClick={handleCreateClick}
            className="nav-item"
          >
            <div className="p-2 rounded-full bg-primary hover:bg-primary/90 transition-colors">
              <Plus className="h-6 w-6 text-primary-foreground" />
            </div>
          </Link>
        )}

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

const createOptions = [
  {
    title: "Create & Share",
    description: "Keep all your recipes in one place and share them with friends.",
    icon: Edit3,
    path: "/create-recipe"
  },
  {
    title: "Plan Together",
    description: "Create meal plans and organize food events with loved ones.",
    icon: Users,
    path: "/plan"
  },
  {
    title: "Share Stories",
    description: "Share your weekly food adventures and inspire others.",
    icon: Camera,
    path: "/stories/create"
  }
];