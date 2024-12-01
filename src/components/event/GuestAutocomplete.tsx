import { useState, useEffect } from "react";
import { Command } from "@/components/ui/command";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check } from "lucide-react";

interface GuestAutocompleteProps {
  onSelect: (email: string) => void;
  value: string;
  onChange: (value: string) => void;
}

export function GuestAutocomplete({ onSelect, value, onChange }: GuestAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<{ email: string; name?: string }[]>([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!value || value.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const usersRef = collection(db, "users");
        const q = query(
          usersRef,
          where("email", ">=", value),
          where("email", "<=", value + "\uf8ff")
        );
        
        const querySnapshot = await getDocs(q);
        const users = querySnapshot.docs.map(doc => ({
          email: doc.data().email,
          name: doc.data().name
        }));
        
        setSuggestions(users);
      } catch (error) {
        console.error("Error fetching user suggestions:", error);
      }
    };

    fetchSuggestions();
  }, [value]);

  const handleSelect = (email: string) => {
    onSelect(email);
    onChange("");
    setOpen(false);
  };

  return (
    <Popover open={open && suggestions.length > 0} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter guest email"
          className="w-full"
          onKeyDown={(e) => {
            if (e.key === "Enter" && value) {
              e.preventDefault();
              handleSelect(value);
            }
          }}
        />
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command>
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.email}
              className="flex items-center gap-2 px-4 py-2 hover:bg-accent cursor-pointer"
              onClick={() => handleSelect(suggestion.email)}
            >
              <Check className="h-4 w-4 opacity-0 group-data-[selected]:opacity-100" />
              <div>
                <p>{suggestion.email}</p>
                {suggestion.name && (
                  <p className="text-sm text-muted-foreground">{suggestion.name}</p>
                )}
              </div>
            </div>
          ))}
        </Command>
      </PopoverContent>
    </Popover>
  );
}