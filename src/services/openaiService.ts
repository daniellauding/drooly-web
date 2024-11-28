import { Recipe } from "@/types/recipe";

const OPENAI_SYSTEM_PROMPT = `You are a culinary AI assistant. Your task is to enhance recipes by suggesting improvements and additions while maintaining the original concept. Consider:
- Ingredient combinations and proportions
- Cooking techniques
- Flavor profiles
- Nutritional balance
- Presentation suggestions`;

export const generateRecipeSuggestions = async (recipe: Partial<Recipe>, apiKey: string): Promise<Partial<Recipe>> => {
  console.log("Generating recipe suggestions for:", recipe);

  if (!apiKey) {
    throw new Error("OpenAI API key is required");
  }

  const recipeContext = `
    Title: ${recipe.title || ''}
    Description: ${recipe.description || ''}
    Ingredients: ${recipe.ingredients?.map(i => `${i.amount} ${i.unit} ${i.name}`).join(', ') || ''}
    Steps: ${recipe.steps?.map(s => s.instructions).join(' ') || ''}
  `;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: OPENAI_SYSTEM_PROMPT },
          { role: 'user', content: `Please enhance this recipe while keeping its core concept:\n${recipeContext}` }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate suggestions');
    }

    const data = await response.json();
    console.log("OpenAI response:", data);

    // Parse the AI response and convert it to recipe format
    // This is a simplified example - you'll need to implement proper parsing
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
