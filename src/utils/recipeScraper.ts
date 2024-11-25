import axios from 'axios';
import * as cheerio from 'cheerio';
import { Recipe } from "@/types/recipe";

export async function scrapeRecipe(url: string): Promise<Partial<Recipe>> {
  console.log("Attempting to scrape recipe from URL:", url);
  
  try {
    // Extract domain from URL
    const domain = new URL(url).hostname;
    console.log("Scraping from domain:", domain);

    // Use CORS proxy to fetch the page
    const corsProxy = 'https://corsproxy.io/?';
    const response = await axios.get(`${corsProxy}${encodeURIComponent(url)}`);
    const html = response.data;
    
    // Load HTML into cheerio
    const $ = cheerio.load(html);
    
    // Try to find JSON-LD schema first (most reliable)
    const jsonLd = $('script[type="application/ld+json"]').text();
    let scrapedData: any = {};
    
    if (jsonLd) {
      try {
        const schemas = JSON.parse(jsonLd);
        const recipeSchema = Array.isArray(schemas) 
          ? schemas.find((s: any) => s['@type'] === 'Recipe')
          : schemas['@type'] === 'Recipe' ? schemas : null;
        
        if (recipeSchema) {
          console.log('Found recipe schema:', recipeSchema);
          scrapedData = {
            title: recipeSchema.name,
            description: recipeSchema.description,
            ingredients: recipeSchema.recipeIngredient?.map((ing: string) => ({
              name: ing,
              amount: "",
              unit: "",
              group: "main"
            })),
            steps: recipeSchema.recipeInstructions?.map((instruction: any) => ({
              title: "Step",
              instructions: typeof instruction === 'string' ? instruction : instruction.text,
              duration: "",
              media: []
            })),
            totalTime: recipeSchema.totalTime || recipeSchema.cookTime,
            servings: {
              amount: parseInt(recipeSchema.recipeYield) || 4,
              unit: 'serving'
            }
          };
        }
      } catch (error) {
        console.error('Error parsing JSON-LD:', error);
      }
    }

    // If no schema found, fallback to HTML pattern matching
    if (!scrapedData.title) {
      console.log('Falling back to HTML pattern matching');
      const ingredients = $('.ingredients li, .recipe-ingredients li').map((_, el) => $(el).text().trim()).get();
      const instructions = $('.instructions li, .recipe-instructions li').map((_, el) => $(el).text().trim()).get();
      
      scrapedData = {
        title: $('h1').first().text().trim(),
        description: $('meta[name="description"]').attr('content'),
        ingredients: ingredients.map(ing => ({
          name: ing,
          amount: "",
          unit: "",
          group: "main"
        })),
        steps: instructions.map(instruction => ({
          title: "Step",
          instructions: instruction,
          duration: "",
          media: []
        })),
        servings: {
          amount: 4,
          unit: 'serving'
        }
      };
    }

    if (!scrapedData.title) {
      throw new Error("Could not extract recipe details");
    }

    console.log("Successfully scraped recipe:", scrapedData);
    return scrapedData;
  } catch (error) {
    console.error("Error scraping recipe:", error);
    throw new Error(
      "Could not extract recipe details. The website might not be supported yet or the format might have changed. Please try entering the details manually."
    );
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