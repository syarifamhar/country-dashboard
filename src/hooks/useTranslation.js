import { useLanguage } from '../contexts/LanguageContext';
import { en } from '../translations/en';
import { id } from '../translations/id';

export const useTranslation = () => {
  const { language } = useLanguage();
  
  const t = (key) => {
    const translations = language === 'en' ? en : id;
    return translations[key] || key;
  };

  return { t, language };
}; 