import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const fetchTranslations = async (locale: string) => {
  console.log('Fetching translations for locale:', locale);
  try {
    const translationsRef = collection(db, "translations", locale, "strings");
    const q = query(translationsRef);
    const querySnapshot = await getDocs(q);
    
    const translations: Record<string, any> = {};
    querySnapshot.forEach((doc) => {
      translations[doc.id] = doc.data().value;
    });
    
    console.log('Fetched translations:', translations);
    return translations;
  } catch (error) {
    console.error('Error fetching translations:', error);
    throw error;
  }
};