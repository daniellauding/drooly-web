import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileSettings } from "@/components/settings/ProfileSettings";
import { PrivacySettings } from "@/components/settings/PrivacySettings";
import { TopBar } from "@/components/TopBar";

export default function Settings() {
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
      </main>
    </div>
  );
}