import { Recipe } from "@/types/recipe";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error("OpenAI API key not found. Please add VITE_OPENAI_API_KEY to your .env file");
}

const SYSTEM_PROMPT = `You are a professional chef and culinary AI assistant. When analyzing recipes, provide detailed suggestions including:
- A list of ingredients with precise quantities and units
- Detailed cooking steps with timing
- Cuisine categorization and difficulty level
- Dietary considerations
- Required equipment and cooking methods
- Seasonal recommendations and occasions
- Cost estimates
- Serving suggestions
Always maintain the original concept while enhancing it with professional culinary expertise.`;

export async function generateRecipeSuggestions(currentRecipe: Partial<Recipe>) {
  if (!OPENAI_API_KEY) {
    throw new Error("OpenAI API key not configured. Please add VITE_OPENAI_API_KEY to your .env file");
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
            
            Please provide a detailed response including:
            1. Enhanced description
            2. Complete ingredient list with quantities and units
            3. Detailed step-by-step instructions with timing
            4. Difficulty level and cuisine type
            5. Dietary information
            6. Categories and tags
            7. Estimated cost
            8. Seasonal recommendations
            9. Suitable occasions
            10. Required equipment
            11. Cooking methods
            12. Dish type
            13. Serving size and unit
            14. Total cooking time
            15. Image suggestions (describe what kind of images would work well)`
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
    console.log("Received OpenAI response:", data);

    // Parse the AI response into structured recipe data
    const aiResponse = data.choices[0]?.message?.content;
    
    // Extract suggested images from the AI response
    const imageDescriptions = aiResponse.match(/Image suggestions:[\s\S]*?(?=\n\n|$)/i)?.[0] || "";
    
    // Use Unsplash API to search for relevant images based on the recipe title and description
    const unsplashResponse = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(currentRecipe.title || "food")}&per_page=5`,
      {
        headers: {
          'Authorization': `Client-ID YOUR_UNSPLASH_API_KEY`
        }
      }
    ).catch(() => null); // Gracefully handle if Unsplash API is not available

    const unsplashData = await unsplashResponse?.json();
    const suggestedImages = unsplashData?.results?.map((img: any) => img.urls.regular) || [];

    // Return enhanced recipe with image suggestions
    return {
      ...currentRecipe,
      description: aiResponse,
      images: [...(currentRecipe.images || []), ...suggestedImages],
      imageDescriptions: imageDescriptions
    };
  } catch (error) {
    console.error("Error generating recipe suggestions:", error);
    throw error;
  }
}