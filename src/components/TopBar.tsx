import { Search } from "lucide-react";
import { Input } from "./ui/input";

export function TopBar() {
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
      </div>
    </div>
  );
}