import { Recipe } from "@/types/recipe";

export async function scrapeRecipe(url: string): Promise<Partial<Recipe>> {
  console.log("Attempting to scrape recipe from URL:", url);
  
  try {
    // Extract domain from URL
    const domain = new URL(url).hostname;
    console.log("Scraping from domain:", domain);

    // Call backend scraping service
    const response = await fetch('/api/scrape-recipe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url })
    });

    if (!response.ok) {
      throw new Error('Failed to scrape recipe');
    }

    const data = await response.json();
    console.log("Scraped recipe data:", data);

    return {
      title: data.title || "",
      description: data.description || "",
      cuisine: data.cuisine || "",
      ingredients: data.ingredients?.map((ing: string) => ({
        name: ing,
        amount: "",
        unit: ""
      })) || [],
      steps: data.instructions?.map((instruction: string) => ({
        title: "Step",
        instructions: instruction,
        duration: "",
        media: []
      })) || [],
      source: 'scrape'
    };
  } catch (error) {
    console.error("Error scraping recipe:", error);
    throw new Error("Could not extract recipe details. The website might not be supported yet or the format might have changed. Please try entering the details manually.");
  }
}

export async function importFromTrello(cardId: string): Promise<Partial<Recipe>> {
  console.log("Importing recipe from Trello card:", cardId);
  
  try {
    // This would integrate with Trello's API
    // For now, we'll return a mock response
    return {
      title: "Recipe from Trello",
      description: "Imported from Trello card",
      tags: ["trello-import"]
    };
  } catch (error) {
    console.error("Error importing from Trello:", error);
    throw error;
  }
}