import axios from 'axios';
import * as cheerio from 'cheerio';
import { Recipe } from '@/types/recipe';

const cleanIngredients = (ingredients: any[]) => {
  // Remove duplicates by comparing name+amount+unit
  const seen = new Set();
  return ingredients
    .filter(ing => {
      const key = `${ing.name}-${ing.amount}-${ing.unit}`;
      const isDuplicate = seen.has(key);
      seen.add(key);
      return !isDuplicate;
    })
    // Remove ingredients that are actually instructions (longer than 100 chars)
    .filter(ing => ing.name.length < 100)
    // Clean up whitespace and newlines
    .map(ing => ({
      ...ing,
      name: ing.name.replace(/\s+/g, ' ').trim(),
      amount: ing.amount.trim(),
      unit: ing.unit.trim()
    }));
};

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

const extractSwedishRecipe = ($: cheerio.CheerioAPI) => {
  console.log('Attempting to extract Swedish recipe');
  
  // Extract title - try multiple selectors
  const title = 
    $('h1.entry-title').first().text().trim() || 
    $('h1').first().text().trim() ||
    $('.recipe-title').first().text().trim();
  
  // Extract description - try multiple approaches
  const description = 
    $('.entry-content p').first().text().trim() ||
    $('meta[name="description"]').attr('content') ||
    $('.recipe-description').text().trim();
  
  // Extract ingredients more aggressively
  const ingredients = [];
  
  // Try multiple common ingredient selectors
  const ingredientSelectors = [
    '.ingredients li',
    '.recipe-ingredients li',
    '.entry-content ul li',
    '.entry-content p',
    'ul li'
  ];

  ingredientSelectors.forEach(selector => {
    $(selector).each((_, el) => {
      const text = $(el).text().trim();
      
      // Only add if it looks like an ingredient (contains numbers or common units)
      if (text && (
        /\d+/.test(text) || 
        /\b(g|kg|ml|l|dl|msk|tsk|st|burk)\b/i.test(text)
      )) {
        // Try to parse amount, unit, and name
        const match = text.match(/^(\d+(?:[,.]\d+)?)\s*(g|kg|ml|l|dl|msk|tsk|st|burk)?\s*(.+)/i);
        if (match) {
          ingredients.push({
            name: match[3].trim(),
            amount: match[1].trim(),
            unit: (match[2] || "").trim(),
            group: "main"
          });
        } else {
          // If parsing fails, just add as name
          ingredients.push({
            name: text,
            amount: "",
            unit: "",
            group: "main"
          });
        }
      }
    });
  });

  // Extract instructions by looking for common patterns
  const instructions = [];
  let foundInstructions = false;
  
  $('.entry-content p, .entry-content div').each((_, el) => {
    const text = $(el).text().trim();
    
    // Look for instruction section markers
    if (text.toLowerCase().includes('gör så här') || 
        text.toLowerCase().includes('instruktioner') ||
        text.toLowerCase().includes('tillagning')) {
      foundInstructions = true;
      return;
    }
    
    if (foundInstructions && text.length > 10) {
      instructions.push({
        title: "Step",
        instructions: text,
        duration: "",
        media: []
      });
    }
  });

  // Try to detect cuisine type
  let cuisine = "";
  if (title.toLowerCase().includes('indisk') || description.toLowerCase().includes('indisk')) {
    cuisine = "indian";
  } else if (title.toLowerCase().includes('thai') || description.toLowerCase().includes('thai')) {
    cuisine = "thai";
  }
  // Add more cuisine detection as needed

  // Try to extract cooking methods
  const cookingMethods = [];
  const methodKeywords = ['koka', 'stek', 'fritera', 'baka', 'grilla', 'woka'];
  methodKeywords.forEach(method => {
    if (description.toLowerCase().includes(method)) {
      cookingMethods.push(method);
    }
  });

  // Try to extract equipment
  const equipment = [];
  const equipmentKeywords = ['gryta', 'panna', 'wok', 'ugn', 'form'];
  equipmentKeywords.forEach(item => {
    if (description.toLowerCase().includes(item)) {
      equipment.push(item);
    }
  });

  return {
    title,
    description,
    ingredients,
    steps: instructions,
    cuisine,
    cookingMethods,
    equipment
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
            },
            images: recipeSchema.image ? 
              (Array.isArray(recipeSchema.image) ? recipeSchema.image : [recipeSchema.image])
              : []
          };
        }
      } catch (error) {
        console.error('Error parsing JSON-LD:', error);
      }
    }

    // If no schema or missing data, try site-specific extraction
    if (!scrapedData.ingredients?.length) {
      console.log('Falling back to site-specific extraction');
      const swedishData = extractSwedishRecipe($);
      scrapedData = {
        ...scrapedData,
        ...swedishData
      };
    }

    // Extract images if none were found in schema
    if (!scrapedData.images?.length) {
      scrapedData.images = extractImages($);
    }

    // Clean up the data
    if (scrapedData.ingredients) {
      scrapedData.ingredients = cleanIngredients(scrapedData.ingredients);
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
    return {
      title: "",
      description: "",
      ingredients: [],
      steps: [],
      source: 'scrape',
      sourceUrl: url,
      privacy: 'public' as const,
      servings: { amount: 4, unit: 'serving' }
    };
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
