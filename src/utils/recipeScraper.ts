import axios from 'axios';
import * as cheerio from 'cheerio';
import { Recipe } from '@/types/recipe';

const extractSwedishRecipe = ($: cheerio.CheerioAPI) => {
  console.log('Attempting to extract Swedish recipe');
  
  // Extract description from the top text
  const description = $('.entry-content p').first().text().trim();
  
  // Extract ingredients
  const ingredients = $('.entry-content')
    .find('h2:contains("Ingredienser")')
    .next('ul')
    .find('li')
    .map((_, el) => ({
      name: $(el).text().trim(),
      amount: "",
      unit: "",
      group: "main"
    }))
    .get();

  // Extract instructions
  const instructions = $('.entry-content')
    .find('h2:contains("Instruktioner")')
    .nextAll('p')
    .map((_, el) => ({
      title: "Step",
      instructions: $(el).text().trim(),
      duration: "",
      media: []
    }))
    .get()
    .filter(step => step.instructions.length > 0);

  return {
    description,
    ingredients,
    steps: instructions
  };
};

export async function scrapeRecipe(url: string): Promise<Partial<Recipe>> {
  console.log('Starting recipe scrape for URL:', url);
  
  try {
    const corsProxy = 'https://corsproxy.io/?';
    const response = await axios.get(`${corsProxy}${encodeURIComponent(url)}`);
    const html = response.data;
    const $ = cheerio.load(html);
    
    // Try to find JSON-LD schema first
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
              group: "main"
            })) || [],
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
            }
          };
        }
      } catch (error) {
        console.error('Error parsing JSON-LD:', error);
      }
    }

    // If no schema or missing data, try site-specific extraction
    if (!scrapedData.ingredients?.length) {
      console.log('Falling back to site-specific extraction');
      
      if (url.includes('godastmat.se')) {
        const swedishData = extractSwedishRecipe($);
        scrapedData = {
          ...scrapedData,
          ...swedishData,
          title: scrapedData.title || $('h1.entry-title').first().text().trim()
        };
      }
      // Add other site-specific handlers here
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
      'Could not extract recipe details. Please try entering the details manually.'
    );
  }
}

export async function importFromTrello(cardId: string): Promise<Partial<Recipe>> {
  console.log("Importing recipe from Trello card:", cardId);
  return {
    title: "Recipe from Trello",
    description: "Imported from Trello card",
    tags: ["trello-import"],
    privacy: 'public' as const
  };
}