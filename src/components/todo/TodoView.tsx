import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ChefHat, ShoppingCart, CheckSquare, Calendar } from "lucide-react";
import { Recipe } from "@/types/recipe";
import { IngredientItem } from "@/components/shopping/types";
import { ShoppingListContent } from "./ShoppingListContent";
import { RecipesToCookContent } from "./RecipesToCookContent";
import { CustomTodoContent } from "./CustomTodoContent";
import { WeeklyPlanContent } from "./WeeklyPlanContent";
import { useNavigate, useLocation } from "react-router-dom";

export function TodoView() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/todo') {
      navigate('/ingredients');
    }
  }, [location, navigate]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Planning</h1>
      </div>

      <Tabs defaultValue="shopping" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="shopping" className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            Shopping List
          </TabsTrigger>
          <TabsTrigger value="cooking" className="flex items-center gap-2">
            <ChefHat className="w-4 h-4" />
            To Cook
          </TabsTrigger>
          <TabsTrigger value="weekly" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Weekly Plan
          </TabsTrigger>
          <TabsTrigger value="todos" className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4" />
            Custom Tasks
          </TabsTrigger>
        </TabsList>

        <TabsContent value="shopping">
          <ShoppingListContent />
        </TabsContent>

        <TabsContent value="cooking">
          <RecipesToCookContent />
        </TabsContent>

        <TabsContent value="weekly">
          <WeeklyPlanContent />
        </TabsContent>

        <TabsContent value="todos">
          <CustomTodoContent />
        </TabsContent>
      </Tabs>
    </div>
  );
}