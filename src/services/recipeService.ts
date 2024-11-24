import { collection, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Recipe {
  id: string;
  title: string;
  name: string;
  image: string;
  imageUrls?: string[];
  featuredImageIndex?: number;
  cookTime: string;
  totalTime: number;
  difficulty: string;
  chef: string;
  creatorName?: string;
  creatorId: string;
  date: string;
  createdAt: { seconds: number };
  description: string;
  ingredients: string[];
  instructions: string[];
  ingredientSections?: { ingredients: string[] }[];
  steps?: { instructions: string }[];
  servings?: {
    amount: number;
    unit: string;
  };
}

const PLACEHOLDER_IMAGES = [
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38',
  'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445',
  'https://images.unsplash.com/photo-1565299585323-38d6b0865b47',
  'https://images.unsplash.com/photo-1565958011703-44f9829ba187'
];

export const fetchRecipes = async (): Promise<Recipe[]> => {
  console.log('Fetching recipes from Firestore');
  try {
    const recipesRef = collection(db, 'recipes');
    const q = query(recipesRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map((doc, index) => {
      const data = doc.data();
      // Ensure we have an image URL, fallback to placeholder if none exists
      const image = data.imageUrls?.[data.featuredImageIndex || 0] || 
                   data.image || 
                   PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length];
      
      return {
        id: doc.id,
        ...data,
        image, // Ensure image is always present
        title: data.name || data.title, // Handle both name and title fields
        chef: data.creatorName || 'Anonymous',
        date: new Date(data.createdAt?.seconds * 1000).toLocaleDateString(),
        cookTime: `${data.totalTime || 30} min`,
      } as Recipe;
    });
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw error;
  }
};

export const fetchRecipeById = async (id: string): Promise<Recipe | null> => {
  console.log('Fetching recipe by ID:', id);
  try {
    const recipeRef = doc(db, 'recipes', id);
    const recipeDoc = await getDoc(recipeRef);
    
    if (!recipeDoc.exists()) {
      return null;
    }

    const data = recipeDoc.data();
    const image = data.imageUrls?.[data.featuredImageIndex || 0] || 
                 data.image || 
                 PLACEHOLDER_IMAGES[0];

    return {
      id: recipeDoc.id,
      ...data,
      image,
      title: data.name || data.title,
      chef: data.creatorName || 'Anonymous',
      date: new Date(data.createdAt?.seconds * 1000).toLocaleDateString(),
      cookTime: `${data.totalTime || 30} min`,
    } as Recipe;
  } catch (error) {
    console.error('Error fetching recipe:', error);
    throw error;
  }
};