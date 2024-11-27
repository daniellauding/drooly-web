import { collection, doc, getDoc, getDocs, query, orderBy, where, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Recipe {
  id: string;
  title: string;
  description: string;
  chef?: string;
  date?: string;
  cookTime?: string;
  difficulty?: string;
  cookingMethods?: string[];
  cuisine?: string;
  dishTypes?: string[];
  images: string[];
  featuredImageIndex?: number;
  ingredients: string[];
  instructions: string[];
  servings?: {
    amount: number;
    unit: string;
  };
  steps?: {
    title: string;
    instructions: string;
    duration: string;
    media?: string[];
    ingredients?: string[];
  }[];
  tags?: string[];
  totalTime?: string;
  worksWith?: string[];
  serveWith?: string[];
  categories?: string[];
  estimatedCost?: string;
  equipment?: string[];
  season?: string;
  occasion?: string;
  creatorId?: string;
  creatorName?: string;
  status?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  stats?: {
    views?: number;
    likes?: string[];
    saves?: string[];
    comments?: number;
  };
  ingredientSections?: {
    title: string;
    ingredients: string[];
  }[];
}

export const fetchRecipeById = async (id: string): Promise<Recipe> => {
  console.log('Fetching recipe by ID:', id);
  const recipeRef = doc(db, 'recipes', id);
  const recipeDoc = await getDoc(recipeRef);
  
  if (!recipeDoc.exists()) {
    throw new Error('Recipe not found');
  }

  const data = recipeDoc.data();
  return {
    id: recipeDoc.id,
    ...data,
    createdAt: data.createdAt || Timestamp.now(),
    updatedAt: data.updatedAt || Timestamp.now()
  } as Recipe;
};

export const fetchRecipes = async (): Promise<Recipe[]> => {
  console.log('Fetching all recipes');
  const recipesRef = collection(db, 'recipes');
  const q = query(
    recipesRef,
    where('status', '==', 'published'),
    orderBy('createdAt', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Recipe));
};