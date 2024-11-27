import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface ProfilePrivacySettingsProps {
  isPrivate: boolean;
  onPrivacyChange: (checked: boolean) => void;
}

export function ProfilePrivacySettings({ 
  isPrivate, 
  onPrivacyChange
}: ProfilePrivacySettingsProps) {
  return (
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
  );
}