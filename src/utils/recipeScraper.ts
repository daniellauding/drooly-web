import axios from 'axios';
import * as cheerio from 'cheerio';
import { Recipe } from '@/types/recipe';

export async function scrapeRecipe(url: string): Promise<Partial<Recipe>> {
  console.log('Starting recipe scrape for URL:', url);
  
  try {
    const corsProxy = 'https://corsproxy.io/?';
    const response = await axios.get(`${corsProxy}${encodeURIComponent(url)}`);
    const html = response.data;
    const $ = cheerio.load(html);
    
    // Try to find JSON-LD schema first (most reliable)
    const jsonLd = $('script[type="application/ld+json"]').text();
    let scrapedData: Partial<Recipe> = {};
    
    if (jsonLd) {
      try {
        const schemas = JSON.parse(jsonLd);
        const recipeSchema = Array.isArray(schemas) 
          ? schemas.find(s => s['@type'] === 'Recipe')
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
              group: "Main Ingredients"
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
            },
            images: recipeSchema.image ? (Array.isArray(recipeSchema.image) ? recipeSchema.image : [recipeSchema.image]) : [],
            source: 'scrape',
            sourceUrl: url
          };
        }
      } catch (error) {
        console.error('Error parsing JSON-LD:', error);
      }
    }

    // If no schema or missing data, try HTML scraping
    if (!scrapedData.title) {
      console.log('Falling back to HTML pattern matching');
      
      // Title
      scrapedData.title = scrapedData.title || $('h1').first().text().trim();
      
      // Description
      scrapedData.description = scrapedData.description || 
        $('meta[name="description"]').attr('content') ||
        $('.recipe-description, .description').first().text().trim();
      
      // Ingredients
      const ingredients = $('.ingredients li, .recipe-ingredients li, .ingredienser li').map((_, el) => $(el).text().trim()).get();
      if (ingredients.length > 0) {
        scrapedData.ingredients = ingredients.map(ing => ({
          name: ing,
          amount: "",
          unit: "",
          group: "Main Ingredients"
        }));
      }
      
      // Instructions
      const instructions = $('.instructions li, .recipe-instructions li, .tillagning li').map((_, el) => $(el).text().trim()).get();
      if (instructions.length > 0) {
        scrapedData.steps = instructions.map(instruction => ({
          title: "Step",
          instructions: instruction,
          duration: "",
          media: []
        }));
      }

      // Images
      const images = $('img[class*="recipe"], .recipe-image img, .main-image img').map((_, el) => $(el).attr('src')).get();
      if (images.length > 0) {
        scrapedData.images = images.filter(img => img && !img.includes('placeholder'));
      }

      // Tags
      const tags = $('.tags a, .recipe-tags a').map((_, el) => $(el).text().trim()).get();
      if (tags.length > 0) {
        scrapedData.tags = tags;
      }

      scrapedData.source = 'scrape';
      scrapedData.sourceUrl = url;
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
      tags: ["trello-import"],
      source: "trello"
    };
  } catch (error) {
    console.error("Error importing from Trello:", error);
    throw error;
  }
}