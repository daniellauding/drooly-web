export const normalizeUnit = (unit: string): string => {
  const unitMap: Record<string, string> = {
    'tablespoon': 'tbsp',
    'tablespoons': 'tbsp',
    'gram': 'g',
    'grams': 'g',
    'teaspoon': 'tsp',
    'teaspoons': 'tsp',
  };

  const normalizedUnit = unitMap[unit.toLowerCase()] || unit;
  return normalizedUnit || 'piece'; // Default to 'piece' if no unit specified
};

export const normalizeIngredientName = (name: string): string => {
  return name.replace(/,.*$/, '').trim(); // Remove everything after comma
};

export const expandMixedIngredients = (ingredient: { name: string; amount: string; unit: string }) => {
  if (ingredient.name.toLowerCase().includes('mixed vegetables')) {
    const vegetables = ingredient.name.match(/\((.*?)\)/)?.[1].split(',').map(v => v.trim()) || [];
    return vegetables.map(veg => ({
      name: veg,
      amount: ingredient.amount,
      unit: ingredient.unit,
      group: "Main Ingredients"
    }));
  }
  return [ingredient];
};