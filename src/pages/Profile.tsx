import { useAuth } from "@/contexts/AuthContext";
import { TopBar } from "@/components/TopBar";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Recipe } from "@/types/recipe";
import { SendInviteModal } from "@/components/backoffice/SendInviteModal";
import { useToast } from "@/hooks/use-toast";
import { EditProfileModal } from "@/components/profile/EditProfileModal";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileRecipeGrid } from "@/components/profile/ProfileRecipeGrid";
import { GamificationStatus } from "@/components/profile/GamificationStatus";

export default function Profile() {
  const { user } = useAuth();
  const { userId: profileUserId } = useParams();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const { toast } = useToast();
  const [remainingInvites, setRemainingInvites] = useState(5);
  const [userData, setUserData] = useState({
    id: "",
    name: "",
    username: "",
    birthday: "",
    email: "",
    phone: "",
    bio: "",
    gender: "prefer-not-to-say",
    isPrivate: false,
    avatarUrl: "",
    followers: [] as string[],
    following: [] as string[],
  });

  const targetUserId = profileUserId || user?.uid;

  // Query for user's recipes
  const { data: recipes, isLoading: recipesLoading } = useQuery({
    queryKey: ['recipes', targetUserId],
    queryFn: async () => {
      if (!targetUserId) return [];
      const recipesRef = collection(db, 'recipes');
      const q = query(recipesRef, where('creatorId', '==', targetUserId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Recipe[];
    },
    enabled: !!targetUserId
  });

  // Query for saved recipes
  const { data: savedRecipes, isLoading: savedRecipesLoading } = useQuery({
    queryKey: ['savedRecipes', targetUserId],
    queryFn: async () => {
      if (!targetUserId) return [];
      const recipesRef = collection(db, 'recipes');
      const q = query(recipesRef, where('stats.saves', 'array-contains', targetUserId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Recipe[];
    },
    enabled: !!targetUserId
  });

  // Query for liked recipes
  const { data: likedRecipes, isLoading: likedRecipesLoading } = useQuery({
    queryKey: ['likedRecipes', targetUserId],
    queryFn: async () => {
      if (!targetUserId) return [];
      const recipesRef = collection(db, 'recipes');
      const q = query(recipesRef, where('stats.likes', 'array-contains', targetUserId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Recipe[];
    },
    enabled: !!targetUserId
  });

  useEffect(() => {
    if (!targetUserId) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        console.log("Fetching user data for:", targetUserId);
        const userDoc = await getDoc(doc(db, "users", targetUserId));
        
        if (userDoc.exists()) {
          const data = userDoc.data();
          console.log("Successfully fetched user data:", data);
          setIsAdmin(data.role === 'superadmin');
          setUserData(prev => ({
            ...prev,
            id: userDoc.id,
            ...data,
            email: user?.email || '',
            followers: data.followers || [],
            following: data.following || []
          }));
        } else {
          console.log("No user document found");
          toast({
            variant: "destructive",
            title: "User not found",
            description: "The requested user profile could not be found.",
          });
        }
        
        if (targetUserId === user?.uid) {
          const invitesRef = collection(db, "invites");
          const q = query(invitesRef, where("createdBy", "==", targetUserId));
          const querySnapshot = await getDocs(q);
          const usedInvites = querySnapshot.size;
          setRemainingInvites(Math.max(0, 5 - usedInvites));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Only show error toast if data is not already loaded
        if (!userData.id) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load user data. Please try again.",
          });
        }
      }
    };

    fetchUserData();
  }, [targetUserId, user, navigate, toast]);

  const handleProfileUpdate = async () => {
    if (!targetUserId) return;
    const userDoc = await getDoc(doc(db, "users", targetUserId));
    if (userDoc.exists()) {
      const data = userDoc.data();
      setUserData(prev => ({
        ...prev,
        ...data,
        followers: data.followers || [],
        following: data.following || []
      }));
    }
  };

  const isOwnProfile = user?.uid === targetUserId;

  if (!targetUserId) return null;

  return (
    <div className="min-h-screen pb-20">
      <TopBar />
      <main className="container py-6 px-4 max-w-4xl mx-auto space-y-6">
        <ProfileHeader 
          userData={userData}
          isOwnProfile={isOwnProfile}
          remainingInvites={remainingInvites}
          onEditProfile={() => setEditProfileOpen(true)}
          onInvite={() => setInviteModalOpen(true)}
        />

        {isOwnProfile && <GamificationStatus />}

        <ProfileStats 
          userId={targetUserId}
          recipesCount={recipes?.length || 0}
          followersCount={userData.followers.length}
          followingCount={userData.following.length}
        />

        <Tabs defaultValue="recipes" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="recipes">My Recipes</TabsTrigger>
            <TabsTrigger value="saved">Saved Recipes</TabsTrigger>
            <TabsTrigger value="liked">Liked Recipes</TabsTrigger>
          </TabsList>

          <TabsContent value="recipes" className="mt-6">
            <ProfileRecipeGrid
              recipes={recipes || []}
              isLoading={recipesLoading}
              emptyMessage="No recipes yet"
            />
          </TabsContent>

          <TabsContent value="saved" className="mt-6">
            <ProfileRecipeGrid
              recipes={savedRecipes || []}
              isLoading={savedRecipesLoading}
              emptyMessage="No saved recipes yet"
            />
          </TabsContent>

          <TabsContent value="liked" className="mt-6">
            <ProfileRecipeGrid
              recipes={likedRecipes || []}
              isLoading={likedRecipesLoading}
              emptyMessage="No liked recipes yet"
            />
          </TabsContent>
        </Tabs>
      </main>
      
      {isOwnProfile && (
        <>
          <EditProfileModal
            open={editProfileOpen}
            onOpenChange={setEditProfileOpen}
            userData={userData}
            onUpdate={handleProfileUpdate}
            isAdmin={isAdmin}
          />

          <SendInviteModal
            open={inviteModalOpen}
            onOpenChange={setInviteModalOpen}
            recipe={null}
            remainingInvites={remainingInvites}
            onInviteSent={() => {
              setRemainingInvites(prev => Math.max(0, prev - 1));
              toast({
                title: "Invite sent successfully",
                description: `You have ${remainingInvites - 1} invites remaining.`
              });
            }}
          />
        </>
      )}
    </div>
  );
}