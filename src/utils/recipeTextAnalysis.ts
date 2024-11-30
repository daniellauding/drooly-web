import { Recipe } from "@/types/recipe";
import { Timestamp } from "firebase/firestore";

const SWEDISH_UNITS = {
  'msk': 'tablespoon',
  'tsk': 'teaspoon',
  'dl': 'deciliter',
  'st': 'piece',
  'krm': 'pinch',
  'burk': 'can',
  'port': 'serving',
  'ml': 'ml',
  'g': 'gram',
  'kg': 'kilogram',
  'l': 'liter'
};

const cleanText = (text: string): string => {
  return text
    .replace(/[^\w\s,.()/-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

const extractIngredients = (text: string): { name: string; amount: string; unit: string; group: string; }[] => {
  console.log("Extracting ingredients from:", text);
  
  const lines = text.split('\n');
  const ingredients = lines
    .filter(line => {
      const hasNumbers = /\d/.test(line);
      const hasUnits = new RegExp(`\\b(${Object.keys(SWEDISH_UNITS).join('|')})\\b`, 'i').test(line);
      return hasNumbers || hasUnits;
    })
    .map(line => {
      const match = line.match(/^(\d+(?:[,.]\d+)?)\s*([a-zA-Z]+)?\s*(.+)/);
      
      if (match) {
        const [_, amount, unit, name] = match;
        const normalizedUnit = SWEDISH_UNITS[unit?.toLowerCase() as keyof typeof SWEDISH_UNITS] || unit || 'piece';
        
        return {
          name: name.trim(),
          amount: amount,
          unit: normalizedUnit,
          group: "Main Ingredients"
        };
      }
      
      return {
        name: line.trim(),
        amount: "1",
        unit: "piece",
        group: "Main Ingredients"
      };
    });

  console.log("Extracted ingredients:", ingredients);
  return ingredients;
};

const extractSteps = (text: string): { title: string; instructions: string; duration: string; media: string[]; }[] => {
  console.log("Extracting steps from:", text);
  
  const instructionsSection = text.toLowerCase().indexOf('sa har gor du') !== -1 
    ? text.slice(text.toLowerCase().indexOf('sa har gor du'))
    : text;

  const steps = instructionsSection
    .split(/\d+\.|[\n.]+/)
    .map(step => step.trim())
    .filter(step => step.length > 10)
    .map((step, index) => ({
      title: `Step ${index + 1}`,
      instructions: step,
      duration: step.match(/(\d+)(?:\s*-\s*\d+)?\s*min/)?.[1] + ' min' || '',
      media: []
    }));

  console.log("Extracted steps:", steps);
  return steps;
};

export const analyzeRecipeText = async (text: string): Promise<Partial<Recipe>> => {
  console.log("Analyzing recipe text:", text);
  
  const cleanedText = cleanText(text);
  const lines = cleanedText.split('\n').map(line => line.trim());
  
  // Extract title - usually the first non-empty line
  const title = lines.find(line => line.length > 0) || "Untitled Recipe";
  
  // Extract servings
  const servingsMatch = text.match(/(\d+)\s*personer/);
  const servings = {
    amount: parseInt(servingsMatch?.[1] || "4"),
    unit: "servings"
  };

  // Extract description - usually the text before ingredients
  const description = lines.slice(1, 3).join(' ').trim();

  const ingredients = extractIngredients(text);
  const steps = extractSteps(text);

  const recipe: Partial<Recipe> = {
    title,
    description,
    ingredients,
    steps,
    servings,
    difficulty: "Medium",
    cuisine: text.toLowerCase().includes('curry') ? 'Thai' : 'Swedish',
    totalTime: steps.reduce((total, step) => {
      const duration = parseInt(step.duration) || 0;
      return total + duration;
    }, 0) + ' minutes',
    images: [],
    featuredImageIndex: 0,
    status: 'draft' as const,
    privacy: 'public' as const,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    cookingMethods: [],
    dishTypes: [],
    equipment: [],
    categories: [],
    tags: []
  };

  console.log("Analyzed recipe:", recipe);
  return recipe;
};