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
  // Check if the text contains a minimum number of recognizable words
  const recipeWordCount = COMMON_RECIPE_WORDS.filter(word => 
    normalizedText.includes(word)
  ).length;
  
  // Text should have at least 3 recipe-related words and be reasonably long
  return recipeWordCount >= 3 && text.length > 50;
};

const cleanOCRText = (text: string): string => {
  return text
    .replace(/[^\w\s,.()/-]/g, '') // Remove special characters except basic punctuation
    .replace(/\s+/g, ' ')          // Normalize whitespace
    .trim();
};

export const analyzeRecipeText = async (text: string): Promise<Partial<Recipe>> => {
  console.log("Analyzing OCR text:", text);
  
  const cleanedText = cleanOCRText(text);
  console.log("Cleaned OCR text:", cleanedText);

  // If the OCR result doesn't look like a recipe or is too garbled,
  // immediately try to get AI suggestions
  if (!isLikelyRecipeText(cleanedText)) {
    console.log("OCR text appears garbled or unclear, requesting AI assistance");
    try {
      const suggestions = await generateRecipeSuggestions({
        title: "Recipe from Photo",
        description: "Please analyze this image and suggest a recipe that might match what's shown: " + cleanedText
      });
      console.log("Received AI suggestions:", suggestions);
      return suggestions;
    } catch (error) {
      console.error("Error getting AI suggestions:", error);
      throw new Error("Could not generate recipe suggestions. Please try taking another photo with better lighting and focus.");
    }
  }

  // Split text into lines and remove empty ones
  const lines = cleanedText.split('\n').filter(line => line.trim());

  // Try to find title (usually first non-empty line or line with "Recipe" in it)
  const titleLine = lines.find(line => 
    line.toLowerCase().includes('recipe') || 
    (line.length > 3 && line.length < 50)
  ) || "Recipe from Photo";

  // Extract potential ingredients (lines with numbers or measurements)
  const ingredientLines = lines.filter(line => {
    const hasNumbers = /\d/.test(line);
    const hasMeasurements = /\b(cup|tbsp|tsp|g|kg|ml|l|oz|pound|piece|slice)s?\b/i.test(line);
    return hasNumbers || hasMeasurements;
  });

  // Convert ingredient lines to structured format
  const ingredients = ingredientLines.map(line => {
    const amount = line.match(/\d+(\.\d+)?/)?.[0] || "";
    const unit = line.match(/\b(cup|tbsp|tsp|g|kg|ml|l|oz|pound|piece|slice)s?\b/i)?.[0] || "";
    const name = line
      .replace(/\d+(\.\d+)?/, '')
      .replace(/\b(cup|tbsp|tsp|g|kg|ml|l|oz|pound|piece|slice)s?\b/i, '')
      .trim();

    return {
      name: name || "Unknown ingredient",
      amount: amount || "1",
      unit: unit || "piece",
      group: "main"
    };
  });

  // Extract instructions (longer lines without numbers at start)
  const instructionLines = lines.filter(line => 
    line.length > 30 && 
    !line.trim().match(/^\d/) &&
    !ingredientLines.includes(line)
  );

  const steps = instructionLines.map((instruction, index) => ({
    title: `Step ${index + 1}`,
    instructions: instruction.trim() || "Instructions not detected",
    duration: "",
    media: []
  }));

  // If we don't have enough information, try AI suggestions
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
    }
  }

  return {
    title: titleLine,
    description: lines[1]?.trim() || "A delicious recipe",
    ingredients: ingredients.length > 0 ? ingredients : [{ name: "Ingredients not detected", amount: "1", unit: "piece", group: "main" }],
    steps: steps.length > 0 ? steps : [{ title: "Step 1", instructions: "Instructions not detected", duration: "", media: [] }],
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
    estimatedCost: "Under $5",
    season: "Year Round"
  };
};
