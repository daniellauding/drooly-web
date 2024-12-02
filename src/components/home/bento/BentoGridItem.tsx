import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface BentoBoxProps {
  box: {
    title: string;
    description: string;
    icon: any;
    color: string;
    hoverColor: string;
    textColor: string;
  };
  onClick: () => void;
}

export function BentoGridItem({ box, onClick }: BentoBoxProps) {
  return (
    <Card
      className={cn(
        "p-6 cursor-pointer transition-all duration-200",
        box.color,
        box.hoverColor
      )}
      onClick={onClick}
    >
      <div className="flex flex-col items-center text-center space-y-4">
        <box.icon className={cn("w-8 h-8", box.textColor)} />
        <div>
          <h3 className={cn("font-semibold mb-2", box.textColor)}>
            {box.title}
          </h3>
          <p className={cn("text-sm", box.textColor)}>
            {box.description}
          </p>
        </div>
      </div>
    </Card>
  );
}