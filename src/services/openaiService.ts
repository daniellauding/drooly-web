import { Recipe } from "@/types/recipe";
import { createApi } from 'unsplash-js';
import { parseIngredients } from './recipe/ingredientParser';
import { parseSteps, mapIngredientsToSteps } from './recipe/stepParser';

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

export async function generateRecipeSuggestions(currentRecipe: Partial<Recipe>) {
  if (!OPENAI_API_KEY) {
    throw new Error("OpenAI API key not configured");
  }

  console.log("Generating recipe suggestions for:", currentRecipe.title);

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `Please enhance this recipe with detailed suggestions:
            Current Recipe: ${JSON.stringify(currentRecipe, null, 2)}
            
            Please provide a detailed response following the exact format specified.`
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

    // Parse sections using regex
    const sections = {
      title: aiResponse.match(/TITLE:\s*([^\n]+)/)?.[1]?.trim(),
      description: aiResponse.match(/DESCRIPTION:\s*([\s\S]*?)(?=\n[A-Z]+:|\n\n|$)/)?.[1]?.trim(),
      ingredients: parseIngredients(aiResponse.match(/INGREDIENTS:\s*([\s\S]*?)(?=\n[A-Z]+:|\n\n|$)/)?.[1]?.trim() || ""),
      steps: parseSteps(aiResponse.match(/STEPS:\s*([\s\S]*?)(?=\n[A-Z]+:|\n\n|$)/)?.[1]?.trim() || ""),
      difficulty: aiResponse.match(/DIFFICULTY:\s*([^\n]+)/)?.[1]?.trim()?.toLowerCase(),
      cuisine: aiResponse.match(/CUISINE:\s*([^\n]+)/)?.[1]?.trim(),
      dietaryInfo: aiResponse.match(/DIETARY_INFO:\s*([\s\S]*?)(?=\n[A-Z]+:|\n\n|$)/)?.[1]?.trim(),
      categories: aiResponse.match(/CATEGORIES:\s*([^\n]+)/)?.[1]?.trim()?.split(',').map(c => c.trim()),
      estimatedCost: aiResponse.match(/ESTIMATED_COST:\s*([^\n]+)/)?.[1]?.trim(),
      season: aiResponse.match(/SEASON:\s*([^\n]+)/)?.[1]?.trim() || "Summer",
      occasion: aiResponse.match(/OCCASION:\s*([^\n]+)/)?.[1]?.trim(),
      equipment: aiResponse.match(/EQUIPMENT:\s*([^\n]+)/)?.[1]?.trim()?.split(',').map(e => e.trim()),
      cookingMethods: aiResponse.match(/COOKING_METHODS:\s*([^\n]+)/)?.[1]?.trim()?.split(',').map(m => m.trim()),
      dishTypes: aiResponse.match(/DISH_TYPES:\s*([^\n]+)/)?.[1]?.trim()?.split(',').map(t => t.trim()),
      servingsAmount: parseInt(aiResponse.match(/SERVINGS_AMOUNT:\s*(\d+)/)?.[1] || "4"),
      servingsUnit: aiResponse.match(/SERVINGS_UNIT:\s*([^\n]+)/)?.[1]?.trim() || "servings",
      totalTime: aiResponse.match(/TOTAL_TIME:\s*([^\n]+)/)?.[1]?.trim(),
    };

    // Map ingredients to steps
    const stepsWithIngredients = mapIngredientsToSteps(sections.steps, sections.ingredients);

    console.log("Parsed recipe sections:", sections);

    // Fetch Unsplash images
    let suggestedImages: string[] = [];
    if (UNSPLASH_API_KEY) {
      try {
        const unsplash = createApi({ accessKey: UNSPLASH_API_KEY });
        const searchTerm = `${sections.title || currentRecipe.title} food recipe`;
        const unsplashResponse = await unsplash.search.getPhotos({
          query: searchTerm,
          perPage: 5,
          orientation: 'landscape'
        });

        if (unsplashResponse.response?.results) {
          suggestedImages = unsplashResponse.response.results.map(photo => photo.urls.regular);
        }
      } catch (error) {
        console.error("Error fetching Unsplash images:", error);
      }
    }

    return {
      ...currentRecipe,
      title: sections.title || currentRecipe.title,
      description: sections.description,
      ingredients: sections.ingredients,
      steps: stepsWithIngredients,
      difficulty: sections.difficulty,
      cuisine: sections.cuisine,
      dietaryInfo: {
        isVegetarian: sections.dietaryInfo?.toLowerCase().includes('vegetarian'),
        isVegan: sections.dietaryInfo?.toLowerCase().includes('vegan'),
        isGlutenFree: sections.dietaryInfo?.toLowerCase().includes('gluten-free'),
        isDairyFree: sections.dietaryInfo?.toLowerCase().includes('dairy-free'),
        containsNuts: sections.dietaryInfo?.toLowerCase().includes('nuts')
      },
      categories: sections.categories,
      estimatedCost: sections.estimatedCost,
      season: sections.season,
      occasion: sections.occasion,
      equipment: sections.equipment,
      cookingMethods: sections.cookingMethods,
      dishTypes: sections.dishTypes,
      servings: {
        amount: sections.servingsAmount,
        unit: sections.servingsUnit
      },
      totalTime: sections.totalTime,
      images: suggestedImages
    };
  } catch (error) {
    console.error("Error generating recipe suggestions:", error);
    throw error;
  }
}
