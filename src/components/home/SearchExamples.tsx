import { Kitchen, Utensils, Globe, Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function SearchExamples() {
  const navigate = useNavigate();

  const handleExampleClick = (type: string) => {
    navigate('/create', { state: { searchType: type } });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button
          variant="outline"
          className="h-auto p-6 flex flex-col items-start space-y-2"
          onClick={() => handleExampleClick('kitchen')}
        >
          <Kitchen className="h-6 w-6 text-primary" />
          <div className="text-left">
            <p className="font-medium">What's in your kitchen?</p>
            <p className="text-sm text-muted-foreground">Find recipes using ingredients you have</p>
          </div>
        </Button>

        <Button
          variant="outline"
          className="h-auto p-6 flex flex-col items-start space-y-2"
          onClick={() => handleExampleClick('cuisine')}
        >
          <Globe className="h-6 w-6 text-primary" />
          <div className="text-left">
            <p className="font-medium">Explore cuisines</p>
            <p className="text-sm text-muted-foreground">Discover recipes from around the world</p>
          </div>
        </Button>

        <Button
          variant="outline"
          className="h-auto p-6 flex flex-col items-start space-y-2"
          onClick={() => handleExampleClick('url')}
        >
          <Link className="h-6 w-6 text-primary" />
          <div className="text-left">
            <p className="font-medium">Import from URL</p>
            <p className="text-sm text-muted-foreground">Convert any recipe to your collection</p>
          </div>
        </Button>

        <Button
          variant="outline"
          className="h-auto p-6 flex flex-col items-start space-y-2"
          onClick={() => handleExampleClick('equipment')}
        >
          <Utensils className="h-6 w-6 text-primary" />
          <div className="text-left">
            <p className="font-medium">By equipment</p>
            <p className="text-sm text-muted-foreground">Find recipes for your cooking tools</p>
          </div>
        </Button>
      </div>
    </div>
  );
}