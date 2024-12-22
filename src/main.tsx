import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './i18n/config'

// Wait for i18next to be initialized before rendering
const root = createRoot(document.getElementById("root")!);
root.render(<App />);
