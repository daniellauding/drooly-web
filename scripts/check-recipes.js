#!/usr/bin/env node

// Quick script to check recipe counts in each Firebase project
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, getCountFromServer } from 'firebase/firestore';

const projects = {
  'drooly-dev': {
    apiKey: "AIzaSyAwWnJzMj-Ue-9FOHxDeZDJSiNbaV8OrOA",
    authDomain: "drooly-dev.firebaseapp.com",
    projectId: "drooly-dev",
    storageBucket: "drooly-dev.appspot.com",
    messagingSenderId: "998655731139",
    appId: "1:998655731139:web:b5fd6d90fd43cfabe48976"
  },
  'drooly-stage': {
    apiKey: "AIzaSyDSQuIzboknuR99zhHTqWabnYgJPIqpGho",
    authDomain: "drooly-stage.firebaseapp.com",
    projectId: "drooly-stage",
    storageBucket: "drooly-stage.firebasestorage.app",
    messagingSenderId: "276086519407",
    appId: "1:276086519407:web:869bafad1ab6b44856bf9a"
  },
  'drooly': {
    apiKey: "AIzaSyCwP0w894sxwbxwPwCMR7_i6i8Cowdt2dA",
    authDomain: "drooly.firebaseapp.com",
    projectId: "drooly",
    storageBucket: "drooly.appspot.com",
    messagingSenderId: "727727122836",
    appId: "1:727727122836:web:582334a12d884d0ab2c781"
  }
};

async function checkRecipes() {
  console.log('\n🔍 Checking recipes in all Firebase projects...\n');
  
  for (const [name, config] of Object.entries(projects)) {
    try {
      const app = initializeApp(config, name);
      const db = getFirestore(app);
      
      const recipesRef = collection(db, 'recipes');
      
      // Total recipes
      const totalSnap = await getCountFromServer(recipesRef);
      const totalCount = totalSnap.data().count;
      
      // Published recipes
      const publishedQuery = query(recipesRef, where('status', '==', 'published'));
      const publishedSnap = await getCountFromServer(publishedQuery);
      const publishedCount = publishedSnap.data().count;
      
      console.log(`📊 ${name}:`);
      console.log(`   Total recipes: ${totalCount}`);
      console.log(`   Published recipes: ${publishedCount}`);
      console.log('');
      
    } catch (error) {
      console.error(`❌ Error checking ${name}:`, error.message);
      console.log('');
    }
  }
}

checkRecipes().then(() => {
  console.log('✅ Done!');
  process.exit(0);
}).catch(error => {
  console.error('❌ Failed:', error);
  process.exit(1);
});

