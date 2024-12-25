import { MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FeedbackBannerProps {
  onFeedbackClick: () => void;
}

export function FeedbackBanner({ onFeedbackClick }: FeedbackBannerProps) {
  return (
    <div className="bg-muted py-2 px-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm">✨ We're in Beta! Your feedback matters. Help us improve – share your thoughts!</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-sm whitespace-nowrap"
          onClick={onFeedbackClick}
        >
          <MessageSquarePlus className="h-4 w-4 mr-2" />
          Send Feedback
        </Button>
      </div>
    </div>
  );
} 