import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TranslationLanguageBadges } from "./TranslationLanguageBadges";
import { TranslationControls } from "./TranslationControls";
import { Save } from "lucide-react";

interface Translation {
  key: string;
  en: string;
  [key: string]: string;
}

const RECIPE_TRANSLATIONS: Translation[] = [
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

const UI_TRANSLATIONS: Translation[] = [
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
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { toast } = useToast();

  const handleAddLanguage = () => {
    if (newLanguage && !languages.includes(newLanguage)) {
      setLanguages([...languages, newLanguage]);
      setTranslations(translations.map(t => ({
        ...t,
        [newLanguage]: ""
      } as Translation)));
      setNewLanguage("");
      setHasUnsavedChanges(true);
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
    setTranslations(translations.map(({ [lang]: _, ...rest }) => rest as Translation));
    setHasUnsavedChanges(true);
    toast({
      title: "Language removed",
      description: `Removed ${lang} from available languages`
    });
  };

  const handleUpdateTranslation = (key: string, lang: string, value: string) => {
    setTranslations(translations.map(t => 
      t.key === key ? { ...t, [lang]: value } : t
    ));
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    // Here you would typically save the translations to your backend
    console.log('Saving translations:', translations);
    setHasUnsavedChanges(false);
    toast({
      title: "Changes saved",
      description: "All translation changes have been saved successfully"
    });
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
      <div className="flex justify-between items-start">
        <TranslationLanguageBadges
          languages={languages}
          onRemoveLanguage={handleRemoveLanguage}
        />
        <Button
          onClick={handleSave}
          disabled={!hasUnsavedChanges}
          className="ml-4"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <TranslationControls
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        newLanguage={newLanguage}
        onNewLanguageChange={setNewLanguage}
        onAddLanguage={handleAddLanguage}
      />

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
