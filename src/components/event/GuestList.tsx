import { Users, Heart, UtensilsCrossed, Plus, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { EventGuest } from "@/types/event";
import { GuestAutocomplete } from "./GuestAutocomplete";
import { UserSearchAutocomplete } from "./UserSearchAutocomplete"; // Added this import
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface GuestListProps {
  guests: EventGuest[];
  onAddGuest: (guest: EventGuest) => void;
  onRemoveGuest: (guestId: string) => void;
}

export function GuestList({ guests, onAddGuest, onRemoveGuest }: GuestListProps) {
  const [newGuestEmail, setNewGuestEmail] = useState("");

  const handleAddGuest = (email: string, existingUser: boolean) => {
    if (!email.trim()) return;

    onAddGuest({
      id: crypto.randomUUID(),
      name: email,
      status: "pending",
      plusOne: false,
      dietaryRestrictions: "",
    });
  };

  return (
    <Accordion type="single" collapsible defaultValue="guests" className="w-full">
      <AccordionItem value="guests">
        <AccordionTrigger>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <span className="font-medium">Who?</span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <Card className="p-6 space-y-4">
            <p className="text-muted-foreground">
              Please RSVP below and feel free to invite 1-2 friends
            </p>

            <div className="flex gap-2">
              <UserSearchAutocomplete
                value={newGuestEmail}
                onChange={setNewGuestEmail}
                onSelect={handleAddGuest}
              />
            </div>

            {guests.length > 0 && (
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr className="text-left">
                      <th className="p-3">Name</th>
                      <th className="p-3">Coming!</th>
                      <th className="p-3">
                        <Heart className="h-4 w-4" />
                      </th>
                      <th className="p-3">Dietary Restrictions</th>
                      <th className="p-3">
                        <UtensilsCrossed className="h-4 w-4" />
                      </th>
                      <th className="p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {guests.map((guest) => (
                      <tr key={guest.id} className="border-t">
                        <td className="p-3">{guest.name}</td>
                        <td className="p-3">
                          <Checkbox checked={guest.status === "coming"} />
                        </td>
                        <td className="p-3">
                          <Checkbox checked={guest.plusOne} />
                        </td>
                        <td className="p-3">{guest.dietaryRestrictions}</td>
                        <td className="p-3">{guest.cooking?.recipeName}</td>
                        <td className="p-3">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onRemoveGuest(guest.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-muted/50">
                    <tr>
                      <td className="p-3 text-sm text-muted-foreground">COUNT</td>
                      <td className="p-3">{guests.filter(g => g.status === "coming").length}</td>
                      <td className="p-3">
                        {guests.filter(g => g.plusOne).length}
                      </td>
                      <td colSpan={3}></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </Card>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}