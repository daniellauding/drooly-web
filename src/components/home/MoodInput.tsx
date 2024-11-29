import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { Coffee, Cookie, UtensilsCrossed, Pizza, Beer, Sandwich, Soup } from "lucide-react";

type Mood = {
  icon: React.ElementType;
  label: string;
  filterCategory?: string;
};

const moods: Mood[] = [
  { icon: Coffee, label: "Breakfast", filterCategory: "breakfast" },
  { icon: Sandwich, label: "Lunch", filterCategory: "lunch" },
  { icon: UtensilsCrossed, label: "Dinner", filterCategory: "dinner" },
  { icon: Cookie, label: "Snack", filterCategory: "snacks" },
  { icon: Pizza, label: "Craving", filterCategory: "comfort-food" },
  { icon: Beer, label: "Party Food", filterCategory: "party" },
  { icon: Soup, label: "Comfort Food", filterCategory: "comfort-food" },
];

interface MoodInputProps {
  onFilterChange?: (category: string) => void;
}

export function MoodInput({ onFilterChange }: MoodInputProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [customMood, setCustomMood] = useState("");

  const handleMoodSelect = (mood: Mood) => {
    if (mood.filterCategory && onFilterChange) {
      onFilterChange(mood.filterCategory);
    }
    setOpen(false);
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full flex items-center gap-2 h-12 justify-start px-4 text-muted-foreground hover:text-foreground"
        >
          <img 
            src={user.photoURL || "/placeholder.svg"} 
            alt="Profile" 
            className="w-8 h-8 rounded-full"
          />
          <span className="truncate">What are you craving today, {user.displayName?.split(' ')[0] || 'there'}?</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>How are you feeling?</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4">
          {moods.map((mood) => (
            <Button
              key={mood.label}
              variant="outline"
              className="flex flex-col items-center gap-2 h-auto py-4 hover:bg-accent"
              onClick={() => handleMoodSelect(mood)}
            >
              <mood.icon className="h-6 w-6" />
              <span className="text-sm">{mood.label}</span>
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-2 px-4 pb-4">
          <Input
            placeholder="Or type something else..."
            value={customMood}
            onChange={(e) => setCustomMood(e.target.value)}
            className="flex-1"
          />
          <Button 
            onClick={() => {
              if (customMood.trim()) {
                if (onFilterChange) onFilterChange(customMood.toLowerCase());
                setOpen(false);
              }
            }}
            disabled={!customMood.trim()}
          >
            Share
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}