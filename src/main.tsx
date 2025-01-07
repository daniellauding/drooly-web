import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import './index.css'
import { checkSystemStatus } from './utils/systemStatus'
import { verifyEnv } from './utils/verifyEnv';

// Create Query Client
const queryClient = new QueryClient()

// Validate environment before mounting
console.group('🚀 Application Startup');
console.log(`Environment: ${import.meta.env.MODE}`);
console.log(`Firebase Project: ${import.meta.env.VITE_FIREBASE_PROJECT_ID}`);

if (!verifyEnv()) {
  console.error('❌ Environment verification failed');
  console.groupEnd();
  throw new Error('Invalid environment configuration');
}

checkSystemStatus().then((status) => {
  if (!status) {
    console.error('⚠️ Application started with configuration warnings');
  }
  
  // Debug environment setup
  console.log('Environment:', import.meta.env.MODE);
  console.log('Firebase Project:', import.meta.env.VITE_FIREBASE_PROJECT_ID);

  // Add more detailed Firebase config logging
  const firebaseEnvCheck = {
    apiKey: !!import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: !!import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: !!import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: !!import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: !!import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: !!import.meta.env.VITE_FIREBASE_APP_ID,
  };

  console.log('Firebase Config Check:', firebaseEnvCheck);

  // Initialize app with error handling
  try {
    ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Application initialization failed:', error);
  }
  
  console.groupEnd();
}).catch((error) => {
  console.error('❌ System check failed:', error)
  console.groupEnd()
})
