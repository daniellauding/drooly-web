import { Recipe } from "@/types/recipe";
import { createApi } from 'unsplash-js';

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

const SYSTEM_PROMPT = `You are a professional chef and culinary AI assistant. When analyzing recipes, provide detailed suggestions including:
- A list of ingredients with precise quantities and units
- Detailed cooking steps with timing
- Cuisine categorization and difficulty level
- Dietary considerations
- Required equipment and cooking methods
- Seasonal recommendations and occasions
- Cost estimates
- Serving suggestions
Always maintain the original concept while enhancing it with professional culinary expertise.
IMPORTANT: Format your response in a structured way that can be easily parsed, using clear section markers like:
TITLE:
DESCRIPTION:
INGREDIENTS: (one per line with amount, unit, and name clearly separated)
STEPS: (numbered with timing)
DIFFICULTY:
CUISINE:
DIETARY_INFO:
CATEGORIES:
ESTIMATED_COST:
SEASON:
OCCASION:
EQUIPMENT:
COOKING_METHODS:
DISH_TYPES:
SERVINGS_AMOUNT:
SERVINGS_UNIT:
TOTAL_TIME:`;

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
          {
            role: "system",
            content: SYSTEM_PROMPT
          },
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
    console.log("Raw OpenAI response:", data.choices[0]?.message?.content);

    // Parse the AI response
    const aiResponse = data.choices[0]?.message?.content;
    
    // Parse sections using regex
    const sections = {
      title: aiResponse.match(/TITLE:\s*([^\n]+)/)?.[1]?.trim(),
      description: aiResponse.match(/DESCRIPTION:\s*([\s\S]*?)(?=\n[A-Z]+:|\n\n|$)/)?.[1]?.trim(),
      ingredients: aiResponse.match(/INGREDIENTS:\s*([\s\S]*?)(?=\n[A-Z]+:|\n\n|$)/)?.[1]?.trim()?.split('\n'),
      steps: aiResponse.match(/STEPS:\s*([\s\S]*?)(?=\n[A-Z]+:|\n\n|$)/)?.[1]?.trim()?.split('\n'),
      difficulty: aiResponse.match(/DIFFICULTY:\s*([^\n]+)/)?.[1]?.trim(),
      cuisine: aiResponse.match(/CUISINE:\s*([^\n]+)/)?.[1]?.trim(),
      dietaryInfo: aiResponse.match(/DIETARY_INFO:\s*([\s\S]*?)(?=\n[A-Z]+:|\n\n|$)/)?.[1]?.trim(),
      categories: aiResponse.match(/CATEGORIES:\s*([^\n]+)/)?.[1]?.trim()?.split(','),
      estimatedCost: aiResponse.match(/ESTIMATED_COST:\s*([^\n]+)/)?.[1]?.trim(),
      season: aiResponse.match(/SEASON:\s*([^\n]+)/)?.[1]?.trim(),
      occasion: aiResponse.match(/OCCASION:\s*([^\n]+)/)?.[1]?.trim(),
      equipment: aiResponse.match(/EQUIPMENT:\s*([^\n]+)/)?.[1]?.trim()?.split(','),
      cookingMethods: aiResponse.match(/COOKING_METHODS:\s*([^\n]+)/)?.[1]?.trim()?.split(','),
      dishTypes: aiResponse.match(/DISH_TYPES:\s*([^\n]+)/)?.[1]?.trim()?.split(','),
      servingsAmount: parseInt(aiResponse.match(/SERVINGS_AMOUNT:\s*(\d+)/)?.[1] || "4"),
      servingsUnit: aiResponse.match(/SERVINGS_UNIT:\s*([^\n]+)/)?.[1]?.trim(),
      totalTime: aiResponse.match(/TOTAL_TIME:\s*([^\n]+)/)?.[1]?.trim(),
    };

    console.log("Parsed recipe sections:", sections);

    // Fetch relevant images from Unsplash
    let suggestedImages: string[] = [];
    if (UNSPLASH_API_KEY) {
      try {
        const searchTerm = `${sections.title || currentRecipe.title} food recipe`;
        const unsplashResponse = await unsplash.search.getPhotos({
          query: searchTerm,
          perPage: 5,
          orientation: 'landscape'
        });

        if (unsplashResponse.response?.results) {
          // Extract only the URLs from the Unsplash response
          suggestedImages = unsplashResponse.response.results.map(photo => photo.urls.regular);
          console.log("Fetched Unsplash image URLs:", suggestedImages);
        }
      } catch (error) {
        console.error("Error fetching Unsplash images:", error);
      }
    }

    // Return enhanced recipe with parsed sections and images
    return {
      ...currentRecipe,
      title: sections.title || currentRecipe.title,
      description: sections.description,
      ingredients: sections.ingredients?.map(ing => ({
        name: ing.trim(),
        amount: "1",
        unit: "piece"
      })) || [],
      steps: sections.steps?.map((step, index) => ({
        title: `Step ${index + 1}`,
        instructions: step.trim(),
        duration: "",
        media: [],
        ingredients: []
      })) || [],
      difficulty: sections.difficulty?.toLowerCase(),
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
        unit: sections.servingsUnit || "servings"
      },
      totalTime: sections.totalTime,
      images: suggestedImages
    };
  } catch (error) {
    console.error("Error generating recipe suggestions:", error);
    throw error;
  }
}
