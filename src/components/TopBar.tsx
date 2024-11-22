import { Search } from "lucide-react";
import { Input } from "./ui/input";

export function TopBar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center gap-4 border-b bg-background/80 px-4 py-3 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <img src="/lovable-uploads/e7734f7b-7b98-4c29-9f0f-1cd60bacbfac.png" alt="Recipe App" className="h-8 w-8" />
        <h1 className="text-xl font-bold text-primary-foreground">Yummy</h1>
      </div>
      <div className="relative flex-1 max-w-md ml-auto">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input className="pl-9 bg-muted" placeholder="Search recipes..." />
      </div>
    </div>
  );
}