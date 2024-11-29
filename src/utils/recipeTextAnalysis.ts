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
  return COMMON_RECIPE_WORDS.some(word => normalizedText.includes(word));
};

const cleanOCRText = (text: string): string => {
  return text
    .replace(/[^\w\s,.()/-]/g, '') // Remove special characters except basic punctuation
    .replace(/\s+/g, ' ')          // Normalize whitespace
    .trim();
};

export const analyzeRecipeText = async (text: string): Promise<Partial<Recipe>> => {
  console.log("Analyzing text:", text);
  
  const cleanedText = cleanOCRText(text);
  
  // If the OCR result doesn't look like a recipe, try to get AI suggestions
  if (!isLikelyRecipeText(cleanedText)) {
    try {
      console.log("OCR text doesn't look like a recipe, getting AI suggestions");
      const suggestions = await generateRecipeSuggestions({
        title: "Recipe from Photo",
        description: cleanedText
      });
      return suggestions;
    } catch (error) {
      console.error("Error getting AI suggestions:", error);
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