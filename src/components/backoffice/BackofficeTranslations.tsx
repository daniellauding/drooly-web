import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Search } from "lucide-react";

interface Translation {
  key: string;
  en: string;
  [key: string]: string;
}

const initialTranslations: Translation[] = [
  { key: "welcome", en: "Welcome to Drooly" },
  { key: "login", en: "Log in" },
  { key: "signup", en: "Sign up" },
];

export function BackofficeTranslations() {
  const [translations, setTranslations] = useState<Translation[]>(initialTranslations);
  const [languages, setLanguages] = useState<string[]>(["en"]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newLanguage, setNewLanguage] = useState("");
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

  const handleUpdateTranslation = (key: string, lang: string, value: string) => {
    setTranslations(translations.map(t => 
      t.key === key ? { ...t, [lang]: value } : t
    ));
  };

  const filteredTranslations = translations.filter(t => 
    t.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
    Object.values(t).some(v => v.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-4">
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