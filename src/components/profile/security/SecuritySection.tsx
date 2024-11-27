import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SecuritySectionProps {
  currentPassword: string;
  newPassword: string;
  onPasswordChange: (field: 'current' | 'new', value: string) => void;
}

export function SecuritySection({ 
  currentPassword, 
  newPassword, 
  onPasswordChange 
}: SecuritySectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Security Settings</h3>
      <div className="grid gap-2">
        <Label htmlFor="current-password">Current Password</Label>
        <Input
          id="current-password"
          type="password"
          value={currentPassword}
          onChange={e => onPasswordChange('current', e.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="new-password">New Password</Label>
        <Input
          id="new-password"
          type="password"
          value={newPassword}
          onChange={e => onPasswordChange('new', e.target.value)}
        />
      </div>
    </div>
  );
}