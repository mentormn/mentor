'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, translations } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: keyof typeof translations.en) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'mn',
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key) => translations.mn[key] || translations.en[key] || key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('mn');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mentor_mn_lang') as Language;
      if (saved && (saved === 'mn' || saved === 'en')) {
        setLanguageState(saved);
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mentor_mn_lang', lang);
    }
  };

  const toggleLanguage = () => {
    const next = language === 'mn' ? 'en' : 'mn';
    setLanguage(next);
  };

  const t = (key: keyof typeof translations.en): string => {
    const currentDict = translations[language];
    if (currentDict && currentDict[key]) {
      return currentDict[key];
    }
    return translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
