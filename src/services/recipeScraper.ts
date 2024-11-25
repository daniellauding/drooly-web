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

const extractTextFromElement = ($: cheerio.CheerioAPI, selectors: string[]): string => {
  for (const selector of selectors) {
    const element = $(selector);
    if (element.length) {
      return element.first().text().trim();
    }
  }
  return '';
};

const extractListItems = ($: cheerio.CheerioAPI, selectors: string[]): string[] => {
  for (const selector of selectors) {
    const elements = $(selector);
    if (elements.length) {
      return elements.map((_, el) => $(el).text().trim()).get().filter(text => text.length > 0);
    }
  }
  return [];
};

export async function scrapeRecipe(url: string): Promise<Partial<Recipe>> {
  console.log('Starting recipe scrape for URL:', url);
  
  try {
    const corsProxy = 'https://corsproxy.io/?';
    const response = await axios.get(`${corsProxy}${encodeURIComponent(url)}`);
    const html = response.data;
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

    // If no schema or missing data, fallback to HTML pattern matching
    if (!scrapedData.title || !scrapedData.ingredients?.length || !scrapedData.instructions?.length) {
      console.log('Falling back to HTML pattern matching');
      
      // Common selectors for different recipe sites
      const titleSelectors = ['h1', '.recipe-title', '.recipe-header h1', '[itemprop="name"]'];
      const descriptionSelectors = [
        'meta[name="description"]',
        '.recipe-description',
        '.recipe-ingress',
        '[itemprop="description"]',
        '.recipe-preamble'
      ];
      const ingredientSelectors = [
        '.ingredients li',
        '.recipe-ingredients li',
        '.ingredient-list li',
        '[itemprop="recipeIngredient"]',
        '.recipe-ingress li',
        '.entry-content ul li',
        '.ingredients-list li'
      ];
      const instructionSelectors = [
        '.instructions li',
        '.recipe-instructions li',
        '.recipe-steps li',
        '[itemprop="recipeInstructions"] li',
        '.method-steps li',
        '.entry-content ol li',
        '.preparation-steps li'
      ];

      const title = scrapedData.title || extractTextFromElement($, titleSelectors);
      const description = scrapedData.description || 
                         $('meta[name="description"]').attr('content') || 
                         extractTextFromElement($, descriptionSelectors);
      const ingredients = scrapedData.ingredients?.length ? 
                         scrapedData.ingredients : 
                         extractListItems($, ingredientSelectors);
      const instructions = scrapedData.instructions?.length ? 
                          scrapedData.instructions : 
                          extractListItems($, instructionSelectors);

      scrapedData = {
        ...scrapedData,
        title,
        description,
        ingredients,
        instructions
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
        amount: "1",
        unit: "piece",
        group: "main"
      })) || [],
      steps: scrapedData.instructions?.map((instruction, index) => ({
        title: `Step ${index + 1}`,
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