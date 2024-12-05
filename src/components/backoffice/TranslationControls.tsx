import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";

interface TranslationControlsProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  newLanguage: string;
  onNewLanguageChange: (value: string) => void;
  onAddLanguage: () => void;
}

export function TranslationControls({
  searchQuery,
  onSearchChange,
  newLanguage,
  onNewLanguageChange,
  onAddLanguage
}: TranslationControlsProps) {
  return (
    <div className="flex gap-4">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search translations..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8"
        />
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="Add new language (e.g., es, fr)"
          value={newLanguage}
          onChange={(e) => onNewLanguageChange(e.target.value)}
          className="w-48"
        />
        <Button onClick={onAddLanguage}>
          <Plus className="h-4 w-4 mr-2" />
          Add Language
        </Button>
      </div>
    </div>
  );
}