import { useQuery } from "@tanstack/react-query";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { achievements } from "@/services/achievementService";

export interface UserAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  maxProgress: number;
  completed: boolean;
  reward?: string;
}

export function useGamification() {
  const { user } = useAuth();

  const { data: userAchievements = [], isLoading } = useQuery({
    queryKey: ['achievements', user?.uid],
    queryFn: async (): Promise<UserAchievement[]> => {
      if (!user?.uid) return [];
      
      console.log('Fetching achievements for user:', user.uid);
      
      const achievementsRef = collection(db, "users", user.uid, "achievements");
      const snapshot = await getDocs(achievementsRef);
      
      // Get all achievements, including those not yet started
      const userAchievements = Object.entries(achievements).map(([id, achievement]) => {
        const userAchievement = snapshot.docs.find(doc => doc.id === id);
        
        return {
          ...achievement,
          progress: userAchievement?.data()?.progress || 0,
          completed: userAchievement?.data()?.completed || false,
        };
      });

      console.log('Fetched achievements:', userAchievements);
      return userAchievements;
    },
    enabled: !!user?.uid
  });

  const { data: stats } = useQuery({
    queryKey: ['gamification-stats', user?.uid],
    queryFn: async () => {
      if (!user?.uid) return null;
      
      console.log('Fetching gamification stats for user:', user.uid);
      
      const recipesRef = collection(db, "recipes");
      const userRecipesQuery = query(recipesRef, where("creatorId", "==", user.uid));
      const recipesSnapshot = await getDocs(userRecipesQuery);
      
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.data();
      
      return {
        totalRecipes: recipesSnapshot.size,
        followersCount: userData?.followers?.length || 0,
        followingCount: userData?.following?.length || 0,
        completedAchievements: userAchievements.filter(a => a.completed).length,
        totalAchievements: Object.keys(achievements).length,
        level: Math.floor((recipesSnapshot.size + (userData?.followers?.length || 0)) / 5) + 1
      };
    },
    enabled: !!user?.uid
  });

  return {
    achievements: userAchievements,
    stats,
    isLoading,
  };
}