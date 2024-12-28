import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import './index.css'
import { checkSystemStatus } from './utils/systemStatus'

// Create Query Client
const queryClient = new QueryClient()

// Validate environment before mounting
console.group('🚀 Application Startup');
console.log(`Environment: ${import.meta.env.VITE_APP_ENV}`);
console.log(`Firebase Project: ${import.meta.env.VITE_FIREBASE_PROJECT_ID}`);

checkSystemStatus().then((status) => {
  if (!status) {
    console.error('⚠️ Application started with configuration warnings');
  }
  
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </React.StrictMode>
  )
  
  console.groupEnd();
}).catch((error) => {
  console.error('❌ System check failed:', error)
  console.groupEnd()
})
