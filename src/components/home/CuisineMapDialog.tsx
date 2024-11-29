import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Recipe } from "@/types/recipe";
import { useNavigate } from 'react-router-dom';

// Replace with your Mapbox token
mapboxgl.accessToken = 'YOUR_MAPBOX_TOKEN';

const CUISINE_COORDINATES: Record<string, [number, number]> = {
  'italian': [12.4964, 41.9028],
  'japanese': [139.6503, 35.6762],
  'mexican': [-99.1332, 19.4326],
  'indian': [77.2090, 28.6139],
  'french': [2.3522, 48.8566],
  'thai': [100.5018, 13.7563],
  'mediterranean': [23.7275, 37.9838],
  'chinese': [116.4074, 39.9042],
  'korean': [126.9780, 37.5665],
  'vietnamese': [105.8542, 21.0285],
};

interface CuisineMapDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipes: Recipe[];
}

export function CuisineMapDialog({ open, onOpenChange, recipes }: CuisineMapDialogProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const navigate = useNavigate();
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!open || !mapContainer.current || map.current) return;

    console.log("Initializing map...");
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [0, 20],
      zoom: 1.5
    });

    map.current.on('load', () => {
      console.log("Map loaded");
      setMapLoaded(true);
    });

    return () => {
      if (map.current) {
        console.log("Removing map");
        map.current.remove();
        map.current = null;
      }
    };
  }, [open]);

  useEffect(() => {
    if (!mapLoaded || !map.current || !recipes.length) return;

    console.log("Adding markers for recipes:", recipes.length);
    
    // Group recipes by cuisine
    const recipesByCuisine = recipes.reduce((acc, recipe) => {
      if (recipe.cuisine && CUISINE_COORDINATES[recipe.cuisine.toLowerCase()]) {
        if (!acc[recipe.cuisine]) {
          acc[recipe.cuisine] = [];
        }
        acc[recipe.cuisine].push(recipe);
      }
      return acc;
    }, {} as Record<string, Recipe[]>);

    // Add markers for each cuisine
    Object.entries(recipesByCuisine).forEach(([cuisine, cuisineRecipes]) => {
      const coordinates = CUISINE_COORDINATES[cuisine.toLowerCase()];
      if (!coordinates) return;

      const el = document.createElement('div');
      el.className = 'cuisine-marker';
      el.innerHTML = `
        <div class="bg-primary text-primary-foreground rounded-full p-3 cursor-pointer hover:scale-110 transition-transform">
          <div class="text-sm font-bold">${cuisineRecipes.length}</div>
        </div>
      `;

      el.addEventListener('click', () => {
        const popup = new mapboxgl.Popup({ offset: 25 })
          .setLngLat(coordinates)
          .setHTML(`
            <div class="p-2">
              <h3 class="font-bold mb-2">${cuisine} Cuisine</h3>
              <div class="space-y-1">
                ${cuisineRecipes.map(recipe => `
                  <div class="cursor-pointer hover:text-primary" 
                       onclick="window.location.href='/recipe/${recipe.id}'">
                    ${recipe.title}
                  </div>
                `).join('')}
              </div>
            </div>
          `)
          .addTo(map.current!);
      });

      new mapboxgl.Marker(el)
        .setLngLat(coordinates)
        .addTo(map.current!);
    });
  }, [mapLoaded, recipes, navigate]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] h-[600px] p-0">
        <div ref={mapContainer} className="w-full h-full" />
      </DialogContent>
    </Dialog>
  );
}