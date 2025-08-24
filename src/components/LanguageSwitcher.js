import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

function LanguageSwitcher() {
  const { toggleLanguage, isEnglish, isIndonesian } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-xl hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-300 shadow-sm hover:shadow-md"
      title={isEnglish ? 'Ganti ke Bahasa Indonesia' : 'Switch to English'}
    >
      <span className="text-sm font-medium">
        {isIndonesian ? '🇮🇩 ID' : '🇺🇸 EN'}
      </span>
      <svg 
        className="w-4 h-4" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" 
        />
      </svg>
    </button>
  );
}

export default LanguageSwitcher; 