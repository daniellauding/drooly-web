import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  onSearchClick: () => void;
}

export function SearchBar({ onSearchClick }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input 
        className="pl-9 bg-[#F7F9FC] border-none rounded-2xl" 
        placeholder="Search recipes..." 
        onClick={onSearchClick}
        readOnly
      />
    </div>
  );
}