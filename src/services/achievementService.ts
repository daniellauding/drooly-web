import { doc, updateDoc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  completed: boolean;
  progress: number;
  maxProgress: number;
  reward?: string;
}

export const achievements = {
  firstRecipe: {
    id: 'firstRecipe',
    title: 'Chef in Training',
    description: 'Create your first recipe',
    icon: '👨‍🍳',
    maxProgress: 1,
  },
  firstFollow: {
    id: 'firstFollow',
    title: 'Making Friends',
    description: 'Follow your first chef',
    icon: '🤝',
    maxProgress: 1,
  },
  firstLike: {
    id: 'firstLike',
    title: 'Food Critic',
    description: 'Like your first recipe',
    icon: '❤️',
    maxProgress: 1,
  },
  recipeStreak: {
    id: 'recipeStreak',
    title: 'Consistent Chef',
    description: 'Create 3 recipes',
    icon: '🔥',
    maxProgress: 3,
  }
};

export const checkAchievement = async (userId: string, achievementId: keyof typeof achievements) => {
  const userAchievementsRef = doc(db, "users", userId, "achievements", achievementId);
  const achievementDoc = await getDoc(userAchievementsRef);
  
  if (!achievementDoc.exists()) {
    await setDoc(userAchievementsRef, {
      ...achievements[achievementId],
      progress: 0,
      completed: false,
    });
    return false;
  }
  
  return achievementDoc.data().completed;
};

export const updateAchievementProgress = async (
  userId: string, 
  achievementId: keyof typeof achievements,
  progress: number
) => {
  const userAchievementsRef = doc(db, "users", userId, "achievements", achievementId);
  const achievementDoc = await getDoc(userAchievementsRef);
  
  if (!achievementDoc.exists()) {
    await setDoc(userAchievementsRef, {
      ...achievements[achievementId],
      progress,
      completed: progress >= achievements[achievementId].maxProgress,
    });
    return true;
  }
  
  const currentProgress = achievementDoc.data().progress;
  const newProgress = Math.min(currentProgress + progress, achievements[achievementId].maxProgress);
  const completed = newProgress >= achievements[achievementId].maxProgress;
  
  if (!achievementDoc.data().completed && completed) {
    await updateDoc(userAchievementsRef, {
      progress: newProgress,
      completed,
    });
    return true;
  }
  
  await updateDoc(userAchievementsRef, {
    progress: newProgress,
  });
  
  return false;
};