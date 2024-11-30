import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileSettings } from "@/components/settings/ProfileSettings";
import { PrivacySettings } from "@/components/settings/PrivacySettings";
import { TopBar } from "@/components/TopBar";
import { useAccountDeletion } from "@/hooks/useAccountDeletion";
import { Button } from "@/components/ui/button";
import { DeleteConfirmationDialog } from "@/components/backoffice/DeleteConfirmationDialog";
import { useState } from "react";

export default function Settings() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { deleteAccount } = useAccountDeletion();

  const handleDeleteAccount = async () => {
    await deleteAccount();
    setDeleteDialogOpen(false);
  };

  return (
    <div className="min-h-screen pb-20">
      <TopBar />
      <main className="container max-w-2xl mx-auto py-6 px-4 space-y-8">
        <h1 className="text-2xl font-bold">Settings</h1>
        
        <Tabs defaultValue="profile" className="w-full [&_:focus]:outline-none [&_:focus-visible]:outline-none [&_:focus]:ring-0">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="outline-none ring-0 focus:ring-0 focus-visible:ring-0 focus:outline-none focus-visible:outline-none">
            <ProfileSettings />
          </TabsContent>
          
          <TabsContent value="privacy" className="outline-none ring-0 focus:ring-0 focus-visible:ring-0 focus:outline-none focus-visible:outline-none">
            <PrivacySettings />
          </TabsContent>
        </Tabs>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Privacy & Security</h2>
          <div className="border rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Delete Account</h3>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all associated data
                </p>
              </div>
              <Button 
                variant="destructive"
                onClick={() => setDeleteDialogOpen(true)}
              >
                Delete Account
              </Button>
            </div>
          </div>
        </div>

        <DeleteConfirmationDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleDeleteAccount}
          title="Delete Account"
          description="Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted."
          confirmText="Delete Account"
          cancelText="Cancel"
        />
      </main>
    </div>
  );
}