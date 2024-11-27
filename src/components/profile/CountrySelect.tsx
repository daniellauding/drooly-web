import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface CountrySelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  countries: string[];
}

export function CountrySelect({ 
  value = "", 
  onValueChange, 
  countries = [] 
}: CountrySelectProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const safeCountries = React.useMemo(() => {
    return Array.isArray(countries) ? countries : [];
  }, [countries]);

  const filteredCountries = React.useMemo(() => {
    if (!searchQuery.trim()) return safeCountries;
    return safeCountries.filter((country) =>
      country.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [safeCountries, searchQuery]);

  React.useEffect(() => {
    if (!open) {
      setSearchQuery("");
    }
  }, [open]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value || "Select country..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput 
            placeholder="Search country..." 
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandEmpty>No country found.</CommandEmpty>
          <CommandGroup>
            {filteredCountries.map((country) => (
              <CommandItem
                key={country}
                value={country}
                onSelect={() => {
                  onValueChange(country);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === country ? "opacity-100" : "opacity-0"
                  )}
                />
                {country}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}