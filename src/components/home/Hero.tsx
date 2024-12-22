import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface HeroProps {
  onSearch?: (query: string) => void;
}

export function Hero({ onSearch = () => {} }: HeroProps) {
  const { t, ready } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearch(searchQuery);
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Show loading state while translations are not ready
  if (!ready) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative overflow-hidden bg-background py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto space-y-8">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            {t('home.hero.title')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('home.hero.description')}
          </p>
          
          <div className="relative max-w-xl mx-auto">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={t('home.search.placeholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full rounded-lg border bg-white px-9 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <Button onClick={handleSearch}>
                {t('home.ai.assist')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}