import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Utensils, Globe, Link, ClipboardCopy } from "lucide-react";

export function SearchExamples() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button
          variant="outline"
          className="h-auto py-8 flex flex-col items-center gap-4"
          onClick={() => {}}
        >
          <Utensils className="h-8 w-8" />
          <div className="text-center">
            <h3 className="font-semibold">{t('home.kitchen.action')}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {t('home.kitchen.description')}
            </p>
          </div>
        </Button>

        <Button
          variant="outline"
          className="h-auto py-8 flex flex-col items-center gap-4"
          onClick={() => {}}
        >
          <Globe className="h-8 w-8" />
          <div className="text-center">
            <h3 className="font-semibold">{t('home.cuisines.action')}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {t('home.cuisines.description')}
            </p>
          </div>
        </Button>

        <Button
          variant="outline"
          className="h-auto py-8 flex flex-col items-center gap-4"
          onClick={() => {}}
        >
          <Link className="h-8 w-8" />
          <div className="text-center">
            <h3 className="font-semibold">{t('home.import.url.action')}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {t('home.import.url.description')}
            </p>
          </div>
        </Button>

        <Button
          variant="outline"
          className="h-auto py-8 flex flex-col items-center gap-4"
          onClick={() => {}}
        >
          <ClipboardCopy className="h-8 w-8" />
          <div className="text-center">
            <h3 className="font-semibold">{t('home.import.clipboard.action')}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {t('home.import.clipboard.description')}
            </p>
          </div>
        </Button>
      </div>
    </div>
  );
}