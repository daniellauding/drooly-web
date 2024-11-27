import * as React from "react";
import { Input } from "@/components/ui/input";
import { SingleSelect } from "@/components/SingleSelect";

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
  return (
    <div className="flex gap-2">
      <div className="w-[100px]">
        <SingleSelect
          options={countryCodes}
          selected={countryCode}
          onChange={onCountryCodeChange}
          placeholder="Code"
          searchable={false}
        />
      </div>
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