import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface RecurrenceSelectProps {
  value: "none" | "weekly" | "monthly";
  onChange: (value: "none" | "weekly" | "monthly") => void;
}

export function RecurrenceSelect({ value, onChange }: RecurrenceSelectProps) {
  return (
    <div className="space-y-2">
      <Label>How often do you want to buy this ingredient?</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">One time only</SelectItem>
          <SelectItem value="weekly">Weekly</SelectItem>
          <SelectItem value="monthly">Monthly</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}