import { Search, Bell, MessageSquare, PlusCircle } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { Badge } from "./ui/badge";

export function TopBar() {
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b">
      <div className="flex items-center gap-4 px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <img src="/lovable-uploads/e7734f7b-7b98-4c29-9f0f-1cd60bacbfac.png" alt="Recipe App" className="h-8 w-8" />
          <h1 className="text-2xl font-bold text-[#2C3E50]">Yummy</h1>
        </div>
        <div className="relative flex-1 max-w-md ml-auto">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            className="pl-9 bg-[#F7F9FC] border-none rounded-2xl" 
            placeholder="Find recipes..." 
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => navigate('/notifications')}
          >
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">3</Badge>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => navigate('/messages')}
          >
            <MessageSquare className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">2</Badge>
          </Button>
          <Button
            variant="default"
            className="gap-2"
            onClick={() => navigate('/create-recipe')}
          >
            <PlusCircle className="h-4 w-4" />
            Create Recipe
          </Button>
        </div>
      </div>
    </div>
  );
}