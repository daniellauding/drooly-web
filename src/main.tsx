import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import './index.css'
import './i18n/config'
import { checkSystemStatus } from './utils/systemStatus'

console.group('📱 Application Startup')
console.log('Version:', import.meta.env.VITE_APP_VERSION || 'development')
console.log('Environment:', import.meta.env.MODE)
console.log('Build Date:', new Date().toISOString())

const queryClient = new QueryClient()

// Run system status check
checkSystemStatus().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </React.StrictMode>
  )
  
  console.log('✅ Application mounted successfully')
  console.groupEnd()
}).catch(error => {
  console.error('❌ System check failed:', error)
  console.groupEnd()
})
