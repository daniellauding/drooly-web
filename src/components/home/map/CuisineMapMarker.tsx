import mapboxgl from 'mapbox-gl';
import { Recipe } from "@/types/recipe";

interface CuisineMapMarkerProps {
  cuisine: string;
  coordinates: [number, number];
  recipes: Recipe[];
  map: mapboxgl.Map;
}

export function createCuisineMapMarker({ cuisine, coordinates, recipes, map }: CuisineMapMarkerProps) {
  console.log(`Creating marker for ${cuisine} with ${recipes.length} recipes`);

  const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
    <div class="p-2">
      <h3 class="font-bold text-base capitalize">${cuisine} Cuisine</h3>
      <p class="text-sm text-gray-600">${recipes.length} recipes</p>
      <ul class="mt-2 space-y-1">
        ${recipes.slice(0, 3).map(recipe => `
          <li class="text-sm">
            <a href="/recipe/${recipe.id}" class="text-blue-600 hover:underline">
              ${recipe.title}
            </a>
          </li>
        `).join('')}
        ${recipes.length > 3 ? `
          <li class="text-sm text-gray-500">
            +${recipes.length - 3} more recipes
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
    .addTo(map);

  const markerElement = marker.getElement();
  markerElement.style.transition = 'transform 0.2s ease';
  markerElement.addEventListener('mouseenter', () => {
    markerElement.style.transform = 'scale(1.2)';
  });
  markerElement.addEventListener('mouseleave', () => {
    markerElement.style.transform = 'scale(1)';
  });

  return marker;
}