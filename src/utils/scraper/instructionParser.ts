import { RecipeStep } from "@/types/recipe";

const cleanInstructionText = (text: string): string => {
  return text
    .replace(/\s+/g, ' ')
    .replace(/\n/g, ' ')
    .replace(/\t/g, ' ')
    .trim();
};

export const parseInstructions = (rawInstructions: string[]): RecipeStep[] => {
  console.log('Parsing instructions:', rawInstructions);
  
  // Filter out empty or duplicate instructions
  const uniqueInstructions = [...new Set(
    rawInstructions
      .map(cleanInstructionText)
      .filter(text => text.length > 0)
  )];

  return uniqueInstructions.map(instruction => ({
    title: "Step",
    instructions: instruction,
    duration: "",
    media: []
  }));
};