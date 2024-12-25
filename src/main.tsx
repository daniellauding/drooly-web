import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './i18n/config'
import { checkSystemStatus } from './utils/systemStatus'

console.group('📱 Application Startup')
console.log('Version:', import.meta.env.VITE_APP_VERSION || 'development')
console.log('Environment:', import.meta.env.MODE)
console.log('Build Date:', new Date().toISOString())

// Run system status check
checkSystemStatus().then(() => {
  const root = createRoot(document.getElementById("root")!);
  root.render(<App />);
  
  console.log('✅ Application mounted successfully');
  console.groupEnd();
}).catch(error => {
  console.error('❌ System check failed:', error);
  console.groupEnd();
});
