import { Button } from "@/components/ui/button";
import { Globe, Bot, Instagram, Youtube, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function RecipeCreationOptions() {
  return (
    <div className="mb-8 flex gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full">
            Create Recipe From <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuItem>
            <Globe className="mr-2 h-4 w-4" />
            Web Scrape URL
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Bot className="mr-2 h-4 w-4" />
            AI Assistant
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Instagram className="mr-2 h-4 w-4" />
            Import from Instagram
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Youtube className="mr-2 h-4 w-4" />
            Import from YouTube
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}