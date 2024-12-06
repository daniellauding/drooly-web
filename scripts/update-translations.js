const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin
const serviceAccount = require('../service-account.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function updateTranslations() {
  try {
    // Read local translation files
    const enTranslations = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/i18n/locales/en.json'), 'utf8'));
    const svTranslations = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/i18n/locales/sv.json'), 'utf8'));

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

    // Update English translations
    const enBatch = db.batch();
    Object.entries(flatEn).forEach(([key, value]) => {
      const ref = db.collection('translations').doc('en').collection('strings').doc(key);
      enBatch.set(ref, { value });
    });
    await enBatch.commit();
    console.log('English translations updated');

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