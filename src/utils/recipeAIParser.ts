import { Recipe } from "@/types/recipe";

export const parseAIResponse = (aiResponse: string): Partial<Recipe> => {
  console.log("Parsing AI response:", aiResponse);

  // Extract title (after "Enhanced Recipe:" or from the first heading)
  const titleMatch = aiResponse.match(/Enhanced Recipe: (.*?)(\n|$)/) || 
                    aiResponse.match(/# (.*?)(\n|$)/);
  const title = titleMatch ? titleMatch[1].trim() : "";

  // Extract description (between Description: and the next section)
  const descriptionMatch = aiResponse.match(/\*\*Description:\*\* (.*?)(\n|$)/);
  const description = descriptionMatch ? descriptionMatch[1].trim() : "";

  // Extract ingredients
  const ingredientsSection = aiResponse.match(/#### Ingredients:([\s\S]*?)(?=####|$)/);
  const ingredients = ingredientsSection ? ingredientsSection[1]
    .split('\n')
    .filter(line => line.trim().startsWith('-'))
    .map(line => {
      const cleanLine = line.replace(/^-\s*\*\*/, '').replace(/\*\*/, '');
      const matches = cleanLine.match(/([\d.]+)\s*(cup|tablespoon|teaspoon|clove|large|small|pieces?)\s+(.+?)(?:\(|$)/i);
      
      if (matches) {
        return {
          amount: matches[1],
          unit: matches[2].toLowerCase(),
          name: matches[3].trim(),
          group: "Main Ingredients"
        };
      }

      // Fallback for ingredients without clear measurements
      const namePart = cleanLine.trim();
      return {
        amount: "1",
        unit: "piece",
        name: namePart,
        group: "Main Ingredients"
      };
    }) : [];

  // Extract steps
  const stepsSection = aiResponse.match(/#### Steps:([\s\S]*?)(?=###|$)/);
  const steps = stepsSection ? stepsSection[1]
    .split('\n')
    .filter(line => /^\d+\./.test(line.trim()))
    .map(line => {
      const stepText = line.replace(/^\d+\.\s*\*\*/, '').replace(/\*\*:?\s*/, '');
      return {
        title: `Step ${steps.length + 1}`,
        instructions: stepText.trim(),
        duration: "",
        media: []
      };
    }) : [];

  // Try to determine cuisine from title or content
  let cuisine = "";
  if (aiResponse.toLowerCase().includes("bangkok") || aiResponse.toLowerCase().includes("thai")) {
    cuisine = "thai";
  } else if (aiResponse.toLowerCase().includes("chinese")) {
    cuisine = "chinese";
  }
  // Add more cuisine detection rules as needed

  return {
    title,
    description,
    ingredients,
    steps,
    cuisine,
    difficulty: "Medium", // Default value
    totalTime: "30", // Default value
    servings: {
      amount: 4,
      unit: "serving"
    }
  };
};