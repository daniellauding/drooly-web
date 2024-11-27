import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

interface PhoneInputProps {
  countryCode: string;
  phone: string;
  onCountryCodeChange: (code: string) => void;
  onPhoneChange: (phone: string) => void;
  countryCodes: string[];
}

export function PhoneInput({
  countryCode = "+1",
  phone = "",
  onCountryCodeChange,
  onPhoneChange,
  countryCodes = [],
}: PhoneInputProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const safeCountryCodes = React.useMemo(() => {
    return Array.isArray(countryCodes) ? countryCodes : [];
  }, [countryCodes]);

  const filteredCodes = React.useMemo(() => {
    if (!searchQuery.trim()) return safeCountryCodes;
    return safeCountryCodes.filter((code) =>
      code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [safeCountryCodes, searchQuery]);

  React.useEffect(() => {
    if (!open) {
      setSearchQuery("");
    }
  }, [open]);

  return (
    <div className="flex gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[100px]"
          >
            {countryCode}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command shouldFilter={false}>
            <CommandInput 
              placeholder="Search code..."
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandEmpty>No code found.</CommandEmpty>
            <CommandGroup className="max-h-[300px] overflow-auto">
              {filteredCodes.map((code) => (
                <CommandItem
                  key={code}
                  value={code}
                  onSelect={() => {
                    onCountryCodeChange(code);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      countryCode === code ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {code}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      <Input
        type="tel"
        value={phone}
        onChange={(e) => onPhoneChange(e.target.value)}
        className="flex-1"
        placeholder="Phone number"
      />
    </div>
  );
}