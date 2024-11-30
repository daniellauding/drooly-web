import { Recipe } from "@/types/recipe";
import { Timestamp } from "firebase/firestore";

export const parseAIDescription = (description: string): Partial<Recipe> => {
  console.log("Parsing AI description:", description);
  
  // Extract main components from the description
  const mainIngredients = description.match(/with\s([^,\.]+)/g)?.map(match => 
    match.replace('with ', '').trim()
  ) || [];

  // Convert to structured recipe format
  const ingredients = mainIngredients.map(item => ({
    name: item,
    amount: "1",
    unit: "portion",
    group: "main"
  }));

  // Create basic recipe structure
  return {
    title: description.split('!')[0].trim(),
    description: description,
    ingredients,
    steps: [
      {
        title: "Step 1",
        instructions: "Prepare ingredients as shown in the photo",
        duration: "",
        media: []
      }
    ],
    difficulty: "Medium",
    cuisine: "International",
    servings: {
      amount: 2,
      unit: "servings"
    },
    totalTime: "30 minutes",
    categories: ["Fast & Easy"],
    images: [],
    featuredImageIndex: 0,
    status: 'draft' as const,
    privacy: 'public' as const,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    cookingMethods: [],
    dishTypes: [],
    equipment: [],
    tags: [],
    stats: {
      views: 0,
      likes: [],
      saves: [],
      comments: 0
    }
  };
};