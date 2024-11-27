import { Ingredient } from '@/types/recipe';

const isInstruction = (text: string): boolean => {
  const instructionIndicators = [
    'fräs', 'tillsätt', 'häll', 'låt', 'koka', 'blanda', 'rör', 'mixa',
    'skär', 'hacka', 'värm', 'stek', 'grädda', 'servera', 'gör', 'så här'
  ];
  
  return instructionIndicators.some(indicator => 
    text.toLowerCase().includes(indicator)
  );
};

const cleanIngredientText = (text: string): string => {
  return text
    .replace(/\s+/g, ' ')
    .replace(/\n/g, ' ')
    .replace(/\t/g, ' ')
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

export const parseIngredients = (rawIngredients: string[]): Ingredient[] => {
  console.log('Parsing ingredients:', rawIngredients);
  
  const ingredients = rawIngredients
    .filter(ing => typeof ing === 'string' && !isInstruction(ing))
    .map(ing => {
      const cleanedText = cleanIngredientText(ing);
      // Swedish measurements: msk (tablespoon), tsk (teaspoon), dl (deciliter), st (piece)
      const match = cleanedText.match(/^(\d+(?:[,.]\d+)?)\s*(g|kg|ml|l|dl|msk|tsk|st|krm|burk|port)?\s*(.+)/i);
      
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
    });

  return removeDuplicates(ingredients);
};