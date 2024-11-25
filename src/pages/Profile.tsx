import { useAuth } from "@/contexts/AuthContext";
import { TopBar } from "@/components/TopBar";
import { BottomBar } from "@/components/BottomBar";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { RecipeCard } from "@/components/RecipeCard";
import { Recipe } from "@/types/recipe";
import { SendInviteModal } from "@/components/backoffice/SendInviteModal";
import { useToast } from "@/components/ui/use-toast";
import { EditProfileModal } from "@/components/profile/EditProfileModal";
import { Pencil } from "lucide-react";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { ProfileActions } from "@/components/profile/ProfileActions";

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

  const { data: recipes, isLoading: recipesLoading } = useQuery({
    queryKey: ['userRecipes', targetUserId],
    queryFn: async () => {
      if (!targetUserId) return [];
      console.log('Fetching recipes for user:', targetUserId);
      const recipesRef = collection(db, 'recipes');
      const q = query(recipesRef, where('creatorId', '==', targetUserId));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Recipe[];
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
          setIsAdmin(data.role === 'superadmin');
          setUserData(prev => ({
            ...prev,
            id: userDoc.id,
            ...data,
          }));
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
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load user data. Please try again.",
        });
      }
    };

    fetchUserData();
  }, [targetUserId, user, navigate, toast]);

  const handleProfileUpdate = async () => {
    if (!targetUserId) return;
    const userDoc = await getDoc(doc(db, "users", targetUserId));
    if (userDoc.exists()) {
      setUserData(prev => ({
        ...prev,
        ...userDoc.data(),
      }));
    }
  };

  const isOwnProfile = user?.uid === targetUserId;

  if (!targetUserId) return null;

  return (
    <div className="min-h-screen pb-20">
      <TopBar />
      <main className="container py-6 px-4 max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <div className="relative inline-block">
            <div className="w-24 h-24 mx-auto bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
              {userData.avatarUrl ? (
                <img
                  src={userData.avatarUrl}
                  alt={userData.name || "Profile"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl">
                  {(userData.name || userData.email)?.[0]?.toUpperCase()}
                </span>
              )}
            </div>
            {isOwnProfile && (
              <Button
                variant="outline"
                size="icon"
                className="absolute -bottom-2 -right-2 rounded-full"
                onClick={() => setEditProfileOpen(true)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">{userData.name}</h1>
            {userData.username && (
              <p className="text-muted-foreground">@{userData.username}</p>
            )}
            {userData.bio && (
              <p className="text-sm max-w-md mx-auto">{userData.bio}</p>
            )}
          </div>

          {!isOwnProfile && (
            <ProfileActions 
              userId={targetUserId} 
              isFollowing={userData.followers.includes(user?.uid || '')}
            />
          )}

          <ProfileStats
            userId={targetUserId}
            recipesCount={recipes?.length || 0}
            followersCount={userData.followers?.length || 0}
            followingCount={userData.following?.length || 0}
          />
          
          {isOwnProfile && remainingInvites > 0 && (
            <Button 
              variant="outline"
              onClick={() => setInviteModalOpen(true)}
              className="w-full sm:w-auto"
            >
              Invite Friends ({remainingInvites} remaining)
            </Button>
          )}
        </div>

        {isOwnProfile && isAdmin && (
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate('/backoffice')}
          >
            Access Backoffice
          </Button>
        )}

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            {isOwnProfile ? "My Recipes" : "Recipes"}
          </h2>
          {recipesLoading ? (
            <div>Loading recipes...</div>
          ) : recipes && recipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  id={recipe.id}
                  title={recipe.title}
                  image={recipe.images?.[recipe.featuredImageIndex || 0]}
                  cookTime={recipe.totalTime}
                  difficulty={recipe.difficulty}
                  chef={recipe.creatorName}
                  date={new Date(recipe.createdAt.seconds * 1000).toLocaleDateString()}
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">
              No recipes yet
            </div>
          )}
        </div>
      </main>
      <BottomBar />

      {isOwnProfile && (
        <>
          <EditProfileModal
            open={editProfileOpen}
            onOpenChange={setEditProfileOpen}
            userData={userData}
            onUpdate={handleProfileUpdate}
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