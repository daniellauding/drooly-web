import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Translation {
  key: string;
  en: string;
  [key: string]: string;
}

const RECIPE_TRANSLATIONS = [
  { key: "recipe.create", en: "Create Recipe" },
  { key: "recipe.ingredients", en: "Ingredients" },
  { key: "recipe.steps", en: "Steps" },
  { key: "recipe.difficulty.easy", en: "Easy" },
  { key: "recipe.difficulty.medium", en: "Medium" },
  { key: "recipe.difficulty.hard", en: "Hard" },
  { key: "recipe.categories.family", en: "Family Friendly" },
  { key: "recipe.categories.quick", en: "Fast & Easy" },
  { key: "recipe.categories.budget", en: "Budget Friendly" },
  { key: "recipe.categories.mealPrep", en: "Meal Prep" },
  { key: "recipe.categories.healthy", en: "Healthy" },
  { key: "recipe.categories.comfort", en: "Comfort Food" },
  { key: "recipe.categories.party", en: "Party Food" },
  { key: "recipe.categories.gourmet", en: "Gourmet" },
  { key: "recipe.dietary.vegetarian", en: "Vegetarian" },
  { key: "recipe.dietary.vegan", en: "Vegan" },
  { key: "recipe.dietary.glutenFree", en: "Gluten Free" },
  { key: "recipe.dietary.dairyFree", en: "Dairy Free" },
  { key: "recipe.dietary.containsNuts", en: "Contains Nuts" },
  { key: "recipe.servings.title", en: "Servings" },
  { key: "recipe.servings.amount", en: "Amount" },
  { key: "recipe.energy.calories", en: "Calories" },
  { key: "recipe.energy.protein", en: "Protein" },
  { key: "recipe.energy.carbs", en: "Carbohydrates" },
  { key: "recipe.energy.fat", en: "Fat" },
];

const UI_TRANSLATIONS = [
  { key: "welcome", en: "Welcome to Drooly" },
  { key: "login", en: "Log in" },
  { key: "signup", en: "Sign up" },
  { key: "save", en: "Save" },
  { key: "cancel", en: "Cancel" },
  { key: "delete", en: "Delete" },
  { key: "edit", en: "Edit" },
  { key: "publish", en: "Publish" },
  { key: "save_draft", en: "Save as Draft" },
  { key: "invite_users", en: "Invite Users" },
  { key: "send_invite", en: "Send Invite" },
  { key: "add_language", en: "Add Language" },
  { key: "search", en: "Search" },
];

export function BackofficeTranslations() {
  const [translations, setTranslations] = useState<Translation[]>([...RECIPE_TRANSLATIONS, ...UI_TRANSLATIONS]);
  const [languages, setLanguages] = useState<string[]>(["en", "sv"]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newLanguage, setNewLanguage] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();

  const handleAddLanguage = () => {
    if (newLanguage && !languages.includes(newLanguage)) {
      setLanguages([...languages, newLanguage]);
      setTranslations(translations.map(t => ({ ...t, [newLanguage]: "" })));
      setNewLanguage("");
      toast({
        title: "Language added",
        description: `Added ${newLanguage} to available languages`
      });
    }
  };

  const handleRemoveLanguage = (lang: string) => {
    if (lang === "en" || lang === "sv") {
      toast({
        title: "Cannot remove default language",
        description: "English and Swedish are required languages",
        variant: "destructive"
      });
      return;
    }
    
    setLanguages(languages.filter(l => l !== lang));
    setTranslations(translations.map(({ [lang]: _, ...rest }) => rest));
    toast({
      title: "Language removed",
      description: `Removed ${lang} from available languages`
    });
  };

  const handleUpdateTranslation = (key: string, lang: string, value: string) => {
    setTranslations(translations.map(t => 
      t.key === key ? { ...t, [lang]: value } : t
    ));
  };

  const filteredTranslations = translations.filter(t => {
    const matchesSearch = t.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      Object.values(t).some(v => v.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "recipe") return matchesSearch && t.key.startsWith("recipe.");
    if (activeTab === "ui") return matchesSearch && !t.key.startsWith("recipe.");
    
    return matchesSearch;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        {languages.map(lang => (
          <Badge
            key={lang}
            variant={lang === "sv" ? "default" : "secondary"}
            className="flex items-center gap-1"
          >
            {lang.toUpperCase()}
            {lang !== "en" && lang !== "sv" && (
              <button
                onClick={() => handleRemoveLanguage(lang)}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </Badge>
        ))}
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search translations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Add new language (e.g., es, fr)"
            value={newLanguage}
            onChange={(e) => setNewLanguage(e.target.value)}
            className="w-48"
          />
          <Button onClick={handleAddLanguage}>
            <Plus className="h-4 w-4 mr-2" />
            Add Language
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Translations</TabsTrigger>
          <TabsTrigger value="recipe">Recipe Related</TabsTrigger>
          <TabsTrigger value="ui">UI Elements</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Key</TableHead>
              {languages.map(lang => (
                <TableHead key={lang}>{lang.toUpperCase()}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTranslations.map((translation) => (
              <TableRow key={translation.key}>
                <TableCell className="font-mono">{translation.key}</TableCell>
                {languages.map(lang => (
                  <TableCell key={lang}>
                    <Input
                      value={translation[lang] || ""}
                      onChange={(e) => handleUpdateTranslation(translation.key, lang, e.target.value)}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}