import { useEffect, useRef } from "react";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Recipe } from "@/types/recipe";
import { CUISINE_COORDINATES, normalizeCuisineName } from "./map/cuisineCoordinates";
import { createCuisineMapMarker } from "./map/CuisineMapMarker";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

// Set your Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoiZGFuaWVsbGF1ZGluZyIsImEiOiJjbTQ2MHJlaGUwYnNzMm1yNnRxc2RhajlqIn0.1LXl5jCB3XJIdo4XBHvKkg';

interface CuisineMapDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipes: Recipe[];
}

export function CuisineMapDialog({ open, onOpenChange, recipes }: CuisineMapDialogProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);

  console.log("[CuisineMapDialog] Dialog state:", { 
    open, 
    hasMapContainer: !!mapContainer.current,
    hasMap: !!map.current,
    recipesCount: recipes.length 
  });

  const resetMapView = () => {
    console.log("[CuisineMapDialog] Attempting to reset map view");
    if (map.current) {
      map.current.flyTo({
        center: [0, 20],
        zoom: 1.5,
        duration: 1500
      });
    }
  };

  useEffect(() => {
    console.log("[CuisineMapDialog] Effect triggered:", {
      open,
      hasContainer: !!mapContainer.current,
      existingMap: !!map.current
    });

    if (!open || !mapContainer.current) {
      console.log("[CuisineMapDialog] Skipping map initialization - dialog closed or no container");
      return;
    }

    // Clean up existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Initialize map if it doesn't exist
    if (!map.current) {
      console.log("[CuisineMapDialog] Creating new map instance");
      try {
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/light-v11',
          center: [0, 20],
          zoom: 1.5,
          minZoom: 1,
          maxZoom: 12
        });

        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
        console.log("[CuisineMapDialog] Map instance created successfully");
      } catch (error) {
        console.error("[CuisineMapDialog] Error creating map instance:", error);
        return;
      }
    }

    // Wait for map to load before adding markers
    const currentMap = map.current;
    currentMap.on('load', () => {
      console.log("[CuisineMapDialog] Map loaded, creating markers");
      
      // Group recipes by cuisine
      const recipeByCuisine = recipes.reduce((acc, recipe) => {
        if (recipe.cuisine) {
          const cuisineKey = normalizeCuisineName(recipe.cuisine);
          if (!acc[cuisineKey]) {
            acc[cuisineKey] = [];
          }
          acc[cuisineKey].push(recipe);
        }
        return acc;
      }, {} as Record<string, Recipe[]>);

      console.log("[CuisineMapDialog] Grouped recipes:", {
        totalRecipes: recipes.length,
        cuisineGroups: Object.keys(recipeByCuisine).length
      });

      // Create markers for each cuisine group
      Object.entries(recipeByCuisine).forEach(([cuisine, cuisineRecipes]) => {
        const coordinates = CUISINE_COORDINATES[cuisine];
        if (!coordinates) {
          console.warn(`[CuisineMapDialog] No coordinates found for cuisine: ${cuisine}`);
          return;
        }

        try {
          const marker = createCuisineMapMarker({
            cuisine,
            coordinates,
            recipes: cuisineRecipes,
            map: currentMap
          });
          markers.current.push(marker);
        } catch (error) {
          console.error(`[CuisineMapDialog] Error creating marker for ${cuisine}:`, error);
        }
      });
    });

    // Cleanup function
    return () => {
      console.log("[CuisineMapDialog] Cleaning up");
      markers.current.forEach(marker => marker.remove());
      markers.current = [];
    };
  }, [open, recipes]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] h-[80vh] overflow-hidden">
        <DialogTitle className="text-xl font-semibold mb-2">
          Explore Cuisines Around the World
        </DialogTitle>
        <DialogDescription className="text-sm text-muted-foreground mb-4">
          Click on markers to zoom in and see recipes from each region. Use the home button to reset the view.
        </DialogDescription>
        
        <div className="relative flex-1 h-[calc(100%-100px)]">
          <Button
            variant="outline"
            size="sm"
            className="absolute top-2 left-2 z-10"
            onClick={resetMapView}
          >
            <Home className="w-4 h-4 mr-2" />
            Reset View
          </Button>
          <div ref={mapContainer} className="w-full h-full rounded-lg" />
        </div>
      </DialogContent>
    </Dialog>
  );
}