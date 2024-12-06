import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Initialize Firebase Admin
const serviceAccount = JSON.parse(
  readFileSync(join(__dirname, '../service-account.json'), 'utf8')
);

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

async function updateTranslations() {
  try {
    // Read local translation files
    const enTranslations = JSON.parse(readFileSync(join(__dirname, '../src/i18n/locales/en.json'), 'utf8'));
    const svTranslations = JSON.parse(readFileSync(join(__dirname, '../src/i18n/locales/sv.json'), 'utf8'));

    // Function to flatten nested objects
    const flattenObject = (obj, prefix = '') => {
      return Object.keys(obj).reduce((acc, k) => {
        const pre = prefix.length ? prefix + '.' : '';
        if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
          Object.assign(acc, flattenObject(obj[k], pre + k));
        } else {
          acc[pre + k] = obj[k];
        }
        return acc;
      }, {});
    };

    // Flatten translations
    const flatEn = flattenObject(enTranslations);
    const flatSv = flattenObject(svTranslations);

    console.log('Uploading English translations...');
    // Update English translations
    const enBatch = db.batch();
    Object.entries(flatEn).forEach(([key, value]) => {
      const ref = db.collection('translations').doc('en').collection('strings').doc(key);
      enBatch.set(ref, { value });
    });
    await enBatch.commit();
    console.log('English translations updated');

    console.log('Uploading Swedish translations...');
    // Update Swedish translations
    const svBatch = db.batch();
    Object.entries(flatSv).forEach(([key, value]) => {
      const ref = db.collection('translations').doc('sv').collection('strings').doc(key);
      svBatch.set(ref, { value });
    });
    await svBatch.commit();
    console.log('Swedish translations updated');

    console.log('All translations updated successfully');
  } catch (error) {
    console.error('Error updating translations:', error);
    process.exit(1);
  }
  process.exit(0);
}

updateTranslations();