import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import RecipeDetail from "./pages/RecipeDetail";
import PlanTogether from "./pages/PlanTogether";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          <Route path="/plan" element={<PlanTogether />} />
          <Route path="/favorites" element={<Navigate to="/" />} />
          <Route path="/search" element={<Navigate to="/" />} />
          <Route path="/profile" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;