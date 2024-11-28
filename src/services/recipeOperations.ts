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

  // Initialize empty arrays if they don't exist
  const recipeData = {
    ...recipe,
    id: recipeId || '', // Will be set to doc ID after creation
    images: processedImages,
    creatorId: userId,
    creatorName: userName || "Anonymous Chef",
    updatedAt: serverTimestamp(),
    status: recipe.status || 'published', // Default to published if not set
    categories: recipe.categories || [],
    cookingMethods: recipe.cookingMethods || [],
    dishTypes: recipe.dishTypes || [],
    equipment: recipe.equipment || [],
    serveWith: recipe.serveWith || [],
    worksWith: recipe.worksWith || [],
    tags: recipe.tags || [],
    stats: recipe.stats || {
      views: 0,
      likes: [],
      saves: [],
      comments: 0
    }
  };

  if (isEditing && recipeId) {
    console.log("Updating existing recipe:", recipeId);
    const recipeRef = doc(db, "recipes", recipeId);
    await updateDoc(recipeRef, recipeData);
  } else {
    console.log("Creating new recipe");
    const recipesRef = collection(db, "recipes");
    const newRecipeRef = doc(recipesRef);
    const newRecipeData = {
      ...recipeData,
      id: newRecipeRef.id, // Set the document ID as the recipe ID
      createdAt: serverTimestamp(),
    };
    await setDoc(newRecipeRef, newRecipeData);
  }
};