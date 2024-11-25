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
        const schemas = Array.isArray(JSON.parse(jsonLd)) ? JSON.parse(jsonLd) : [JSON.parse(jsonLd)];
        const recipeSchema = schemas.find(s => s['@type'] === 'Recipe');
        
        if (recipeSchema) {
          console.log('Found recipe schema:', recipeSchema);
          scrapedData = {
            title: recipeSchema.name,
            description: recipeSchema.description,
            ingredients: Array.isArray(recipeSchema.recipeIngredient) 
              ? recipeSchema.recipeIngredient.map((ing: string) => ({
                  name: ing,
                  amount: "",
                  unit: "",
                  group: "main"
                }))
              : [],
            steps: Array.isArray(recipeSchema.recipeInstructions)
              ? recipeSchema.recipeInstructions.map((instruction: any) => ({
                  title: "Step",
                  instructions: typeof instruction === 'string' ? instruction : instruction.text,
                  duration: "",
                  media: []
                }))
              : [],
            totalTime: recipeSchema.totalTime || recipeSchema.cookTime || "",
            servings: {
              amount: parseInt(recipeSchema.recipeYield) || 4,
              unit: 'serving'
            },
            images: recipeSchema.image ? (Array.isArray(recipeSchema.image) ? recipeSchema.image : [recipeSchema.image]) : [],
            source: 'scrape',
            sourceUrl: url,
            privacy: 'public' as const
          };
        }
      } catch (error) {
        console.error('Error parsing JSON-LD:', error);
      }
    }

    // If no schema or missing data, try site-specific selectors
    if (!scrapedData.title || !scrapedData.ingredients?.length) {
      console.log('Falling back to HTML pattern matching');
      
      // RecipeTin Eats specific selectors
      if (url.includes('recipetineats.com')) {
        scrapedData = {
          ...scrapedData,
          title: scrapedData.title || $('.wprm-recipe-name').first().text().trim(),
          description: scrapedData.description || $('.wprm-recipe-summary').first().text().trim(),
          ingredients: scrapedData.ingredients || $('.wprm-recipe-ingredient').map((_, el) => ({
            name: $(el).text().trim(),
            amount: "",
            unit: "",
            group: "main"
          })).get(),
          steps: scrapedData.steps || $('.wprm-recipe-instruction').map((_, el) => ({
            title: "Step",
            instructions: $(el).text().trim(),
            duration: "",
            media: []
          })).get()
        };
      }
      // Arla.se specific selectors
      else if (url.includes('arla.se')) {
        scrapedData = {
          ...scrapedData,
          title: scrapedData.title || $('h1').first().text().trim(),
          description: scrapedData.description || $('.recipe-description').first().text().trim(),
          ingredients: scrapedData.ingredients || $('.recipe-ingredients li').map((_, el) => ({
            name: $(el).text().trim(),
            amount: "",
            unit: "",
            group: "main"
          })).get(),
          steps: scrapedData.steps || $('.recipe-instructions li').map((_, el) => ({
            title: "Step",
            instructions: $(el).text().trim(),
            duration: "",
            media: []
          })).get()
        };
      }
      // Generic selectors as fallback
      else {
        scrapedData = {
          ...scrapedData,
          title: scrapedData.title || $('h1').first().text().trim(),
          description: scrapedData.description || $('meta[name="description"]').attr('content'),
          ingredients: scrapedData.ingredients || $('.ingredients li, .recipe-ingredients li').map((_, el) => ({
            name: $(el).text().trim(),
            amount: "",
            unit: "",
            group: "main"
          })).get(),
          steps: scrapedData.steps || $('.instructions li, .recipe-instructions li').map((_, el) => ({
            title: "Step",
            instructions: $(el).text().trim(),
            duration: "",
            media: []
          })).get()
        };
      }
    }

    if (!scrapedData.title) {
      throw new Error('Could not extract recipe details');
    }

    console.log('Successfully scraped recipe:', scrapedData);
    return {
      ...scrapedData,
      source: 'scrape',
      sourceUrl: url,
      privacy: 'public' as const
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
      tags: ["trello-import"],
      privacy: 'public' as const
    };
  } catch (error) {
    console.error("Error importing from Trello:", error);
    throw error;
  }
}