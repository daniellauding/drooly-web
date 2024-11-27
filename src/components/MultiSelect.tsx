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
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

interface MultiSelectProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
}

export function MultiSelect({ 
  options = [], 
  selected = [], 
  onChange, 
  placeholder = "Select items..." 
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  // Ensure we always have arrays, even if undefined is passed
  const safeOptions = React.useMemo(() => Array.isArray(options) ? options : [], [options]);
  const safeSelected = React.useMemo(() => Array.isArray(selected) ? selected : [], [selected]);

  const filteredOptions = React.useMemo(() => {
    if (!searchQuery.trim()) return safeOptions;
    return safeOptions.filter((option) =>
      option.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [safeOptions, searchQuery]);

  const handleSelect = React.useCallback((option: string) => {
    const newSelected = safeSelected.includes(option)
      ? safeSelected.filter((item) => item !== option)
      : [...safeSelected, option];
    onChange(newSelected);
  }, [safeSelected, onChange]);

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
          <div className="flex gap-1 flex-wrap">
            {safeSelected.length > 0 ? (
              safeSelected.map((item) => (
                <Badge 
                  variant="secondary" 
                  key={item}
                  className="mr-1"
                >
                  {item}
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder={`Search ${placeholder.toLowerCase()}...`}
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            <CommandEmpty>No items found.</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto">
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option}
                  onSelect={() => handleSelect(option)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      safeSelected.includes(option) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}