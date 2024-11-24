import { collection, getDocs, query, orderBy, doc, getDoc, where, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Recipe as RecipeType } from '@/types/recipe';

export interface Recipe extends RecipeType {
  name?: string;
  image?: string;
  imageUrls?: string[];
  cookTime?: string;
  chef?: string;
  creatorName?: string;
  date?: string;
}

const SAMPLE_RECIPES: Recipe[] = [
  {
    id: '1',
    title: 'Homemade Pizza',
    description: 'Classic Italian pizza with fresh toppings',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38',
    chef: 'Mario Chef',
    date: '2024-02-20',
    cookTime: '45 min',
    difficulty: 'medium',
    cookingMethods: ['baking'],
    cuisine: 'Italian',
    dishTypes: ['main'],
    images: ['https://images.unsplash.com/photo-1565299624946-b28f40a0ae38'],
    ingredients: [],
    steps: [],
    totalTime: '45',
    servings: { amount: 4, unit: 'servings' },
    dietaryInfo: {
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: false,
      isDairyFree: false,
      containsNuts: false
    },
    categories: ['comfort food'],
    equipment: ['oven'],
    featuredImageIndex: 0,
    tags: [],
    worksWith: [],
    serveWith: [],
    estimatedCost: 'Under $5',
    season: 'Year Round',
    occasion: ''
  },
  {
    id: '2',
    title: 'Fresh Sushi Roll',
    description: 'Traditional Japanese sushi rolls',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c',
    chef: 'Yuki Chef',
    date: '2024-02-21',
    cookTime: '30 min',
    difficulty: 'hard',
    cookingMethods: ['rolling'],
    cuisine: 'Japanese',
    dishTypes: ['main'],
    images: ['https://images.unsplash.com/photo-1579871494447-9811cf80d66c'],
    ingredients: [],
    steps: [],
    totalTime: '30',
    servings: { amount: 2, unit: 'servings' },
    dietaryInfo: {
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: true,
      isDairyFree: true,
      containsNuts: false
    },
    categories: ['seafood'],
    equipment: ['rice cooker'],
    featuredImageIndex: 0,
    tags: [],
    worksWith: [],
    serveWith: [],
    estimatedCost: 'Under $5',
    season: 'Year Round',
    occasion: ''
  },
  {
    id: '3',
    title: 'Healthy Buddha Bowl',
    description: 'Nutritious and colorful vegetarian bowl',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
    chef: 'Sarah Wellness',
    date: '2024-02-22',
    cookTime: '20 min',
    difficulty: 'easy',
    cookingMethods: ['assembly'],
    cuisine: 'International',
    dishTypes: ['main'],
    images: ['https://images.unsplash.com/photo-1546069901-ba9599a7e63c'],
    ingredients: [],
    steps: [],
    totalTime: '20',
    servings: { amount: 1, unit: 'serving' },
    dietaryInfo: {
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: true,
      isDairyFree: true,
      containsNuts: true
    },
    categories: ['healthy'],
    equipment: ['bowl'],
    featuredImageIndex: 0,
    tags: [],
    worksWith: [],
    serveWith: [],
    estimatedCost: 'Under $5',
    season: 'Year Round',
    occasion: ''
  }
];

export const fetchRecipes = async (): Promise<Recipe[]> => {
  console.log('Fetching recipes...');
  try {
    // First try to fetch from Firebase
    const recipesRef = collection(db, 'recipes');
    const q = query(
      recipesRef, 
      where('status', '==', 'published'),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      console.log('Found recipes in Firebase');
      return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          image: data.images?.[data.featuredImageIndex || 0],
          chef: data.creatorName || 'Anonymous',
          date: new Date(data.createdAt?.seconds * 1000).toLocaleDateString(),
          cookTime: `${data.totalTime || 30} min`,
        } as Recipe;
      });
    }
    
    // If no Firebase data, return sample data
    console.log('No Firebase data found, returning sample recipes');
    return SAMPLE_RECIPES;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    // Return sample data as fallback
    return SAMPLE_RECIPES;
  }
};

export const fetchMyRecipes = async (userId: string): Promise<Recipe[]> => {
  console.log('Fetching user recipes from Firestore');
  try {
    const recipesRef = collection(db, 'recipes');
    const q = query(
      recipesRef,
      where('creatorId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    } as Recipe));
  } catch (error) {
    console.error('Error fetching user recipes:', error);
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
    const image = data.images?.[data.featuredImageIndex || 0] || 
                 'https://via.placeholder.com/150';

    return {
      ...data,
      id: recipeDoc.id,
      image,
      name: data.title,
      chef: data.creatorName || 'Anonymous',
      date: new Date(data.createdAt?.seconds * 1000).toLocaleDateString(),
      cookTime: `${data.totalTime || 30} min`,
    } as Recipe;
  } catch (error) {
    console.error('Error fetching recipe:', error);
    throw error;
  }
};

export const saveRecipe = async (recipe: Partial<Recipe>, userId: string, isDraft: boolean = false) => {
  console.log('Saving recipe to Firestore:', recipe);
  try {
    const recipeData = {
      ...recipe,
      creatorId: userId,
      createdAt: new Date(),
      status: isDraft ? 'draft' : 'published',
      // Ensure all required fields are present
      title: recipe.title || '',
      description: recipe.description || '',
      difficulty: recipe.difficulty || 'medium',
      cookingMethods: recipe.cookingMethods || [],
      cuisine: recipe.cuisine || '',
      dishTypes: recipe.dishTypes || [],
      images: recipe.images || [],
      ingredients: recipe.ingredients || [],
      steps: recipe.steps || [],
      totalTime: recipe.totalTime || '0',
      servings: recipe.servings || { amount: 1, unit: 'serving' },
      tags: recipe.tags || [],
      worksWith: recipe.worksWith || [],
      serveWith: recipe.serveWith || []
    };

    const docRef = await addDoc(collection(db, 'recipes'), recipeData);
    console.log('Recipe saved with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error saving recipe:', error);
    throw error;
  }
};
