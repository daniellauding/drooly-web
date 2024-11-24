import { useAuth } from "@/contexts/AuthContext";
import { TopBar } from "@/components/TopBar";
import { BottomBar } from "@/components/BottomBar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { RecipeCard } from "@/components/RecipeCard";
import { Recipe } from "@/types/recipe";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const { data: recipes, isLoading } = useQuery({
    queryKey: ['userRecipes', user?.uid],
    queryFn: async () => {
      if (!user?.uid) return [];
      console.log('Fetching recipes for user:', user.uid);
      const recipesRef = collection(db, 'recipes');
      const q = query(recipesRef, where('creatorId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Recipe[];
    },
    enabled: !!user?.uid
  });

  console.log('User recipes:', recipes);

  if (!user) return null;

  return (
    <div className="min-h-screen pb-20">
      <TopBar />
      <main className="container py-6 px-4 max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <div className="w-24 h-24 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
            {user.email?.[0].toUpperCase()}
          </div>
          <h1 className="text-2xl font-bold">{user.email}</h1>
        </div>

        <div className="space-y-4">
          <Button 
            variant="destructive" 
            className="w-full"
            onClick={() => logout()}
          >
            Logout
          </Button>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">My Recipes</h2>
          {isLoading ? (
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
              No recipes yet. Start creating!
            </div>
          )}
        </div>
      </main>
      <BottomBar />
    </div>
  );
}