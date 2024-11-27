import { Recipe } from "@/types/recipe";

export const analyzeRecipeText = (text: string): Partial<Recipe> => {
  console.log("Analyzing text:", text);
  
  // Split text into lines and remove empty ones
  const lines = text.split('\n').filter(line => line.trim());

  // Try to find title (usually first non-empty line or line with "Recipe" in it)
  const titleLine = lines.find(line => 
    line.toLowerCase().includes('recipe') || 
    line.length > 3 && line.length < 50
  ) || lines[0];

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
      name,
      amount,
      unit,
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
    instructions: instruction.trim(),
    duration: "",
    media: []
  }));

  return {
    title: titleLine?.trim() || "Untitled Recipe",
    description: lines[1]?.trim() || "",
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
    estimatedCost: "Under $5",
    season: "Year Round"
  };
};