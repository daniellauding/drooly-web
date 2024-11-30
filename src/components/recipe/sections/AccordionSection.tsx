import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface AccordionSectionProps {
  value: string;
  title: string;
  errors?: string[];
  children: React.ReactNode;
}

export function AccordionSection({ value, title, errors, children }: AccordionSectionProps) {
  return (
    <AccordionItem value={value} className="border rounded-lg">
      <AccordionTrigger className="px-4">
        <div className="flex items-center gap-2">
          <span>{title}</span>
          {errors?.length > 0 && (
            <AlertCircle className="h-4 w-4 text-destructive" />
          )}
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4">
        {errors?.length > 0 && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>
              <ul className="list-disc pl-4">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}
        {children}
      </AccordionContent>
    </AccordionItem>
  );
}