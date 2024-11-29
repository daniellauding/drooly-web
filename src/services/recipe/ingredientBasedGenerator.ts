import { Recipe } from "@/types/recipe";
import { parseIngredients } from "./ingredientParser";
import { parseSteps } from "./stepParser";
import { CUISINES, RECIPE_CATEGORIES, SEASONS, COST_CATEGORIES } from "@/types/recipe";
import { Timestamp } from 'firebase/firestore';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const SYSTEM_PROMPT = `You are a professional chef. Given a list of ingredients, suggest recipes that can be made using most or all of them. Follow this format EXACTLY:

RECIPES: (list 3 recipes in this format for each)

TITLE: (recipe name)
DESCRIPTION: (brief description)
INGREDIENTS: (list ALL needed ingredients, including the ones provided)
STEPS: (numbered list of steps)
DIFFICULTY: (easy/medium/hard)
CUISINE: (cuisine type)
TOTAL_TIME: (estimated time)
`;

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
        status: 'generated',
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
