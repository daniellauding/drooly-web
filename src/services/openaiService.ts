import { Recipe } from "@/types/recipe";
import { createApi } from 'unsplash-js';
import { parseIngredients } from './recipe/ingredientParser';
import { parseSteps, mapIngredientsToSteps } from './recipe/stepParser';
import { CUISINES, RECIPE_CATEGORIES, SEASONS, COST_CATEGORIES } from "@/types/recipe";
import { Timestamp } from 'firebase/firestore';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const UNSPLASH_API_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

if (!OPENAI_API_KEY) {
  console.error("OpenAI API key not found. Please add VITE_OPENAI_API_KEY to your .env file");
}

if (!UNSPLASH_API_KEY) {
  console.error("Unsplash API key not found. Please add VITE_UNSPLASH_ACCESS_KEY to your .env file");
}

const unsplash = createApi({
  accessKey: UNSPLASH_API_KEY || ''
});

const SYSTEM_PROMPT = `You are a professional chef and culinary AI assistant. When analyzing recipes, provide detailed suggestions in this EXACT format:

TITLE: (recipe name)

DESCRIPTION: (detailed description)

INGREDIENTS: (list each ingredient in format: {amount} {unit} {name}, NO dashes or bullets)
400 gram shrimp
2 cup jasmine rice
etc.

STEPS: (list each step in format: {number}. [{duration}] {instruction}, NO bullets or asterisks)
1. [5 min] Prepare ingredients by peeling shrimp and chopping herbs
2. [3 min] Heat oil in wok over medium-high heat
etc.

DIFFICULTY: (easy/medium/hard)

CUISINE: (specific cuisine type)

DIETARY_INFO: (list all dietary considerations)

CATEGORIES: (comma-separated categories)

ESTIMATED_COST: (use format: $X-$Y or "Budget-friendly", "Moderate", "Expensive")

SEASON: (specify best season(s) to make this dish)

OCCASION: (list suitable occasions)

EQUIPMENT: (comma-separated list, NO bullets)

COOKING_METHODS: (comma-separated list)

DISH_TYPES: (comma-separated list)

SERVINGS_AMOUNT: (number only)

SERVINGS_UNIT: (unit only, e.g. servings, pieces)

TOTAL_TIME: (total preparation and cooking time)`;

export async function generateRecipesByIngredients(ingredients: string[]): Promise<Recipe[]> {
  if (!OPENAI_API_KEY) {
    throw new Error("OpenAI API key not configured");
  }

  console.log("Generating recipes for ingredients:", ingredients);

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
          {
            role: "user",
            content: `Generate recipes using these ingredients: ${ingredients.join(", ")}`
          }
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

    // Split the response into individual recipes
    const recipeBlocks = aiResponse.split(/TITLE:/).slice(1);
    
    return recipeBlocks.map(block => {
      const sections = {
        title: block.match(/^([^\n]+)/)?.[1]?.trim(),
        description: block.match(/DESCRIPTION:\s*([\s\S]*?)(?=\n[A-Z]+:|\n\n|$)/)?.[1]?.trim(),
        ingredients: parseIngredients(block.match(/INGREDIENTS:\s*([\s\S]*?)(?=\n[A-Z]+:|\n\n|$)/)?.[1]?.trim() || ""),
        steps: parseSteps(block.match(/STEPS:\s*([\s\S]*?)(?=\n[A-Z]+:|\n\n|$)/)?.[1]?.trim() || ""),
        difficulty: block.match(/DIFFICULTY:\s*([^\n]+)/)?.[1]?.trim()?.toLowerCase(),
        cuisine: block.match(/CUISINE:\s*([^\n]+)/)?.[1]?.trim(),
        totalTime: block.match(/TOTAL_TIME:\s*([^\n]+)/)?.[1]?.trim(),
      };

      return {
        id: `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: sections.title || "Untitled Recipe",
        description: sections.description || "",
        ingredients: sections.ingredients || [],
        steps: sections.steps || [],
        instructions: [],
        difficulty: sections.difficulty || "medium",
        cuisine: sections.cuisine || "International",
        totalTime: sections.totalTime || "30 minutes",
        images: [],
        featuredImageIndex: 0,
        status: 'generated' as const,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        cookingMethods: [],
        dishTypes: [],
        servings: { amount: 4, unit: 'servings' },
        tags: [],
        categories: [],
        equipment: [],
        worksWith: [],
        serveWith: [],
        stats: { views: 0, likes: [], saves: [], comments: 0 }
      } as Recipe;
    });
  } catch (error) {
    console.error("Error generating recipes:", error);
    throw error;
  }
}

export async function generateRecipeSuggestions(currentRecipe: Partial<Recipe>): Promise<Recipe> {
  if (!OPENAI_API_KEY) {
    throw new Error("OpenAI API key not configured");
  }

  console.log("Generating suggestions for recipe:", currentRecipe.title);

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
          {
            role: "user",
            content: `Analyze and enhance this recipe: ${JSON.stringify(currentRecipe)}`
          }
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

    // Parse the AI response
    const sections = {
      title: aiResponse.match(/TITLE:\s*([\s\S]*?)(?=\n[A-Z]+:|\n\n|$)/)?.[1]?.trim(),
      description: aiResponse.match(/DESCRIPTION:\s*([\s\S]*?)(?=\n[A-Z]+:|\n\n|$)/)?.[1]?.trim(),
      ingredients: parseIngredients(aiResponse.match(/INGREDIENTS:\s*([\s\S]*?)(?=\n[A-Z]+:|\n\n|$)/)?.[1]?.trim() || ""),
      steps: parseSteps(aiResponse.match(/STEPS:\s*([\s\S]*?)(?=\n[A-Z]+:|\n\n|$)/)?.[1]?.trim() || ""),
      difficulty: aiResponse.match(/DIFFICULTY:\s*([^\n]+)/)?.[1]?.trim()?.toLowerCase(),
      cuisine: aiResponse.match(/CUISINE:\s*([^\n]+)/)?.[1]?.trim(),
      totalTime: aiResponse.match(/TOTAL_TIME:\s*([^\n]+)/)?.[1]?.trim(),
    };

    return {
      id: `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: sections.title || currentRecipe.title || "Enhanced Recipe",
      description: sections.description || currentRecipe.description || "",
      ingredients: sections.ingredients || [],
      steps: sections.steps || [],
      instructions: currentRecipe.instructions || [],
      difficulty: sections.difficulty || "medium",
      cuisine: sections.cuisine || "International",
      totalTime: sections.totalTime || "30 minutes",
      images: currentRecipe.images || [],
      featuredImageIndex: currentRecipe.featuredImageIndex || 0,
      status: "draft",
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      cookingMethods: currentRecipe.cookingMethods || [],
      dishTypes: currentRecipe.dishTypes || [],
      servings: currentRecipe.servings || { amount: 4, unit: 'servings' },
      tags: currentRecipe.tags || [],
      categories: currentRecipe.categories || [],
      equipment: currentRecipe.equipment || [],
      worksWith: currentRecipe.worksWith || [],
      serveWith: currentRecipe.serveWith || [],
      stats: currentRecipe.stats || { views: 0, likes: [], saves: [], comments: 0 }
    } as Recipe;
  } catch (error) {
    console.error("Error generating recipe suggestions:", error);
    throw error;
  }
}
