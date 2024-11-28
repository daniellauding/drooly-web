import { Recipe } from "@/types/recipe";

const OPENAI_SYSTEM_PROMPT = `You are a culinary AI assistant. Your task is to enhance recipes by suggesting improvements and additions while maintaining the original concept. Consider:
- Ingredient combinations and proportions
- Cooking techniques
- Flavor profiles
- Nutritional balance
- Presentation suggestions`;

export const generateRecipeSuggestions = async (recipe: Partial<Recipe>): Promise<Partial<Recipe>> => {
  console.log("Generating recipe suggestions for:", recipe);

  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error("OpenAI API key not configured. Please contact the administrator.");
  }

  const recipeContext = `
    Title: ${recipe.title || ''}
    Description: ${recipe.description || ''}
    Ingredients: ${recipe.ingredients?.map(i => `${i.amount} ${i.unit} ${i.name}`).join(', ') || ''}
    Steps: ${recipe.steps?.map(s => s.instructions).join(' ') || ''}
  `;

  try {
    console.log("Making OpenAI API request with key:", apiKey.substring(0, 3) + "...");
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4-1106-preview', // Updated to latest model
        messages: [
          { role: 'system', content: OPENAI_SYSTEM_PROMPT },
          { role: 'user', content: `Please enhance this recipe while keeping its core concept:\n${recipeContext}` }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("OpenAI API error:", error);
      throw new Error(error.error?.message || 'Failed to generate suggestions');
    }

    const data = await response.json();
    console.log("OpenAI response:", data);

    // Parse the AI response and convert it to recipe format
    const suggestions = {
      title: recipe.title,
      description: data.choices[0].message.content,
      // ... other recipe fields
    };

    return suggestions;
  } catch (error) {
    console.error("Error generating recipe suggestions:", error);
    throw error;
  }
}