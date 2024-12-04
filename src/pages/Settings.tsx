import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileSettings } from "@/components/settings/ProfileSettings";
import { PrivacySettings } from "@/components/settings/PrivacySettings";
import { TopBar } from "@/components/TopBar";
import { useAccountDeletion } from "@/hooks/useAccountDeletion";
import { Button } from "@/components/ui/button";
import { DeleteConfirmationDialog } from "@/components/backoffice/DeleteConfirmationDialog";
import { useState } from "react";
import { LanguageSelector } from "@/components/settings/LanguageSelector";
import { useTranslation } from "react-i18next";
import { Separator } from "@/components/ui/separator";

export default function Settings() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { deleteAccount } = useAccountDeletion();
  const { t } = useTranslation();

  const handleDeleteAccount = async () => {
    await deleteAccount();
    setDeleteDialogOpen(false);
  };

  return (
    <div className="min-h-screen pb-20">
      <TopBar />
      <main className="container max-w-2xl mx-auto py-6 px-4 space-y-8">
        <h1 className="text-2xl font-bold">{t('common.settings')}</h1>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="preferences">General</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <ProfileSettings />
          </TabsContent>
          
          <TabsContent value="privacy">
            <PrivacySettings />
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">General Settings</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Language</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose your preferred language for the application
                  </p>
                  <LanguageSelector />
                </div>
                <Separator className="my-4" />
                {/* Add more general settings here */}
              </div>
            </div>
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