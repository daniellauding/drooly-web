import { Recipe } from "@/types/recipe";
import { Timestamp } from "firebase/firestore";
import { searchPhotos } from "@/services/unsplashService";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const SYSTEM_PROMPT = `You are a professional chef. Given ingredients, suggest detailed recipes that can be made using them. For each recipe, provide ALL of the following fields in this EXACT format:

TITLE: (recipe name)
DESCRIPTION: (2-3 sentences about the dish)
INGREDIENTS: (list with amounts and units)
STEPS: (detailed numbered steps)
DIFFICULTY: (easy/medium/hard)
CUISINE: (specific cuisine type)
TOTAL_TIME: (total prep and cook time)
DIETARY_INFO: (list all that apply: vegetarian, vegan, gluten-free, dairy-free, contains-nuts)
CATEGORIES: (comma-separated list from: Family Friendly, Fast & Easy, Budget Friendly, Meal Prep, Healthy, Comfort Food, Party Food, Gourmet, One Pot Meal)
ESTIMATED_COST: ($5-$10, $10-$20, etc)
SEASON: (Spring, Summer, Fall, Winter, or Year Round)
OCCASION: (suitable occasions)
EQUIPMENT: (required cooking equipment)
COOKING_METHODS: (comma-separated list)
DISH_TYPES: (comma-separated list)
SERVINGS: (number and unit)`;

export async function generateDetailedRecipes(ingredients: string[]): Promise<Recipe[]> {
  if (!OPENAI_API_KEY) {
    throw new Error("OpenAI API key not configured");
  }

  console.log("Generating detailed recipes for ingredients:", ingredients);

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `Generate 3 detailed recipes using these ingredients: ${ingredients.join(", ")}` }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content;
    console.log("Raw OpenAI response:", aiResponse);

    // Split into individual recipes
    const recipeBlocks = aiResponse.split(/TITLE:/).slice(1);
    
    // Process each recipe block
    const recipes = await Promise.all(recipeBlocks.map(async (block) => {
      // Extract all fields using regex
      const sections = {
        title: block.match(/^([^\n]+)/)?.[1]?.trim(),
        description: block.match(/DESCRIPTION:\s*([\s\S]*?)(?=\n[A-Z]+:|\n\n|$)/)?.[1]?.trim(),
        ingredients: block.match(/INGREDIENTS:\s*([\s\S]*?)(?=\n[A-Z]+:|\n\n|$)/)?.[1]?.trim(),
        steps: block.match(/STEPS:\s*([\s\S]*?)(?=\n[A-Z]+:|\n\n|$)/)?.[1]?.trim(),
        difficulty: block.match(/DIFFICULTY:\s*([^\n]+)/)?.[1]?.trim()?.toLowerCase(),
        cuisine: block.match(/CUISINE:\s*([^\n]+)/)?.[1]?.trim(),
        totalTime: block.match(/TOTAL_TIME:\s*([^\n]+)/)?.[1]?.trim(),
        dietaryInfo: block.match(/DIETARY_INFO:\s*([^\n]+)/)?.[1]?.trim(),
        categories: block.match(/CATEGORIES:\s*([^\n]+)/)?.[1]?.trim(),
        estimatedCost: block.match(/ESTIMATED_COST:\s*([^\n]+)/)?.[1]?.trim(),
        season: block.match(/SEASON:\s*([^\n]+)/)?.[1]?.trim(),
        occasion: block.match(/OCCASION:\s*([^\n]+)/)?.[1]?.trim(),
        equipment: block.match(/EQUIPMENT:\s*([^\n]+)/)?.[1]?.trim(),
        cookingMethods: block.match(/COOKING_METHODS:\s*([^\n]+)/)?.[1]?.trim(),
        dishTypes: block.match(/DISH_TYPES:\s*([^\n]+)/)?.[1]?.trim(),
        servings: block.match(/SERVINGS:\s*([^\n]+)/)?.[1]?.trim(),
      };

      // Get a relevant image from Unsplash
      const photos = await searchPhotos(`${sections.title} food`);
      const imageUrl = photos[0]?.urls.regular || '/placeholder.svg';

      // Parse ingredients into structured format
      const parsedIngredients = sections.ingredients?.split('\n').map(line => {
        const match = line.match(/^([\d.]+)\s+(\w+)\s+(.+)$/);
        return match ? {
          amount: match[1],
          unit: match[2],
          name: match[3].trim()
        } : null;
      }).filter(Boolean) || [];

      // Parse steps into structured format
      const parsedSteps = sections.steps?.split(/\d+\.\s+/)
        .filter(Boolean)
        .map((step, index) => ({
          title: `Step ${index + 1}`,
          instructions: step.trim(),
          duration: "",
          media: []
        })) || [];

      // Parse dietary info
      const dietaryInfo = {
        isVegetarian: sections.dietaryInfo?.toLowerCase().includes('vegetarian') || false,
        isVegan: sections.dietaryInfo?.toLowerCase().includes('vegan') || false,
        isGlutenFree: sections.dietaryInfo?.toLowerCase().includes('gluten-free') || false,
        isDairyFree: sections.dietaryInfo?.toLowerCase().includes('dairy-free') || false,
        containsNuts: sections.dietaryInfo?.toLowerCase().includes('nuts') || false
      };

      // Parse servings
      const servingsMatch = sections.servings?.match(/(\d+)\s+(\w+)/);
      const servings = {
        amount: parseInt(servingsMatch?.[1] || "4"),
        unit: servingsMatch?.[2] || "servings"
      };

      return {
        id: `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: sections.title || "Untitled Recipe",
        description: sections.description || "",
        ingredients: parsedIngredients,
        steps: parsedSteps,
        instructions: [],
        difficulty: sections.difficulty || "medium",
        cuisine: sections.cuisine || "International",
        totalTime: sections.totalTime || "30 minutes",
        images: [imageUrl],
        featuredImageIndex: 0,
        status: 'generated' as const,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        cookingMethods: sections.cookingMethods?.split(',').map(m => m.trim()) || [],
        dishTypes: sections.dishTypes?.split(',').map(t => t.trim()) || [],
        servings,
        tags: [],
        categories: sections.categories?.split(',').map(c => c.trim()) || [],
        equipment: sections.equipment?.split(',').map(e => e.trim()) || [],
        worksWith: [],
        serveWith: [],
        stats: { views: 0, likes: [], saves: [], comments: 0 },
        dietaryInfo,
        estimatedCost: sections.estimatedCost,
        season: sections.season,
        occasion: sections.occasion,
        privacy: 'public' as const
      } as Recipe;
    }));

    console.log("Generated recipes:", recipes);
    return recipes;
  } catch (error) {
    console.error("Error generating recipes:", error);
    throw error;
  }
}