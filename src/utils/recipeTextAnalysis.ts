import { Recipe } from "@/types/recipe";
import { generateRecipeSuggestions } from "@/services/openaiService";

const COMMON_RECIPE_WORDS = [
  "recipe", "ingredients", "instructions", "method", "preparation",
  "cook", "bake", "mix", "stir", "add", "combine", "heat", "serve",
  "minutes", "hour", "temperature", "degrees", "cup", "tablespoon",
  "teaspoon", "gram", "pound", "ounce", "ml", "liter"
];

const isLikelyRecipeText = (text: string): boolean => {
  const normalizedText = text.toLowerCase();
  const recipeWordCount = COMMON_RECIPE_WORDS.filter(word => 
    normalizedText.includes(word)
  ).length;
  
  return recipeWordCount >= 3 && text.length > 50;
};

const cleanOCRText = (text: string): string => {
  return text
    .replace(/[^\w\s,.()/-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

const extractIngredients = (lines: string[]): { name: string; amount: string; unit: string; group: string; }[] => {
  return lines
    .filter(line => {
      const hasNumbers = /\d/.test(line);
      const hasMeasurements = /\b(cup|tbsp|tsp|g|kg|ml|l|oz|pound|piece|slice)s?\b/i.test(line);
      const hasIngredientWords = /\b(salt|pepper|sugar|flour|oil|water|butter|milk|egg|onion|garlic)\b/i.test(line);
      return (hasNumbers && (hasMeasurements || hasIngredientWords)) || (hasMeasurements && hasIngredientWords);
    })
    .map(line => {
      const amount = line.match(/\d+(\.\d+)?/)?.[0] || "1";
      const unit = line.match(/\b(cup|tbsp|tsp|g|kg|ml|l|oz|pound|piece|slice)s?\b/i)?.[0] || "piece";
      const name = line
        .replace(/\d+(\.\d+)?/, '')
        .replace(/\b(cup|tbsp|tsp|g|kg|ml|l|oz|pound|piece|slice)s?\b/i, '')
        .trim();

      return {
        name: name || "Unknown ingredient",
        amount,
        unit,
        group: "Main Ingredients"
      };
    });
};

const extractInstructions = (lines: string[]): { title: string; instructions: string; duration: string; media: string[]; ingredients: any[]; }[] => {
  const instructionLines = lines.filter(line => 
    line.length > 30 && 
    !line.trim().match(/^\d/) &&
    !/^\d+(\.\d+)?\s*(cup|tbsp|tsp|g|kg|ml|l|oz|pound|piece|slice)s?\b/i.test(line)
  );

  return instructionLines.map((instruction, index) => ({
    title: `Step ${index + 1}`,
    instructions: instruction.trim(),
    duration: "",
    media: [],
    ingredients: []
  }));
};

export const analyzeRecipeText = async (text: string): Promise<Partial<Recipe>> => {
  console.log("Analyzing OCR text:", text);
  
  const cleanedText = cleanOCRText(text);
  console.log("Cleaned OCR text:", cleanedText);

  if (!isLikelyRecipeText(cleanedText)) {
    console.log("OCR text appears garbled or unclear, requesting AI assistance");
    try {
      const suggestions = await generateRecipeSuggestions({
        title: "Recipe from Photo",
        description: "Please analyze this image and suggest a recipe that might match what's shown: " + cleanedText
      });
      return suggestions;
    } catch (error) {
      console.error("Error getting AI suggestions:", error);
      throw new Error("Could not generate recipe suggestions. Please try taking another photo with better lighting and focus.");
    }
  }

  const lines = cleanedText.split('\n').filter(line => line.trim());
  const titleLine = lines.find(line => 
    line.toLowerCase().includes('recipe') || 
    (line.length > 3 && line.length < 50)
  ) || "Recipe from Photo";

  const ingredients = extractIngredients(lines);
  const steps = extractInstructions(lines);

  if (ingredients.length === 0 || steps.length === 0) {
    try {
      console.log("Not enough recipe information extracted, getting AI suggestions");
      const suggestions = await generateRecipeSuggestions({
        title: titleLine,
        description: cleanedText
      });
      return suggestions;
    } catch (error) {
      console.error("Error getting AI suggestions:", error);
      throw new Error("Could not generate recipe suggestions. Please try taking another photo with better lighting and focus.");
    }
  }

  return {
    title: titleLine,
    description: lines[1]?.trim() || "A delicious recipe",
    ingredients,
    steps,
    servings: {
      amount: 4,
      unit: "serving"
    },
    difficulty: "Medium",
    cuisine: "International",
    totalTime: "",
    images: [],
    featuredImageIndex: 0,
    cookingMethods: [],
    dishTypes: [],
    equipment: [],
    categories: [],
    tags: [],
    estimatedCost: "",
    season: "Year Round"
  };
};