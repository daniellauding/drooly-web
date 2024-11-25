import { Ingredient } from "@/types/recipe";

const isInstruction = (text: string): boolean => {
  // Check if text is likely an instruction rather than ingredient
  const instructionIndicators = [
    'fräs', 'tillsätt', 'häll', 'låt', 'koka', 'blanda', 'rör', 'mixa',
    'skär', 'hacka', 'värm', 'stek', 'grädda', 'servera'
  ];
  
  return instructionIndicators.some(indicator => 
    text.toLowerCase().includes(indicator)
  );
};

const cleanIngredientText = (text: string): string => {
  return text
    .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
    .replace(/\n/g, ' ')   // Replace newlines with space
    .replace(/\t/g, ' ')   // Replace tabs with space
    .trim();
};

const removeDuplicates = (ingredients: Ingredient[]): Ingredient[] => {
  const seen = new Set();
  return ingredients.filter(ing => {
    const key = `${ing.name}-${ing.amount}-${ing.unit}`;
    const isDuplicate = seen.has(key);
    seen.add(key);
    return !isDuplicate && ing.name.length < 100 && !isInstruction(ing.name);
  });
};

export const parseIngredients = (rawIngredients: any[]): Ingredient[] => {
  console.log('Parsing ingredients:', rawIngredients);
  
  const ingredients = rawIngredients
    .filter(ing => typeof ing === 'string' || (ing?.name && !isInstruction(ing.name)))
    .map(ing => {
      if (typeof ing === 'string') {
        const cleanedText = cleanIngredientText(ing);
        // Try to parse amount and unit from text
        const match = cleanedText.match(/^(\d+(?:[,.]\d+)?)\s*(g|kg|ml|l|dl|msk|tsk|st|burk)?\s*(.+)/i);
        
        if (match) {
          return {
            name: match[3].trim(),
            amount: match[1].trim(),
            unit: (match[2] || "").trim(),
            group: "main"
          };
        }
        
        return {
          name: cleanedText,
          amount: "",
          unit: "",
          group: "main"
        };
      }
      
      return {
        ...ing,
        name: cleanIngredientText(ing.name),
        group: ing.group || "main"
      };
    });

  return removeDuplicates(ingredients);
};