import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import { CookieConsent } from "./components/CookieConsent";
import { Toaster } from "./components/ui/toaster";
import { Routes, Route } from "react-router-dom";
import CreateRecipe from "./pages/CreateRecipe";
import RecipeDetail from "./pages/RecipeDetail";
import Home from "./pages/Index";
import Create from "./pages/Create";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<Create />} />
            <Route path="/create-recipe" element={<CreateRecipe />} />
            <Route path="/recipe/:id" element={<RecipeDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </Router>
        <CookieConsent />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;