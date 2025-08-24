import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  // Simple state without localStorage for now to eliminate potential issues
  const [language, setLanguage] = useState('id'); // Default to Indonesian

  const toggleLanguage = () => {
    try {
      setLanguage(prev => prev === 'en' ? 'id' : 'en');
    } catch (error) {
      console.error('Error toggling language:', error);
      // Fallback to Indonesian if there's an error
      setLanguage('id');
    }
  };

  const value = {
    language,
    toggleLanguage,
    isEnglish: language === 'en',
    isIndonesian: language === 'id'
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}; 