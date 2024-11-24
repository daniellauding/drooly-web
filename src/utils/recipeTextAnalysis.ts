import { Recipe } from "@/types/recipe";

export const analyzeRecipeText = (text: string) => {
  console.log("Analyzing recipe text:", text);
  
  const lines = text.split('\n').map(line => line.trim());
  
  // Extract title and cuisine
  const title = lines[0] || "";
  const cuisine = detectCuisine(title);
  
  // Extract servings
  const servingsMatch = text.match(/(\d+)\s*personer/i);
  const servings = servingsMatch ? {
    amount: parseInt(servingsMatch[1]),
    unit: "serving"
  } : undefined;
  
  // Extract cooking methods
  const cookingMethods = detectCookingMethods(text);
  
  // Extract equipment
  const equipment = detectEquipment(text);
  
  // Extract ingredients with amounts and units
  const ingredients = extractIngredients(text);
  
  // Extract instructions
  const instructionsStart = lines.findIndex(line => 
    line.toLowerCase().includes("gör du") ||
    line.toLowerCase().includes("instructions") ||
    line.toLowerCase().includes("directions")
  );
  
  const instructions = instructionsStart !== -1 
    ? lines.slice(instructionsStart + 1).join("\n")
    : "";

  return {
    title,
    cuisine,
    servings,
    cookingMethods,
    equipment,
    ingredients,
    steps: [{
      title: "Instructions",
      instructions,
      duration: "",
      media: []
    }]
  };
};

const detectCuisine = (text: string): string => {
  const cuisineKeywords: Record<string, string[]> = {
    "thai": ["thai", "curry", "coconut milk"],
    "italian": ["pasta", "pizza", "risotto"],
    "japanese": ["sushi", "ramen", "miso"],
    // Add more cuisines and their keywords
  };

  const lowerText = text.toLowerCase();
  for (const [cuisine, keywords] of Object.entries(cuisineKeywords)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      return cuisine;
    }
  }
  return "";
};

const detectCookingMethods = (text: string): string[] => {
  const methods = [
    "wok", "fry", "boil", "steam", "bake", "grill", "roast",
    "simmer", "stir-fry", "deep-fry", "sauté"
  ];
  
  const foundMethods = methods.filter(method => 
    text.toLowerCase().includes(method.toLowerCase())
  );
  
  return [...new Set(foundMethods)];
};

const detectEquipment = (text: string): string[] => {
  const equipment = [
    "wok", "pan", "pot", "gryta", "plate", "tallrik", "deep plate",
    "djup tallrik", "bowl", "skål"
  ];
  
  const foundEquipment = equipment.filter(item => 
    text.toLowerCase().includes(item.toLowerCase())
  );
  
  return [...new Set(foundEquipment)];
};

const extractIngredients = (text: string): { name: string; amount: string; unit: string; }[] => {
  console.log("Extracting ingredients from text:", text);
  const ingredients: { name: string; amount: string; unit: string; }[] = [];
  
  // Look for ingredient patterns
  const lines = text.split('\n');
  const ingredientSection = lines.slice(
    lines.findIndex(line => line.toLowerCase().includes("ingrediens")),
    lines.findIndex(line => line.toLowerCase().includes("gör du"))
  );
  
  ingredientSection.forEach(line => {
    const match = line.match(/^(\d+)\s*(ml|g|msk|tsk|st|burk)?\s*(.+)/i);
    if (match) {
      ingredients.push({
        amount: match[1],
        unit: match[2] || "",
        name: match[3].trim()
      });
    }
  });
  
  console.log("Extracted ingredients:", ingredients);
  return ingredients;
};