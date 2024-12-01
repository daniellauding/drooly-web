import { useEffect, useRef } from "react";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Recipe } from "@/types/recipe";
import { CuisineDebugPanel } from "./map/CuisineDebugPanel";
import { CUISINE_COORDINATES, normalizeCuisineName } from "./map/cuisineCoordinates";
import { createCuisineMapMarker } from "./map/CuisineMapMarker";

mapboxgl.accessToken = 'pk.eyJ1IjoiZGFuaWVsbGF1ZGluZyIsImEiOiJjbTQ2MHJlaGUwYnNzMm1yNnRxc2RhajlqIn0.1LXl5jCB3XJIdo4XBHvKkg';

interface CuisineMapDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipes: Recipe[];
}

export function CuisineMapDialog({ open, onOpenChange, recipes }: CuisineMapDialogProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  const showRecipeCuisines = () => {
    console.group("Recipe Cuisines Analysis");
    console.log("Raw recipes array:", recipes);
    console.log("Total recipes:", recipes.length);
    
    recipes.forEach((recipe, index) => {
      console.log(`Recipe ${index + 1} - ${recipe.title}:`, {
        rawCuisine: recipe.cuisine,
        normalizedCuisine: recipe.cuisine?.toLowerCase().trim(),
        hasCoordinates: !!CUISINE_COORDINATES[recipe.cuisine?.toLowerCase().trim() || ''],
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

      createCuisineMapMarker({
        cuisine,
        coordinates,
        recipes: cuisineRecipes,
        map: map.current!
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
        
        <CuisineDebugPanel 
          recipes={recipes}
          onDebug={showRecipeCuisines}
        />

        <div ref={mapContainer} className="w-full h-[600px] rounded-lg" />
      </DialogContent>
    </Dialog>
  );
}