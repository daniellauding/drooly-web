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

interface SingleSelectProps {
  options: string[];
  selected: string;
  onChange: (selected: string) => void;
  placeholder?: string;
  searchable?: boolean;
}

export function SingleSelect({ 
  options = [], 
  selected = "", 
  onChange, 
  placeholder = "Select item...",
  searchable = false
}: SingleSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  // Ensure we always have an array of strings
  const safeOptions = React.useMemo(() => {
    if (!Array.isArray(options)) return [];
    return options.filter((option): option is string => 
      typeof option === 'string' && option.length > 0
    );
  }, [options]);

  const filteredOptions = React.useMemo(() => {
    if (!searchQuery.trim()) return safeOptions;
    return safeOptions.filter((option) =>
      option.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [safeOptions, searchQuery]);

  // Reset search query when popover closes
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
          {selected || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command shouldFilter={false}>
          {searchable && (
            <CommandInput 
              placeholder={`Search ${placeholder.toLowerCase()}...`}
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
          )}
          {filteredOptions.length === 0 ? (
            <CommandEmpty>No items found.</CommandEmpty>
          ) : (
            <CommandGroup>
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option}
                  value={option}
                  onSelect={() => {
                    onChange(option);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selected === option ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}