import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

export function LanguageSelector() {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();

  console.log('Current language:', i18n.language);
  console.log('Available languages:', i18n.languages);
  console.log('Loaded namespaces:', i18n.reportNamespaces?.());

  const handleLanguageChange = (value: string) => {
    console.log('Changing language to:', value);
    i18n.changeLanguage(value);
    
    toast({
      title: t('common.language'),
      description: `Language changed to ${value === 'en' ? 'English' : 'Swedish'}`
    });
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="language-select">{t('common.language')}</Label>
      <Select value={i18n.language} onValueChange={handleLanguageChange}>
        <SelectTrigger id="language-select">
          <SelectValue placeholder={t('common.language')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">{t('languages.en')}</SelectItem>
          <SelectItem value="sv">{t('languages.sv')}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}