import { useEffect, useState } from "react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const COOKING_METHODS = [
  "Baking",
  "Frying",
  "Grilling",
  "Boiling",
  "Steaming",
  "Roasting",
  "Sautéing",
  "Slow Cooking",
  "Pressure Cooking",
  "Smoking",
  "Braising",
  "Air Frying"
];

interface CookingMethodsSliderProps {
  onMethodSelect: (method: string | null) => void;
  selectedMethod: string | null;
}

export function CookingMethodsSlider({ onMethodSelect, selectedMethod }: CookingMethodsSliderProps) {
  const [autoplay, setAutoplay] = useState(true);

  // Stop autoplay when a method is selected
  useEffect(() => {
    if (selectedMethod) {
      setAutoplay(false);
    }
  }, [selectedMethod]);

  return (
    <div className="w-full mb-6">
      <Carousel 
        opts={{
          align: "start",
          loop: true,
          skipSnaps: false,
          containScroll: "trimSnaps"
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2">
          {COOKING_METHODS.map((method) => (
            <CarouselItem key={method} className="pl-2 basis-auto">
              <Button
                variant="outline"
                onClick={() => onMethodSelect(selectedMethod === method ? null : method)}
                className={cn(
                  "whitespace-nowrap",
                  selectedMethod === method && "bg-primary text-primary-foreground"
                )}
              >
                {method}
              </Button>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}