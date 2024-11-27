import { doc, setDoc, updateDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Recipe } from "@/types/recipe";
import { processRecipeImages } from "@/utils/imageUpload";

export const saveRecipe = async (
  recipe: Recipe,
  userId: string,
  userName: string,
  isEditing: boolean,
  recipeId?: string
): Promise<void> => {
  console.log("Saving recipe:", { isEditing, recipeId });
  
  const processedImages = await processRecipeImages(recipe.images, userId);
  console.log("Processed images:", processedImages.length);

  const recipeData = {
    ...recipe,
    images: processedImages,
    creatorId: userId,
    creatorName: userName || "Anonymous Chef",
    updatedAt: serverTimestamp(),
  };

  if (isEditing && recipeId) {
    const recipeRef = doc(db, "recipes", recipeId);
    await updateDoc(recipeRef, recipeData);
  } else {
    const recipesRef = collection(db, "recipes");
    const newRecipeRef = doc(recipesRef);
    await setDoc(newRecipeRef, {
      ...recipeData,
      createdAt: serverTimestamp(),
    });
  }
};