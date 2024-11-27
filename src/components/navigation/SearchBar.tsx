import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  onSearchClick: () => void;
}

export function SearchBar({ onSearchClick }: SearchBarProps) {
  return (
    <div className="relative w-full">
      <Button 
        variant="ghost" 
        className="w-full flex items-center justify-start gap-2 bg-[#F7F9FC] hover:bg-[#F7F9FC]/80 h-9 px-3 rounded-2xl"
        onClick={onSearchClick}
      >
        <Search className="h-4 w-4 text-muted-foreground" />
        <span className="text-muted-foreground">Search recipes...</span>
      </Button>
    </div>
  );
}