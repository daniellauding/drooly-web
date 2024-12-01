import { useEffect, useRef } from "react";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Recipe } from "@/types/recipe";

// Initialize Mapbox token
mapboxgl.accessToken = 'pk.eyJ1IjoiZGFuaWVsbGF1ZGluZyIsImEiOiJjbTQ2MHJlaGUwYnNzMm1yNnRxc2RhajlqIn0.1LXl5jCB3XJIdo4XBHvKkg';

// Define cuisine coordinates with proper typing
const CUISINE_COORDINATES: Record<string, [number, number]> = {
  'italian': [12.4964, 41.9028], // Rome
  'french': [2.3522, 48.8566], // Paris
  'japanese': [139.6503, 35.6762], // Tokyo
  'chinese': [116.4074, 39.9042], // Beijing
  'thai': [100.5018, 13.7563], // Bangkok
  'indian': [77.1025, 28.7041], // New Delhi
  'mexican': [-99.1332, 19.4326], // Mexico City
  'greek': [23.7275, 37.9838], // Athens
  'spanish': [-3.7038, 40.4168], // Madrid
  'vietnamese': [105.8542, 21.0285], // Hanoi
  'korean': [126.9780, 37.5665], // Seoul
  'turkish': [32.8597, 39.9334], // Ankara
  'lebanese': [35.5018, 33.8938], // Beirut
  'moroccan': [-6.8498, 34.0209], // Rabat
  'brazilian': [-47.8645, -15.7942], // Brasília
  'american': [-98.5795, 39.8283], // USA center
  'mediterranean': [14.4378, 35.9375], // Mediterranean Sea
  'middle eastern': [39.1947, 30.5852], // Middle East region
  'caribbean': [-75.0148, 18.7357], // Caribbean Sea
  'ethiopian': [38.7578, 9.0320], // Addis Ababa
  'german': [13.4050, 52.5200], // Berlin
};

interface CuisineMapDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipes: Recipe[];
}

export function CuisineMapDialog({ open, onOpenChange, recipes }: CuisineMapDialogProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!open || !mapContainer.current) return;

    console.log("CuisineMapDialog - All recipes received:", recipes);
    console.log("CuisineMapDialog - Recipes with cuisines:", recipes.filter(r => r.cuisine));
    
    // Log each recipe's cuisine
    recipes.forEach(recipe => {
      console.log(`Recipe "${recipe.title}" - Cuisine: ${recipe.cuisine || 'No cuisine specified'}`);
    });

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [0, 20],
      zoom: 1.5
    });

    // Group recipes by cuisine (case-insensitive)
    const groupedRecipes = recipes.reduce((acc, recipe) => {
      if (recipe.cuisine) {
        const cuisineKey = recipe.cuisine.toLowerCase().trim();
        console.log(`Adding recipe "${recipe.title}" to cuisine group: ${cuisineKey}`);
        if (!acc[cuisineKey]) {
          acc[cuisineKey] = [];
        }
        acc[cuisineKey].push(recipe);
      } else {
        console.log(`Recipe "${recipe.title}" has no cuisine specified`);
      }
      return acc;
    }, {} as Record<string, Recipe[]>);

    console.log("CuisineMapDialog - Grouped recipes by cuisine:", groupedRecipes);
    console.log("CuisineMapDialog - Available cuisine coordinates:", Object.keys(CUISINE_COORDINATES).map(cuisine => 
      `${cuisine} (${groupedRecipes[cuisine]?.length || 0} recipes)`
    ));

    // Add markers for each cuisine group
    Object.entries(groupedRecipes).forEach(([cuisine, cuisineRecipes]) => {
      const coordinates = CUISINE_COORDINATES[cuisine];
      if (!coordinates) {
        console.log(`No coordinates found for cuisine: ${cuisine}`);
        return;
      }

      console.log(`Adding marker for ${cuisine} with ${cuisineRecipes.length} recipes at coordinates:`, coordinates);

      // Create popup content
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

      // Create and add marker with hover effect
      const marker = new mapboxgl.Marker({
        color: "#FF5A5F",
        scale: 0.8
      })
        .setLngLat(coordinates)
        .setPopup(popup)
        .addTo(map.current!);

      // Add hover effect to marker element
      const markerElement = marker.getElement();
      markerElement.style.transition = 'transform 0.2s ease';
      markerElement.addEventListener('mouseenter', () => {
        markerElement.style.transform = 'scale(1.2)';
      });
      markerElement.addEventListener('mouseleave', () => {
        markerElement.style.transform = 'scale(1)';
      });
    });

    // Cleanup function
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
        <div ref={mapContainer} className="w-full h-[600px] rounded-lg" />
      </DialogContent>
    </Dialog>
  );
}