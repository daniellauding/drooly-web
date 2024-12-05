import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface TranslationLanguageBadgesProps {
  languages: string[];
  onRemoveLanguage: (lang: string) => void;
}

export function TranslationLanguageBadges({ languages, onRemoveLanguage }: TranslationLanguageBadgesProps) {
  return (
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
              onClick={() => onRemoveLanguage(lang)}
              className="ml-1 hover:text-destructive"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </Badge>
      ))}
    </div>
  );
}