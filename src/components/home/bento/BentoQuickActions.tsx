import { Button } from "@/components/ui/button";
import { CookingPot, Globe, Link, ClipboardPaste } from "lucide-react";

interface QuickAction {
  label: string;
  icon: React.ComponentType;
  onClick: () => void;
}

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
  const quickActions: QuickAction[] = [
    {
      label: "What's in your kitchen?",
      icon: CookingPot,
      onClick: onKitchenClick
    },
    {
      label: "Explore cuisines",
      icon: Globe,
      onClick: onCuisineClick
    },
    {
      label: "Import from URL",
      icon: Link,
      onClick: onUrlClick
    },
    {
      label: "Paste from clipboard",
      icon: ClipboardPaste,
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
          <action.icon className="w-4 h-4" />
          {action.label}
        </Button>
      ))}
    </div>
  );
}