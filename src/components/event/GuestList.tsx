import { Users, Heart, UtensilsCrossed, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { EventGuest } from "@/types/event";

interface GuestListProps {
  guests: EventGuest[];
  onAddGuest: (guest: EventGuest) => void;
}

export function GuestList({ guests, onAddGuest }: GuestListProps) {
  const [newGuestEmail, setNewGuestEmail] = useState("");

  const handleAddGuest = () => {
    if (!newGuestEmail.trim()) return;

    onAddGuest({
      id: crypto.randomUUID(),
      name: newGuestEmail,
      status: "pending",
      plusOne: false,
      dietaryRestrictions: "",
    });

    setNewGuestEmail("");
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center gap-2 text-lg">
        <Users className="h-5 w-5" />
        <span className="font-medium">Who?</span>
      </div>
      
      <p className="text-muted-foreground pl-7">
        Please RSVP below and feel free to invite 1-2 friends
      </p>

      <div className="pl-7 space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Enter guest email"
            value={newGuestEmail}
            onChange={(e) => setNewGuestEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddGuest()}
          />
          <Button onClick={handleAddGuest}>
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
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
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </Card>
  );
}