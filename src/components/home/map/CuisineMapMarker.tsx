import mapboxgl from 'mapbox-gl';
import { Recipe } from '@/types/recipe';

interface CreateMarkerProps {
  cuisine: string;
  coordinates: [number, number];
  recipes: Recipe[];
  map: mapboxgl.Map;
}

export function createCuisineMapMarker({ cuisine, coordinates, recipes, map }: CreateMarkerProps): mapboxgl.Marker {
  console.log(`[CuisineMapMarker] Creating marker for ${cuisine}:`, {
    coordinates,
    recipesCount: recipes.length
  });

  try {
    // Create marker element
    const el = document.createElement('div');
    el.className = 'marker';
    el.style.backgroundColor = '#FF4B4B';
    el.style.width = '24px';
    el.style.height = '24px';
    el.style.borderRadius = '50%';
    el.style.cursor = 'pointer';
    el.style.border = '2px solid white';
    el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';

    // Create popup content
    const popupContent = document.createElement('div');
    popupContent.innerHTML = `
      <h3 class="text-lg font-semibold mb-2">${cuisine} Cuisine</h3>
      <p class="text-sm mb-2">${recipes.length} recipes found</p>
      <ul class="space-y-1">
        ${recipes.map(recipe => `
          <li class="text-sm">
            ${recipe.title}
          </li>
        `).join('')}
      </ul>
    `;

    // Create popup
    const popup = new mapboxgl.Popup({
      offset: 25,
      closeButton: true,
      closeOnClick: false
    }).setDOMContent(popupContent);

    // Create and return marker
    const marker = new mapboxgl.Marker(el)
      .setLngLat(coordinates)
      .setPopup(popup)
      .addTo(map);

    console.log(`[CuisineMapMarker] Successfully created marker for ${cuisine}`);
    return marker;
  } catch (error) {
    console.error(`[CuisineMapMarker] Error creating marker for ${cuisine}:`, error);
    throw error;
  }
}