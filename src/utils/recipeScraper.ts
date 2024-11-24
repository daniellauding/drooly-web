import { Recipe } from "@/types/recipe";

export async function scrapeRecipe(url: string): Promise<Partial<Recipe>> {
  console.log("Attempting to scrape recipe from URL:", url);
  
  try {
    // Make request to our backend API that handles the actual scraping
    const response = await fetch("/api/scrape-recipe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      throw new Error("Failed to scrape recipe");
    }

    const data = await response.json();
    console.log("Scraped recipe data:", data);
    return data;
  } catch (error) {
    console.error("Error scraping recipe:", error);
    throw error;
  }
}