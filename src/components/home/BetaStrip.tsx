import { Button } from "@/components/ui/button";
import { ExternalLink, MessageSquarePlus } from "lucide-react";

export function BetaStrip() {
  const handleFeedback = () => {
    window.open("https://forms.gle/YourFeedbackFormURL", "_blank");
  };

  const handleJoin = () => {
    window.open("https://discord.gg/YourDiscordInvite", "_blank");
  };

  return (
    <div className="bg-accent/30 border-b z-50 relative">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          🚀 Welcome to Drooly Beta! We're cooking up something special.
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs"
            onClick={handleFeedback}
          >
            <MessageSquarePlus className="h-4 w-4 mr-1" />
            Give Feedback
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="text-xs"
            onClick={handleJoin}
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            Join Community
          </Button>
        </div>
      </div>
    </div>
  );
}