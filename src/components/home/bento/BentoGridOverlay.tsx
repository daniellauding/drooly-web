import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BentoGridOverlayProps {
  visible: boolean;
  onLoginClick: () => void;
}

export function BentoGridOverlay({ visible, onLoginClick }: BentoGridOverlayProps) {
  if (!visible) return null;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 bg-gradient-to-b from-transparent via-white/50 to-white z-10">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Want to see more?</h2>
        <Button 
          size="lg"
          onClick={onLoginClick}
          className="bg-primary hover:bg-primary/90 text-white px-8"
        >
          Login or create account
        </Button>
      </div>
    </div>
  );
}