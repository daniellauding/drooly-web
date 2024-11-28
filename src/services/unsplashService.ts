import { createApi } from 'unsplash-js';

const unsplash = createApi({
  accessKey: import.meta.env.VITE_UNSPLASH_API_KEY || ''
});

export interface UnsplashPhoto {
  id: string;
  urls: {
    regular: string;
    small: string;
  };
  user: {
    name: string;
    links: {
      html: string;
    };
  };
  links: {
    html: string;
  };
}

export const searchPhotos = async (query: string): Promise<UnsplashPhoto[]> => {
  console.log('Searching Unsplash photos for:', query);
  
  try {
    const result = await unsplash.search.getPhotos({
      query,
      perPage: 5,
      orientation: 'landscape'
    });

    if (result.errors) {
      console.error('Unsplash API errors:', result.errors);
      throw new Error('Failed to fetch photos from Unsplash');
    }

    console.log('Unsplash search results:', result.response?.results);
    return result.response?.results || [];
  } catch (error) {
    console.error('Error fetching photos from Unsplash:', error);
    throw error;
  }
};

export const triggerPhotoDownload = async (photoId: string) => {
  console.log('Triggering download event for photo:', photoId);
  
  try {
    await unsplash.photos.trackDownload({
      downloadLocation: `https://api.unsplash.com/photos/${photoId}/download`
    });
    console.log('Download event tracked successfully');
  } catch (error) {
    console.error('Error tracking photo download:', error);
  }
};