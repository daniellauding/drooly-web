import { useEffect, useRef } from "react";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Recipe } from "@/types/recipe";

// Initialize Mapbox token
mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbHRxOWF4OWgwMXJqMmtvNXB5ZGRqNmF0In0.a9qmZcbT7jB_g8hPvU7Jbw';

const CUISINE_COORDINATES: Record<string, [number, number]> = {
  'Italian': [12.4964, 41.9028],
  'French': [2.3522, 48.8566],
  'Japanese': [139.6503, 35.6762],
  'Chinese': [116.4074, 39.9042],
  'Thai': [100.5018, 13.7563],
  'Indian': [77.1025, 28.7041],
  'Mexican': [-99.1332, 19.4326],
  'Greek': [23.7275, 37.9838],
  'Spanish': [-3.7038, 40.4168],
  'Vietnamese': [105.8542, 21.0285],
  'Korean': [126.9780, 37.5665],
  'Turkish': [32.8597, 39.9334],
  'Lebanese': [35.5018, 33.8938],
  'Moroccan': [-6.8498, 34.0209],
  'Brazilian': [-47.8645, -15.7942],
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

    console.log("Initializing map");
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [0, 20],
      zoom: 1.5
    });

    const groupedRecipes = recipes.reduce((acc, recipe) => {
      if (recipe.cuisine && CUISINE_COORDINATES[recipe.cuisine]) {
        if (!acc[recipe.cuisine]) {
          acc[recipe.cuisine] = [];
        }
        acc[recipe.cuisine].push(recipe);
      }
      return acc;
    }, {} as Record<string, Recipe[]>);

    Object.entries(groupedRecipes).forEach(([cuisine, cuisineRecipes]) => {
      const coordinates = CUISINE_COORDINATES[cuisine];
      if (!coordinates) return;

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div class="p-2">
          <h3 class="font-bold">${cuisine} Cuisine</h3>
          <p class="text-sm">${cuisineRecipes.length} recipes</p>
          <ul class="mt-2 space-y-1">
            ${cuisineRecipes.slice(0, 3).map(recipe => `
              <li class="text-sm">
                <a href="/recipe/${recipe.id}" class="text-blue-600 hover:underline">
                  ${recipe.title}
                </a>
              </li>
            `).join('')}
          </ul>
        </div>
      `);

      new mapboxgl.Marker()
        .setLngLat(coordinates)
        .setPopup(popup)
        .addTo(map.current!);
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
        <div ref={mapContainer} className="w-full h-[600px] rounded-lg" />
      </DialogContent>
    </Dialog>
  );
}