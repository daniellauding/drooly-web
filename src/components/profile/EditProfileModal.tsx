import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileBasicInfo } from "./ProfileBasicInfo";
import { ProfileSecuritySettings } from "./ProfileSecuritySettings";

interface EditProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userData: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
  };
  onUpdate: () => void;
  isAdmin?: boolean;
}

export function EditProfileModal({
  open,
  onOpenChange,
  userData,
  onUpdate,
  isAdmin = false,
}: EditProfileModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="privacy">Privacy & Security</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-4">
            <ProfileBasicInfo 
              userData={userData}
              onUpdate={onUpdate}
              onClose={() => onOpenChange(false)}
            />
          </TabsContent>

          <TabsContent value="privacy" className="mt-4">
            <ProfileSecuritySettings 
              userId={userData.id}
              onClose={() => onOpenChange(false)}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}