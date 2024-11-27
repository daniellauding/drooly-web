import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const uploadImage = async (imageUrl: string, userId: string): Promise<string | null> => {
  console.log("Processing image:", imageUrl);
  
  if (!imageUrl.startsWith('blob:')) {
    console.log("Image is already uploaded:", imageUrl);
    return imageUrl;
  }

  try {
    const storage = getStorage();
    const response = await fetch(imageUrl);
    const blob = await response.clone().blob(); // Clone the response before using it
    
    const imagePath = `recipes/${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const imageRef = ref(storage, imagePath);
    
    await uploadBytes(imageRef, blob);
    const downloadUrl = await getDownloadURL(imageRef);
    console.log("Successfully uploaded image:", downloadUrl);
    return downloadUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
};

export const processRecipeImages = async (images: string[], userId: string): Promise<string[]> => {
  console.log("Processing recipe images:", images.length);
  
  const uploadedUrls = await Promise.all(
    images.map(imageUrl => uploadImage(imageUrl, userId))
  );
  
  return uploadedUrls.filter((url): url is string => url !== null);
};