import { normalizeUnit, normalizeIngredientName, expandMixedIngredients } from './unitNormalizer';

export const parseIngredients = (ingredientsText: string) => {
  console.log("Parsing ingredients:", ingredientsText);
  
  const ingredients = ingredientsText.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(line => {
      // Match amount, unit, and name
      const match = line.match(/^(\d+(?:[,.]\d+)?)\s*([a-zA-Z]+)?\s*(.+)$/);
      
      if (match) {
        const [_, amount, unit, name] = match;
        const normalizedName = normalizeIngredientName(name);
        const normalizedUnit = normalizeUnit(unit || '');
        
        return {
          name: normalizedName,
          amount: amount,
          unit: normalizedUnit,
          group: "Main Ingredients"
        };
      }
      
      return {
        name: line,
        amount: "1",
        unit: "piece",
        group: "Main Ingredients"
      };
    })
    .flatMap(expandMixedIngredients);

  console.log("Parsed ingredients:", ingredients);
  return ingredients;
};