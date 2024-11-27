import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PhoneInputProps {
  countryCode: string;
  phone: string;
  onCountryCodeChange: (code: string) => void;
  onPhoneChange: (phone: string) => void;
  countryCodes: string[];
}

export function PhoneInput({
  countryCode,
  phone,
  onCountryCodeChange,
  onPhoneChange,
  countryCodes
}: PhoneInputProps) {
  return (
    <div className="flex gap-2">
      <Select value={countryCode} onValueChange={onCountryCodeChange}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Code" />
        </SelectTrigger>
        <SelectContent>
          {countryCodes.map((code) => (
            <SelectItem key={code} value={code}>
              {code}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        type="tel"
        value={phone}
        onChange={(e) => onPhoneChange(e.target.value)}
        placeholder="Phone number"
        className="flex-1"
      />
    </div>
  );
}