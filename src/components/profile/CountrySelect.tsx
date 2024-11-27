import * as React from "react";
import { SingleSelect } from "@/components/SingleSelect";

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
  return (
    <SingleSelect
      options={countries}
      selected={value}
      onChange={onValueChange}
      placeholder="Select country..."
      searchable={true}
    />
  );
}