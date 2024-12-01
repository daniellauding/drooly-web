export const CUISINE_COORDINATES: Record<string, [number, number]> = {
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
  'swedish': [18.0686, 59.3293],
};

export const normalizeCuisineName = (cuisine: string): string => {
  if (!cuisine) return '';
  console.log('Normalizing cuisine:', cuisine);
  const normalized = cuisine.toLowerCase().trim();
  console.log('Normalized cuisine:', normalized);
  return normalized;
};