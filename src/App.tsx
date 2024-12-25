import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import { CookieConsent } from "./components/CookieConsent";
import { Toaster } from "./components/ui/toaster";
import { Routes, Route, Navigate } from "react-router-dom";
import { MobileNav } from "./components/navigation/MobileNav";
import CreateRecipe from "./pages/CreateRecipe";
import RecipeDetail from "./pages/RecipeDetail";
import Home from "./pages/Index";
import Create from "./pages/Create";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Backoffice from "./pages/Backoffice";
import About from "./pages/About";
import Events from "./pages/Events";
import CreateEvent from "./pages/CreateEvent";
import { EventDetailView } from "./components/event/EventDetailView";
import Todo from "./pages/Todo";
import Ingredients from "./pages/Ingredients";
import "./i18n/config";
import { EmailVerificationBanner } from "./components/auth/EmailVerificationBanner";
import { useEffect } from 'react';

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    // Log initial render time
    const renderTime = performance.now();
    console.group('🚀 App Performance Metrics');
    console.log('Initial render time:', Math.round(renderTime), 'ms');
    
    // Monitor route changes if using React Router
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigationEntry) {
      console.log('Navigation timing:', {
        'DNS lookup': Math.round(navigationEntry.domainLookupEnd - navigationEntry.domainLookupStart),
        'Connection time': Math.round(navigationEntry.connectEnd - navigationEntry.connectStart),
        'Page load': Math.round(navigationEntry.loadEventEnd - navigationEntry.startTime),
      });
    }
    
    // Log memory usage if available
    // @ts-ignore Chrome-specific API
    if (window.performance?.memory) {
      console.log('Memory usage:', {
        // @ts-ignore Chrome-specific API
        'Total JS heap size': Math.round(window.performance.memory.totalJSHeapSize / 1048576) + 'MB',
        // @ts-ignore Chrome-specific API
        'Used JS heap size': Math.round(window.performance.memory.usedJSHeapSize / 1048576) + 'MB',
      });
    }
    
    console.groupEnd();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <EmailVerificationBanner />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<Create />} />
            <Route path="/create-recipe" element={<CreateRecipe />} />
            <Route path="/recipe/:id" element={<RecipeDetail />} />
            <Route path="/recipe/edit/:id" element={<CreateRecipe />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Register />} />
            <Route path="/register" element={<Navigate to="/signup" replace />} />
            <Route path="/backoffice" element={<Backoffice />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetailView />} />
            <Route path="/events/edit/:id" element={<CreateEvent />} />
            <Route path="/create-event" element={<CreateEvent />} />
            <Route path="/about" element={<About />} />
            <Route path="/todo" element={<Todo />} />
            <Route path="/ingredients" element={<Ingredients />} />
          </Routes>
          <MobileNav />
        </Router>
        <CookieConsent />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;