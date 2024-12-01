import { useState } from "react";
import { UtensilsCrossed, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { EventDish } from "@/types/event";

interface EventRecipeAssignmentProps {
  dishes: EventDish[];
  onAddDish: (dish: EventDish) => void;
}

export function EventRecipeAssignment({ dishes, onAddDish }: EventRecipeAssignmentProps) {
  const [newDishName, setNewDishName] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<string>("");

  const handleAddDish = () => {
    if (!newDishName.trim() || !selectedCourse) return;

    onAddDish({
      id: crypto.randomUUID(),
      name: newDishName,
      assignedTo: "",
      ingredients: [],
      courseType: selectedCourse as "appetizer" | "main" | "dessert" | "drinks",
      votes: {
        likes: [],
        dislikes: []
      }
    });

    setNewDishName("");
    setSelectedCourse("");
  };

  return (
    <Accordion type="single" collapsible defaultValue="recipes" className="w-full">
      <AccordionItem value="recipes">
        <AccordionTrigger>
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="h-5 w-5" />
            <span className="font-medium">What's cooking?</span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <Card className="p-6 space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter dish name"
                value={newDishName}
                onChange={(e) => setNewDishName(e.target.value)}
              />
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="appetizer">Appetizer</SelectItem>
                  <SelectItem value="main">Main Course</SelectItem>
                  <SelectItem value="dessert">Dessert</SelectItem>
                  <SelectItem value="drinks">Drinks</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleAddDish}>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>

            {dishes.length > 0 && (
              <div className="space-y-2">
                {["appetizer", "main", "dessert", "drinks"].map((course) => {
                  const courseDishes = dishes.filter(d => d.courseType === course);
                  if (courseDishes.length === 0) return null;

                  return (
                    <div key={course} className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2 capitalize">{course}</h3>
                      <ul className="space-y-2">
                        {courseDishes.map((dish) => (
                          <li key={dish.id} className="flex items-center justify-between">
                            <span>{dish.name}</span>
                            <span className="text-sm text-muted-foreground">
                              {dish.assignedTo || "Unassigned"}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}