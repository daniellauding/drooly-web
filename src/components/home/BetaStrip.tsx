import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export function BetaStrip() {
  const handleProductHunt = () => {
    window.open("https://www.producthunt.com/posts/drooly", "_blank");
  };

  return (
    <div className="bg-[#FF4742] text-white py-1">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-2 text-sm">
          <span>We're live on</span>
          <Button
            variant="link"
            className="text-white p-0 h-auto font-semibold hover:no-underline"
            onClick={handleProductHunt}
          >
            Product Hunt
          </Button>
          <span>!</span>
          <span>Support us by visiting & commenting!</span>
          <ExternalLink className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}