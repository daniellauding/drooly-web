import { useState, useEffect } from "react";
import { Command } from "@/components/ui/command";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface UserSearchAutocompleteProps {
  onSelect: (email: string, existingUser?: boolean) => void;
  value: string;
  onChange: (value: string) => void;
}

export function UserSearchAutocomplete({ onSelect, value, onChange }: UserSearchAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<{ email: string; name?: string }[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!value || value.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        console.log('Fetching user suggestions for:', value);
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
        
        console.log('Found users:', users.length);
        setSuggestions(users);
      } catch (error) {
        console.error("Error fetching user suggestions:", error);
      }
    };

    fetchSuggestions();
  }, [value]);

  const handleSelect = (email: string, existingUser: boolean = true) => {
    onSelect(email, existingUser);
    onChange("");
    setOpen(false);

    if (!existingUser) {
      toast({
        title: "Invitation Sent",
        description: `An invitation will be sent to ${email}`,
      });
    }
  };

  return (
    <Popover open={open && (suggestions.length > 0 || value.length > 0)} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter guest email"
          className="w-full"
          onKeyDown={(e) => {
            if (e.key === "Enter" && value) {
              e.preventDefault();
              handleSelect(value, false);
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
              onClick={() => handleSelect(suggestion.email, true)}
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
          {value && !suggestions.find(s => s.email === value) && (
            <div
              className="flex items-center gap-2 px-4 py-2 hover:bg-accent cursor-pointer border-t"
              onClick={() => handleSelect(value, false)}
            >
              <div>
                <p>Invite {value}</p>
                <p className="text-sm text-muted-foreground">Send invitation email</p>
              </div>
            </div>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}