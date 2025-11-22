import admin from 'firebase-admin';
import { readFileSync } from 'fs';

// Initialize Firebase Admin for production
const serviceAccount = JSON.parse(readFileSync('./service-account.json', 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
});

const db = admin.firestore();

async function checkRecipes() {
  console.log('\n🔍 Checking recipes in production Firebase...\n');
  
  try {
    // Get all recipes
    const recipesRef = db.collection('recipes');
    const allRecipes = await recipesRef.get();
    
    console.log(`📊 Total recipes in database: ${allRecipes.size}\n`);
    
    if (allRecipes.empty) {
      console.log('❌ No recipes found in database!');
      return;
    }
    
    // Check each recipe's status
    allRecipes.forEach(doc => {
      const data = doc.data();
      console.log(`Recipe: ${doc.id}`);
      console.log(`  Title: ${data.title || 'N/A'}`);
      console.log(`  Status: ${data.status || 'MISSING!'}`);
      console.log(`  CreatedAt: ${data.createdAt ? 'Yes' : 'MISSING!'}`);
      console.log('');
    });
    
    // Count published recipes
    const publishedQuery = await recipesRef.where('status', '==', 'published').get();
    console.log(`\n✅ Published recipes: ${publishedQuery.size}`);
    
    // Count recipes missing status
    const missingStatus = allRecipes.docs.filter(doc => !doc.data().status);
    console.log(`⚠️  Recipes missing status field: ${missingStatus.length}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  process.exit(0);
}

checkRecipes();

