import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CookingTimeInputProps {
  value: string;
  onChange: (time: string) => void;
}

export function CookingTimeInput({ value, onChange }: CookingTimeInputProps) {
  const [hours, setHours] = useState("0");
  const [minutes, setMinutes] = useState("0");

  // Parse initial value on mount
  useEffect(() => {
    if (value) {
      const timeMatch = value.match(/(\d+)\s*h(?:ours?)?\s*(?:and)?\s*(\d+)\s*m(?:inutes?)?/i);
      if (timeMatch) {
        setHours(timeMatch[1]);
        setMinutes(timeMatch[2]);
      } else {
        const minutesMatch = value.match(/(\d+)\s*m(?:inutes?)?/i);
        if (minutesMatch) {
          const totalMinutes = parseInt(minutesMatch[1]);
          setHours(Math.floor(totalMinutes / 60).toString());
          setMinutes((totalMinutes % 60).toString());
        }
      }
    }
  }, []);

  const handleTimeChange = (newHours: string, newMinutes: string) => {
    const h = parseInt(newHours) || 0;
    const m = parseInt(newMinutes) || 0;
    
    let timeString = "";
    if (h > 0 && m > 0) {
      timeString = `${h} hours and ${m} minutes`;
    } else if (h > 0) {
      timeString = `${h} ${h === 1 ? 'hour' : 'hours'}`;
    } else if (m > 0) {
      timeString = `${m} ${m === 1 ? 'minute' : 'minutes'}`;
    } else {
      timeString = "0 minutes";
    }
    
    onChange(timeString);
  };

  return (
    <div className="space-y-2">
      <Label>Total Cooking Time</Label>
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            type="number"
            min="0"
            max="72"
            value={hours}
            onChange={(e) => {
              const newHours = e.target.value;
              setHours(newHours);
              handleTimeChange(newHours, minutes);
            }}
            placeholder="Hours"
          />
          <span className="text-sm text-muted-foreground mt-1 block">Hours</span>
        </div>
        <div className="flex-1">
          <Input
            type="number"
            min="0"
            max="59"
            value={minutes}
            onChange={(e) => {
              const newMinutes = e.target.value;
              setMinutes(newMinutes);
              handleTimeChange(hours, newMinutes);
            }}
            placeholder="Minutes"
          />
          <span className="text-sm text-muted-foreground mt-1 block">Minutes</span>
        </div>
      </div>
    </div>
  );
}