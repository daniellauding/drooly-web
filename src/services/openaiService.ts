import { Recipe } from "@/types/recipe";
import { createApi } from 'unsplash-js';
import { parseIngredients } from './recipe/ingredientParser';
import { parseSteps, mapIngredientsToSteps } from './recipe/stepParser';
import { CUISINES, RECIPE_CATEGORIES, SEASONS, COST_CATEGORIES } from "@/types/recipe";

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
        instructions: [], // Add missing required field
        difficulty: sections.difficulty || "medium",
        cuisine: sections.cuisine || "International",
        totalTime: sections.totalTime || "30 minutes",
        images: [],
        featuredImageIndex: 0,
        status: 'generated' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
        cookingMethods: [], // Add missing required field
        dishTypes: [], // Add missing required field
        servings: { amount: 4, unit: 'servings' }, // Add missing required field
        tags: [], // Add missing required field
        categories: [], // Add missing required field
        equipment: [], // Add missing required field
        worksWith: [], // Add missing required field
        serveWith: [], // Add missing required field
        stats: { views: 0, likes: [], saves: [], comments: 0 } // Add missing required field
      } as Recipe;
    });
  } catch (error) {
    console.error("Error generating recipes:", error);
    throw error;
  }
}

const mapToClosestMatch = (value: string, options: string[]): string => {
  if (!value) return options[0];
  
  // Convert to lowercase for comparison
  const normalizedValue = value.toLowerCase();
  
  // First try exact match
  const exactMatch = options.find(opt => opt.toLowerCase() === normalizedValue);
  if (exactMatch) return exactMatch;
  
  // Then try includes match
  const includesMatch = options.find(opt => 
    normalizedValue.includes(opt.toLowerCase()) || 
    opt.toLowerCase().includes(normalizedValue)
  );
  if (includesMatch) return includesMatch;
  
  // Default to first option if no match found
  console.log(`No match found for ${value}, defaulting to ${options[0]}`);
  return options[0];
};

const mapCostToCategory = (cost: string): string => {
  if (!cost) return COST_CATEGORIES[0];
  
  const amount = cost.match(/\$(\d+)/)?.[1];
  if (!amount) return COST_CATEGORIES[0];
  
  const numAmount = parseInt(amount);
  if (numAmount <= 5) return "Under $5";
  if (numAmount <= 10) return "$5-$10";
  if (numAmount <= 20) return "$10-$20";
  if (numAmount <= 30) return "$20-$30";
  return "$30+";
};

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
        model: "gpt-4",
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
      season: aiResponse.match(/SEASON:\s*([^\n]+)/)?.[1]?.trim(),
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

    // Map values to predefined options
    const mappedCuisine = mapToClosestMatch(sections.cuisine || "", CUISINES);
    console.log(`Mapped cuisine from ${sections.cuisine} to ${mappedCuisine}`);

    const mappedCategories = sections.categories?.map(cat => 
      mapToClosestMatch(cat, RECIPE_CATEGORIES)
    ).filter((cat, index, self) => self.indexOf(cat) === index) || [];
    console.log(`Mapped categories from ${sections.categories} to ${mappedCategories}`);

    const mappedSeason = mapToClosestMatch(sections.season || "", SEASONS);
    console.log(`Mapped season from ${sections.season} to ${mappedSeason}`);

    const mappedCost = mapCostToCategory(sections.estimatedCost || "");
    console.log(`Mapped cost from ${sections.estimatedCost} to ${mappedCost}`);

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
      cuisine: mappedCuisine,
      dietaryInfo: {
        isVegetarian: sections.dietaryInfo?.toLowerCase().includes('vegetarian'),
        isVegan: sections.dietaryInfo?.toLowerCase().includes('vegan'),
        isGlutenFree: !sections.dietaryInfo?.toLowerCase().includes('gluten'),
        isDairyFree: !sections.dietaryInfo?.toLowerCase().includes('dairy'),
        containsNuts: sections.dietaryInfo?.toLowerCase().includes('nuts')
      },
      categories: mappedCategories,
      estimatedCost: mappedCost,
      season: mappedSeason,
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

