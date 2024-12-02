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

  // Create a popup with recipe cards
  const popup = new mapboxgl.Popup({
    offset: 25,
    closeButton: true,
    closeOnClick: false,
    maxWidth: '300px'
  }).setHTML(`
    <div class="p-4">
      <h3 class="font-bold text-lg capitalize mb-2">${cuisine} Cuisine</h3>
      <p class="text-sm text-gray-600 mb-4">${recipes.length} recipes</p>
      <div class="space-y-3 max-h-[300px] overflow-y-auto">
        ${recipes.map(recipe => `
          <div class="bg-white rounded-lg shadow p-3 hover:shadow-md transition-shadow">
            <a href="/recipe/${recipe.id}" class="block">
              ${recipe.images?.[0] ? 
                `<img src="${recipe.images[0]}" alt="${recipe.title}" class="w-full h-32 object-cover rounded-md mb-2"/>` :
                '<div class="w-full h-32 bg-gray-100 rounded-md mb-2 flex items-center justify-center">No image</div>'
              }
              <h4 class="font-semibold text-primary">${recipe.title}</h4>
              <p class="text-sm text-gray-600">by ${recipe.chef || 'Unknown chef'}</p>
            </a>
          </div>
        `).join('')}
      </div>
    </div>
  `);

  // Create the marker
  const marker = new mapboxgl.Marker({
    color: "#FF5A5F",
    scale: 0.8
  })
    .setLngLat(coordinates)
    .setPopup(popup)
    .addTo(map);

  // Style the marker element
  const markerElement = marker.getElement();
  markerElement.style.cursor = 'pointer';
  markerElement.classList.add('cuisine-marker');
  
  // Add click handler for zooming
  markerElement.addEventListener('click', () => {
    map.flyTo({
      center: coordinates,
      zoom: 6,
      duration: 1500,
      essential: true
    });
  });

  return marker;
}