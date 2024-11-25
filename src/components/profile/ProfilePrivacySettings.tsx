import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface ProfilePrivacySettingsProps {
  isPrivate: boolean;
  onPrivacyChange: (checked: boolean) => void;
  currentPassword: string;
  newPassword: string;
  onCurrentPasswordChange: (value: string) => void;
  onNewPasswordChange: (value: string) => void;
  onPasswordUpdate: () => void;
  onDeleteAccount: () => void;
}

export function ProfilePrivacySettings({ 
  isPrivate, 
  onPrivacyChange,
  currentPassword,
  newPassword,
  onCurrentPasswordChange,
  onNewPasswordChange,
  onPasswordUpdate,
  onDeleteAccount
}: ProfilePrivacySettingsProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Privacy Settings</h3>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label>Private Account</Label>
            <p className="text-sm text-muted-foreground">
              Only approved followers can see your content when enabled
            </p>
          </div>
          <Switch
            checked={isPrivate}
            onCheckedChange={onPrivacyChange}
          />
        </div>
      </div>

      <div className="space-y-4 border-t pt-4">
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

      <div className="border-t pt-4">
        <Button variant="destructive" onClick={onDeleteAccount}>
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Account
        </Button>
      </div>
    </div>
  );
}