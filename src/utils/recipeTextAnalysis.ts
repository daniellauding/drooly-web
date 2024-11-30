import { Recipe } from "@/types/recipe";

export const analyzeRecipeText = (text: string): Partial<Recipe> => {
  console.log("Analyzing text:", text);
  
  const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
  
  // Find title (usually first line)
  const title = lines[0];
  
  // Find description (usually second paragraph or after title)
  const description = lines[1] || "";
  
  // Extract ingredients (lines with numbers or measurements)
  const ingredientLines = lines.filter(line => {
    const hasNumbers = /\d/.test(line);
    const hasMeasurements = /\b(msk|tsk|ml|g|kg|st|burk|dl)\b/i.test(line);
    return (hasNumbers || hasMeasurements) && !line.toLowerCase().includes('steg');
  });

  // Convert ingredient lines to structured format
  const ingredients = ingredientLines.map(line => {
    const amount = line.match(/\d+(\.\d+)?/)?.[0] || "1";
    const unit = line.match(/\b(msk|tsk|ml|g|kg|st|burk|dl)\b/i)?.[0] || "st";
    const name = line
      .replace(/^\d+(\.\d+)?/, '')
      .replace(/\b(msk|tsk|ml|g|kg|st|burk|dl)\b/i, '')
      .trim();

    return {
      name,
      amount,
      unit: unit.toLowerCase(),
      group: "Main Ingredients"
    };
  });

  // Extract steps (longer lines with instructions)
  const stepLines = lines.filter(line => 
    (line.length > 30 || line.toLowerCase().includes('steg')) &&
    !ingredientLines.includes(line)
  );

  const steps = stepLines.map((instruction, index) => ({
    title: `Step ${index + 1}`,
    instructions: instruction.trim(),
    duration: "",
    media: [],
    ingredients: []
  }));

  // Try to extract servings from description or ingredients
  const servingsMatch = text.match(/(\d+)\s*(?:personer|portioner|servings)/i);
  const servings = {
    amount: servingsMatch ? parseInt(servingsMatch[1]) : 4,
    unit: "serving"
  };

  return {
    title,
    description,
    ingredients,
    steps,
    servings,
    difficulty: "Medium",
    cuisine: text.toLowerCase().includes('thai') ? 'Thai' : 'International',
    totalTime: "",
    images: [],
    featuredImageIndex: 0,
    cookingMethods: [],
    dishTypes: [],
    equipment: [],
    categories: [],
    tags: []
  };
};