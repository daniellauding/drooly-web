import { useAuth } from "@/contexts/AuthContext";
import { TopBar } from "@/components/TopBar";
import { BottomBar } from "@/components/BottomBar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen pb-20">
      <TopBar />
      <main className="container py-6 px-4 max-w-md mx-auto space-y-6">
        <div className="text-center space-y-4">
          <div className="w-24 h-24 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
            {user.email?.[0].toUpperCase()}
          </div>
          <h1 className="text-2xl font-bold">{user.email}</h1>
        </div>

        <div className="space-y-4">
          <Button 
            variant="destructive" 
            className="w-full"
            onClick={() => logout()}
          >
            Logout
          </Button>
        </div>
      </main>
      <BottomBar />
    </div>
  );
}