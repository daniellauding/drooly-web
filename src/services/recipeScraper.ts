import axios from 'axios';
import * as cheerio from 'cheerio';
import { Recipe } from '@/types/recipe';

interface ScrapedRecipe {
  title?: string;
  description?: string;
  ingredients?: string[];
  instructions?: string[];
  cookingTime?: string;
  servings?: {
    amount: number;
    unit: string;
  };
}

export async function scrapeRecipe(url: string): Promise<Partial<Recipe>> {
  console.log('Starting recipe scrape for URL:', url);
  
  try {
    // Use a CORS proxy to bypass CORS restrictions
    const corsProxy = 'https://corsproxy.io/?';
    const response = await axios.get(`${corsProxy}${encodeURIComponent(url)}`);
    const html = response.data;
    
    // Load HTML into cheerio
    const $ = cheerio.load(html);
    
    // Try to find JSON-LD schema first (most reliable)
    const jsonLd = $('script[type="application/ld+json"]').text();
    let scrapedData: ScrapedRecipe = {};
    
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
            ingredients: recipeSchema.recipeIngredient,
            instructions: Array.isArray(recipeSchema.recipeInstructions) 
              ? recipeSchema.recipeInstructions.map((i: any) => i.text || i)
              : [recipeSchema.recipeInstructions],
            cookingTime: recipeSchema.totalTime || recipeSchema.cookTime,
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
      scrapedData = {
        title: $('h1').first().text().trim(),
        description: $('meta[name="description"]').attr('content'),
        ingredients: $('.ingredients li, .recipe-ingredients li').map((_, el) => $(el).text().trim()).get(),
        instructions: $('.instructions li, .recipe-instructions li').map((_, el) => $(el).text().trim()).get(),
        servings: {
          amount: 4,
          unit: 'serving'
        }
      };
    }

    if (!scrapedData.title) {
      throw new Error('Could not extract recipe details');
    }

    console.log('Successfully scraped recipe:', scrapedData);

    return {
      title: scrapedData.title || "",
      description: scrapedData.description || "",
      ingredients: scrapedData.ingredients?.map(ing => ({
        name: ing,
        amount: "",
        unit: "",
        group: "main"
      })) || [],
      steps: scrapedData.instructions?.map(instruction => ({
        title: "Step",
        instructions: instruction,
        duration: "",
        media: []
      })) || [],
      totalTime: scrapedData.cookingTime || "",
      servings: scrapedData.servings || { amount: 4, unit: 'serving' },
      source: 'scrape'
    };
  } catch (error) {
    console.error('Error scraping recipe:', error);
    throw new Error(
      'Could not extract recipe details. The website might be blocking our requests, ' +
      'or the recipe format is not recognized. Please try entering the details manually.'
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