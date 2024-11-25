import axios from 'axios';
import * as cheerio from 'cheerio';
import { Recipe } from "@/types/recipe";

export async function scrapeRecipe(url: string): Promise<Partial<Recipe>> {
  console.log("Attempting to scrape recipe from URL:", url);
  
  try {
    const domain = new URL(url).hostname;
    console.log("Scraping from domain:", domain);

    const corsProxy = 'https://corsproxy.io/?';
    const response = await axios.get(`${corsProxy}${encodeURIComponent(url)}`);
    const html = response.data;
    const $ = cheerio.load(html);
    
    // Try JSON-LD schema first
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
          scrapedData = extractFromSchema(recipeSchema);
        }
      } catch (error) {
        console.error('Error parsing JSON-LD:', error);
      }
    }

    // If no schema or missing data, try HTML scraping
    if (!scrapedData.title || !scrapedData.ingredients?.length) {
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
          group: "main"
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
    }

    if (!scrapedData.title) {
      throw new Error("Could not extract recipe details");
    }

    // Add source URL
    scrapedData.sourceUrl = url;

    console.log("Successfully scraped recipe:", scrapedData);
    return scrapedData;
  } catch (error) {
    console.error("Error scraping recipe:", error);
    throw new Error(
      "Could not extract recipe details. The website might not be supported yet or the format might have changed. Please try entering the details manually."
    );
  }
}

function extractFromSchema(schema: any): Partial<Recipe> {
  return {
    title: schema.name,
    description: schema.description,
    ingredients: schema.recipeIngredient?.map((ing: string) => ({
      name: ing,
      amount: "",
      unit: "",
      group: "main"
    })),
    steps: schema.recipeInstructions?.map((instruction: any) => ({
      title: "Step",
      instructions: typeof instruction === 'string' ? instruction : instruction.text,
      duration: "",
      media: []
    })),
    totalTime: schema.totalTime || schema.cookTime,
    servings: {
      amount: parseInt(schema.recipeYield) || 4,
      unit: 'serving'
    },
    images: schema.image ? (Array.isArray(schema.image) ? schema.image : [schema.image]) : []
  };
}