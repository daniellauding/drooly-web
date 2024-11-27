import { Recipe } from "@/types/recipe";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c";

export const formatRecipeData = (doc: any): Recipe => {
  const data = doc.data();
  console.log('Formatting recipe data:', data);

  // Handle blob URLs by replacing with fallback image
  const imageUrl = data.images?.[data.featuredImageIndex || 0];
  const validImage = imageUrl && !imageUrl.startsWith('blob:') ? imageUrl : FALLBACK_IMAGE;

  // Format cooking time with fallback
  const cookTime = data.totalTime 
    ? data.totalTime
    : `${data.servings?.amount || 4} servings`;

  // Format date
  const date = data.createdAt 
    ? new Date(data.createdAt.seconds * 1000).toLocaleDateString()
    : 'Recently added';

  return {
    id: doc.id,
    ...data,
    image: validImage,
    chef: data.creatorName || 'Anonymous Chef',
    date,
    cookTime,
    title: data.title || 'Untitled Recipe',
    description: data.description || 'A delicious recipe waiting to be discovered',
    difficulty: data.difficulty || 'Medium',
    cuisine: data.cuisine || 'International',
  };
};