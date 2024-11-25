import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProfileSecuritySettingsProps {
  currentPassword: string;
  newPassword: string;
  onCurrentPasswordChange: (value: string) => void;
  onNewPasswordChange: (value: string) => void;
  onPasswordUpdate: () => void;
}

export function ProfileSecuritySettings({
  currentPassword,
  newPassword,
  onCurrentPasswordChange,
  onNewPasswordChange,
  onPasswordUpdate
}: ProfileSecuritySettingsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Security Settings</h3>
      <div className="grid gap-2">
        <Label htmlFor="current-password">Current Password</Label>
        <Input
          id="current-password"
          type="password"
          value={currentPassword}
          onChange={e => onCurrentPasswordChange(e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="new-password">New Password</Label>
        <Input
          id="new-password"
          type="password"
          value={newPassword}
          onChange={e => onNewPasswordChange(e.target.value)}
        />
      </div>
      <Button onClick={onPasswordUpdate} disabled={!currentPassword || !newPassword}>
        Update Password
      </Button>
    </div>
  );
}