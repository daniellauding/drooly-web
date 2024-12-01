import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EventGuest } from "@/types/event";
import { Settings2 } from "lucide-react";

interface EventRoleManagerProps {
  guest: EventGuest;
  isCreator: boolean;
  onRoleChange: (guestId: string, role: string) => void;
  onRemoveGuest: (guestId: string) => void;
}

export function EventRoleManager({ guest, isCreator, onRoleChange, onRemoveGuest }: EventRoleManagerProps) {
  if (!isCreator) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings2 className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onRoleChange(guest.id, "admin")}>
          Make Admin
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onRoleChange(guest.id, "guest")}>
          Set as Guest
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="text-destructive"
          onClick={() => onRemoveGuest(guest.id)}
        >
          Remove from Event
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}