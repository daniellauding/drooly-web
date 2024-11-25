import axios from 'axios';
import * as cheerio from 'cheerio';
import { Recipe } from '@/types/recipe';
import { parseIngredients } from './scraper/ingredientParser';
import { parseInstructions } from './scraper/instructionParser';

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
          
          // Extract images
          const images = recipeSchema.image ? 
            (Array.isArray(recipeSchema.image) ? recipeSchema.image : [recipeSchema.image])
            : [];
            
          scrapedData = {
            title: recipeSchema.name,
            description: recipeSchema.description,
            ingredients: parseIngredients(recipeSchema.recipeIngredient || []),
            steps: parseInstructions(
              Array.isArray(recipeSchema.recipeInstructions)
                ? recipeSchema.recipeInstructions.map((i: any) => i.text || i)
                : [recipeSchema.recipeInstructions]
            ),
            totalTime: recipeSchema.totalTime || recipeSchema.cookTime || "",
            servings: {
              amount: parseInt(recipeSchema.recipeYield) || 4,
              unit: 'serving'
            },
            images
          };
        }
      } catch (error) {
        console.error('Error parsing JSON-LD:', error);
      }
    }

    // If no schema or missing data, try site-specific extraction
    if (!scrapedData.ingredients?.length) {
      console.log('Falling back to HTML pattern matching');
      
      // Extract ingredients from common selectors
      const rawIngredients = $('.ingredients li, .recipe-ingredients li').map((_, el) => $(el).text().trim()).get();
      
      // Extract instructions from common selectors
      const rawInstructions = $('.instructions li, .recipe-instructions li').map((_, el) => $(el).text().trim()).get();
      
      // Extract images if none were found in schema
      const images = !scrapedData.images?.length ? extractImages($) : scrapedData.images;
      
      scrapedData = {
        ...scrapedData,
        title: scrapedData.title || $('h1').first().text().trim(),
        description: scrapedData.description || $('meta[name="description"]').attr('content'),
        ingredients: parseIngredients(rawIngredients),
        steps: parseInstructions(rawInstructions),
        images
      };
    }

    console.log('Scraped recipe data:', scrapedData);
    return {
      ...scrapedData,
      source: 'scrape',
      sourceUrl: url,
      privacy: 'public' as const,
      servings: scrapedData.servings || { amount: 4, unit: 'serving' }
    };
  } catch (error) {
    console.error('Error scraping recipe:', error);
    throw new Error(
      'Could not extract recipe details. The website might be blocking our requests, ' +
      'or the recipe format is not recognized. Please try entering the details manually.'
    );
  }
}

const extractImages = ($: cheerio.CheerioAPI): string[] => {
  const images: string[] = [];
  
  // Try multiple selectors for recipe images
  const imageSelectors = [
    '.recipe-image img',
    '.entry-content img',
    'article img',
    '.post-content img',
    'img.recipe-image',
    // Add more selectors as needed
  ];

  imageSelectors.forEach(selector => {
    $(selector).each((_, el) => {
      const src = $(el).attr('src');
      if (src && !src.includes('avatar') && !src.includes('logo')) {
        images.push(src);
      }
    });
  });

  return images;
};

export async function importFromTrello(cardId: string): Promise<Partial<Recipe>> {
  console.log("Importing recipe from Trello card:", cardId);
  return {
    title: "Recipe from Trello",
    description: "Imported from Trello card",
    tags: ["trello-import"],
    privacy: 'public' as const
  };
}