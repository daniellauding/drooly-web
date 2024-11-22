import { Search } from "lucide-react";
import { Input } from "./ui/input";

export function TopBar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 border-b bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 backdrop-blur-lg">
      <div className="flex items-center gap-4 px-4 py-3 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="bg-primary/20 p-2 rounded-xl rotate-3 hover:rotate-0 transition-transform">
            <img src="/lovable-uploads/e7734f7b-7b98-4c29-9f0f-1cd60bacbfac.png" alt="Recipe App" className="h-8 w-8" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Yummy</h1>
        </div>
        <div className="relative flex-1 max-w-md ml-auto">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            className="pl-9 bg-white/50 hover:bg-white/80 transition-colors border-none rounded-xl" 
            placeholder="Search recipes..." 
          />
        </div>
      </div>
    </div>
  );
}