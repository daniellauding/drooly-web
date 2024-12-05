import { Search, Link, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface HeroProps {
  onSearch?: (query: string) => void;
}

export function Hero({ onSearch }: HeroProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  console.log('Current translations loaded for Hero component');

  const handleCreateRecipe = () => {
    navigate('/create');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  return (
    <div className="relative bg-[#F7F9FC] py-20 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            {t('home.hero.title')}
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('home.hero.description')}
          </p>

          <div className="relative max-w-2xl mx-auto">
            <Input 
              placeholder={t('home.search.placeholder')}
              className="h-12 pl-12 pr-32 text-lg shadow-sm"
              onChange={handleSearchChange}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Button 
              className="absolute right-1 top-1/2 -translate-y-1/2"
              onClick={handleCreateRecipe}
            >
              <Wand2 className="mr-2 h-4 w-4" />
              {t('home.ai.assist')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}