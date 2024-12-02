import { Button } from "@/components/ui/button";
import { CookingPot, Globe, Link, ClipboardPaste } from "lucide-react";

interface BentoQuickActionsProps {
  onKitchenClick: () => void;
  onCuisineClick: () => void;
  onUrlClick: () => void;
  onClipboardClick: () => void;
}

export function BentoQuickActions({
  onKitchenClick,
  onCuisineClick,
  onUrlClick,
  onClipboardClick
}: BentoQuickActionsProps) {
  const quickActions = [
    {
      label: "What's in your kitchen?",
      Icon: CookingPot,
      onClick: onKitchenClick
    },
    {
      label: "Explore cuisines",
      Icon: Globe,
      onClick: onCuisineClick
    },
    {
      label: "Import from URL",
      Icon: Link,
      onClick: onUrlClick
    },
    {
      label: "Paste from clipboard",
      Icon: ClipboardPaste,
      onClick: onClipboardClick
    }
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {quickActions.map((action, index) => (
        <Button
          key={index}
          variant="outline"
          onClick={action.onClick}
          className="text-sm gap-2"
        >
          <action.Icon className="w-4 h-4" />
          {action.label}
        </Button>
      ))}
    </div>
  );
}