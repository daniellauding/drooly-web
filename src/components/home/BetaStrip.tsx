import { Button } from "@/components/ui/button";
import { MessageSquarePlus } from "lucide-react";
import { useState } from "react";
import { FeedbackModal } from "./FeedbackModal";

export function BetaStrip() {
  const [feedbackOpen, setFeedbackOpen] = useState(false);

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
            onClick={() => setFeedbackOpen(true)}
          >
            <MessageSquarePlus className="h-4 w-4 mr-1" />
            Give Feedback
          </Button>
        </div>
      </div>
      <FeedbackModal 
        open={feedbackOpen} 
        onOpenChange={setFeedbackOpen} 
      />
    </div>
  );
}