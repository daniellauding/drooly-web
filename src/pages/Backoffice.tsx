import { useAuth } from "@/contexts/AuthContext";
import { TopBar } from "@/components/TopBar";
import { BottomBar } from "@/components/BottomBar";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BackofficeRecipes } from "@/components/backoffice/BackofficeRecipes";
import { BackofficeUsers } from "@/components/backoffice/BackofficeUsers";
import { BackofficeImages } from "@/components/backoffice/BackofficeImages";
import { BackofficeComments } from "@/components/backoffice/BackofficeComments";
import { BackofficePlans } from "@/components/backoffice/BackofficePlans";
import { BackofficeTranslations } from "@/components/backoffice/BackofficeTranslations";

export default function Backoffice() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.role || user.role !== 'superadmin') {
      console.log('Unauthorized access attempt to backoffice');
      navigate('/');
    }
  }, [user, navigate]);

  if (!user?.role || user.role !== 'superadmin') return null;

  return (
    <div className="min-h-screen pb-20">
      <TopBar />
      <main className="container py-6 px-4 max-w-7xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Backoffice</h1>
        
        <Tabs defaultValue="recipes" className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="recipes">Recipes</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="plans">Plans</TabsTrigger>
            <TabsTrigger value="translations">Translations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recipes">
            <BackofficeRecipes />
          </TabsContent>
          
          <TabsContent value="users">
            <BackofficeUsers />
          </TabsContent>
          
          <TabsContent value="images">
            <BackofficeImages />
          </TabsContent>
          
          <TabsContent value="comments">
            <BackofficeComments />
          </TabsContent>
          
          <TabsContent value="plans">
            <BackofficePlans />
          </TabsContent>
          
          <TabsContent value="translations">
            <BackofficeTranslations />
          </TabsContent>
        </Tabs>
      </main>
      <BottomBar />
    </div>
  );
}