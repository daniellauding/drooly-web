import { useEffect, useRef } from "react";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Recipe } from "@/types/recipe";
import { CUISINES } from "@/types/recipe";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

mapboxgl.accessToken = 'pk.eyJ1IjoiZGFuaWVsbGF1ZGluZyIsImEiOiJjbTQ2MHJlaGUwYnNzMm1yNnRxc2RhajlqIn0.1LXl5jCB3XJIdo4XBHvKkg';

const CUISINE_COORDINATES: Record<string, [number, number]> = {
  'italian': [12.4964, 41.9028],
  'french': [2.3522, 48.8566],
  'japanese': [139.6503, 35.6762],
  'chinese': [116.4074, 39.9042],
  'thai': [100.5018, 13.7563],
  'indian': [77.1025, 28.7041],
  'mexican': [-99.1332, 19.4326],
  'greek': [23.7275, 37.9838],
  'spanish': [-3.7038, 40.4168],
  'vietnamese': [105.8542, 21.0285],
  'korean': [126.9780, 37.5665],
  'turkish': [32.8597, 39.9334],
  'lebanese': [35.5018, 33.8938],
  'moroccan': [-6.8498, 34.0209],
  'brazilian': [-47.8645, -15.7942],
  'american': [-98.5795, 39.8283],
  'mediterranean': [14.4378, 35.9375],
  'middle eastern': [39.1947, 30.5852],
  'caribbean': [-75.0148, 18.7357],
  'ethiopian': [38.7578, 9.0320],
  'german': [13.4050, 52.5200],
  'swedish': [18.0686, 59.3293],  // Added Swedish coordinates
};

interface CuisineMapDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipes: Recipe[];
}

const normalizeCuisineName = (cuisine: string): string => {
  return cuisine.toLowerCase().trim();
};

export function CuisineMapDialog({ open, onOpenChange, recipes }: CuisineMapDialogProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  const showRecipeCuisines = () => {
    console.group("Recipe Cuisines Analysis");
    console.log("Raw recipes array:", recipes);
    console.log("Total recipes:", recipes.length);
    
    // Log each recipe's raw data
    recipes.forEach((recipe, index) => {
      console.log(`Recipe ${index + 1} - ${recipe.title}:`, {
        rawCuisine: recipe.cuisine,
        type: typeof recipe.cuisine,
        hasValue: Boolean(recipe.cuisine),
        fullRecipe: recipe
      });
    });
    
    const recipesWithCuisine = recipes.filter(recipe => {
      const hasCuisine = Boolean(recipe.cuisine);
      console.log(`Recipe "${recipe.title}" has cuisine:`, hasCuisine, "Value:", recipe.cuisine);
      return hasCuisine;
    });
    
    console.log("Recipes with cuisine:", recipesWithCuisine.length);
    console.log("Recipes with cuisine details:", recipesWithCuisine);

    // Group by cuisine
    const cuisineGroups = recipesWithCuisine.reduce((acc, recipe) => {
      const cuisine = recipe.cuisine?.toLowerCase().trim() || 'unknown';
      if (!acc[cuisine]) {
        acc[cuisine] = [];
      }
      acc[cuisine].push({
        title: recipe.title,
        originalCuisine: recipe.cuisine,
        normalizedCuisine: cuisine,
        hasCoordinates: !!CUISINE_COORDINATES[cuisine]
      });
      return acc;
    }, {} as Record<string, any[]>);

    console.log("Cuisine Groups:", cuisineGroups);
    console.log("Available cuisine coordinates:", Object.keys(CUISINE_COORDINATES));
    console.groupEnd();
  };

  useEffect(() => {
    if (!open || !mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [0, 20],
      zoom: 1.5
    });

    // Group recipes by cuisine
    const recipeByCuisine = recipes.reduce((acc, recipe) => {
      if (recipe.cuisine) {
        const cuisineKey = normalizeCuisineName(recipe.cuisine);
        console.log(`Processing recipe "${recipe.title}" with cuisine "${recipe.cuisine}" (normalized: "${cuisineKey}")`);
        if (!acc[cuisineKey]) {
          acc[cuisineKey] = [];
        }
        acc[cuisineKey].push(recipe);
      }
      return acc;
    }, {} as Record<string, Recipe[]>);

    // Add markers for each cuisine that has recipes
    Object.entries(recipeByCuisine).forEach(([cuisine, cuisineRecipes]) => {
      const coordinates = CUISINE_COORDINATES[cuisine];
      
      if (!coordinates) {
        console.warn(`No coordinates found for cuisine: ${cuisine}`);
        return;
      }

      console.log(`Adding marker for ${cuisine} with ${cuisineRecipes.length} recipes`);

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div class="p-2">
          <h3 class="font-bold text-base capitalize">${cuisine} Cuisine</h3>
          <p class="text-sm text-gray-600">${cuisineRecipes.length} recipes</p>
          <ul class="mt-2 space-y-1">
            ${cuisineRecipes.slice(0, 3).map(recipe => `
              <li class="text-sm">
                <a href="/recipe/${recipe.id}" class="text-blue-600 hover:underline">
                  ${recipe.title}
                </a>
              </li>
            `).join('')}
            ${cuisineRecipes.length > 3 ? `
              <li class="text-sm text-gray-500">
                +${cuisineRecipes.length - 3} more recipes
              </li>
            ` : ''}
          </ul>
        </div>
      `);

      const marker = new mapboxgl.Marker({
        color: "#FF5A5F",
        scale: 0.8
      })
        .setLngLat(coordinates)
        .setPopup(popup)
        .addTo(map.current!);

      const markerElement = marker.getElement();
      markerElement.style.transition = 'transform 0.2s ease';
      markerElement.addEventListener('mouseenter', () => {
        markerElement.style.transform = 'scale(1.2)';
      });
      markerElement.addEventListener('mouseleave', () => {
        markerElement.style.transform = 'scale(1)';
      });
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [open, recipes]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px]">
        <DialogTitle className="text-xl font-semibold mb-4">
          Explore Cuisines Around the World
        </DialogTitle>
        <DialogDescription className="text-sm text-muted-foreground mb-4">
          Discover recipes from different cuisines. Click on the markers to see available recipes from each region.
        </DialogDescription>
        
        <div className="mb-4 space-y-4">
          <Button 
            variant="outline" 
            onClick={showRecipeCuisines}
            className="w-full"
          >
            Debug Cuisine Data
          </Button>

          <ScrollArea className="h-[200px] border rounded-md p-4">
            <div className="space-y-2">
              <h3 className="font-medium">Raw Cuisine Values from Firebase:</h3>
              {recipes.map((recipe, index) => (
                <div key={recipe.id} className="text-sm">
                  <span className="font-medium">{recipe.title}</span>: {recipe.cuisine || 'No cuisine set'}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div ref={mapContainer} className="w-full h-[600px] rounded-lg" />
      </DialogContent>
    </Dialog>
  );
}