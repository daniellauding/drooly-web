import { Recipe } from "@/types/recipe";

export const parseAIResponse = (aiResponse: string): Partial<Recipe> => {
  console.log("Parsing AI response:", aiResponse);

  // Extract sections using regex
  const sections = {
    description: aiResponse.match(/Description:(.*?)(?=\n\n|\n[A-Z]|$)/s)?.[1]?.trim(),
    ingredients: aiResponse.match(/Ingredients?:(.*?)(?=\n\n|\n[A-Z]|$)/s)?.[1]?.trim(),
    steps: aiResponse.match(/Instructions?:(.*?)(?=\n\n|\n[A-Z]|$)/s)?.[1]?.trim(),
    difficulty: aiResponse.match(/Difficulty:(.*?)(?=\n|\n\n|$)/)?.[1]?.trim(),
    cuisine: aiResponse.match(/Cuisine:(.*?)(?=\n|\n\n|$)/)?.[1]?.trim(),
    dietary: aiResponse.match(/Dietary Information:(.*?)(?=\n\n|\n[A-Z]|$)/s)?.[1]?.trim(),
    categories: aiResponse.match(/Categories:(.*?)(?=\n|\n\n|$)/)?.[1]?.trim(),
    cost: aiResponse.match(/Estimated Cost:(.*?)(?=\n|\n\n|$)/)?.[1]?.trim(),
    season: aiResponse.match(/Season:(.*?)(?=\n|\n\n|$)/)?.[1]?.trim(),
    occasion: aiResponse.match(/Occasion:(.*?)(?=\n|\n\n|$)/)?.[1]?.trim(),
    equipment: aiResponse.match(/Equipment:(.*?)(?=\n|\n\n|$)/)?.[1]?.trim(),
    cookingMethods: aiResponse.match(/Cooking Methods:(.*?)(?=\n|\n\n|$)/)?.[1]?.trim(),
    dishTypes: aiResponse.match(/Dish Types?:(.*?)(?=\n|\n\n|$)/)?.[1]?.trim(),
    servings: aiResponse.match(/Servings?:(.*?)(?=\n|\n\n|$)/)?.[1]?.trim(),
    totalTime: aiResponse.match(/Total Time:(.*?)(?=\n|\n\n|$)/)?.[1]?.trim(),
  };

  // Parse ingredients into structured format
  const ingredients = sections.ingredients?.split('\n')
    .map(line => {
      const match = line.match(/^[-•]?\s*(\d*\.?\d*)\s*(\w+)\s+(.+)$/);
      if (match) {
        return {
          amount: match[1],
          unit: match[2],
          name: match[3].trim(),
          group: "Main Ingredients"
        };
      }
      return null;
    })
    .filter(Boolean) || [];

  // Parse steps into structured format
  const steps = sections.steps?.split(/\d+\.\s+/)
    .filter(Boolean)
    .map((step, index) => ({
      title: `Step ${index + 1}`,
      instructions: step.trim(),
      duration: "",
      media: []
    })) || [];

  // Parse dietary information
  const dietaryInfo = {
    isVegetarian: sections.dietary?.toLowerCase().includes('vegetarian') || false,
    isVegan: sections.dietary?.toLowerCase().includes('vegan') || false,
    isGlutenFree: sections.dietary?.toLowerCase().includes('gluten-free') || false,
    isDairyFree: sections.dietary?.toLowerCase().includes('dairy-free') || false,
    containsNuts: sections.dietary?.toLowerCase().includes('nuts') || false
  };

  return {
    description: sections.description,
    ingredients,
    steps,
    difficulty: sections.difficulty?.toLowerCase(),
    cuisine: sections.cuisine?.toLowerCase(),
    dietaryInfo,
    categories: sections.categories?.split(',').map(c => c.trim()),
    estimatedCost: sections.cost,
    season: sections.season,
    occasion: sections.occasion,
    equipment: sections.equipment?.split(',').map(e => e.trim()),
    cookingMethods: sections.cookingMethods?.split(',').map(m => m.trim()),
    dishTypes: sections.dishTypes?.split(',').map(t => t.trim()),
    servings: {
      amount: parseInt(sections.servings?.match(/\d+/)?.[0] || "4"),
      unit: sections.servings?.replace(/\d+\s*/, '').trim() || "serving"
    },
    totalTime: sections.totalTime
  };
};