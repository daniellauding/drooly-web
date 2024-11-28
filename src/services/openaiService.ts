import { Recipe } from "@/types/recipe";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error("OpenAI API key not found. Please add VITE_OPENAI_API_KEY to your .env file");
}

const model = "gpt-3.5-turbo";

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
        model: model,
        messages: [
          {
            role: "system",
            content: "You are a helpful cooking assistant that provides recipe suggestions and improvements."
          },
          {
            role: "user",
            content: `Please analyze this recipe and suggest improvements:\n${JSON.stringify(currentRecipe, null, 2)}`
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Received OpenAI response:", data);

    // Process the response and return suggestions
    return {
      description: data.choices[0]?.message?.content || "No suggestions available",
      // Add other recipe fields as needed
    };
  } catch (error) {
    console.error("Error generating recipe suggestions:", error);
    throw error;
  }
}