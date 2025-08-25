import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../hooks/useTranslation';

function ThemeSwitcher() {
  const { toggleTheme, isLight } = useTheme();
  const { t } = useTranslation();

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center justify-center w-12 h-12 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-500 shadow-sm hover:shadow-md overflow-hidden group"
      title={isLight ? t('switchToDarkMode') : t('switchToLightMode')}
    >
      {/* Sun Icon - Light Mode */}
      <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
        isLight 
          ? 'opacity-100 scale-100 rotate-0' 
          : 'opacity-0 scale-75 -rotate-90'
      }`}>
        <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      </div>

      {/* Moon Icon - Dark Mode */}
      <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
        !isLight 
          ? 'opacity-100 scale-100 rotate-0' 
          : 'opacity-0 scale-75 rotate-90'
      }`}>
        <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      </div>

      {/* Text Label - Animated */}
      <div className={`absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs font-medium transition-all duration-500 ${
        isLight 
          ? 'opacity-100 translate-y-0 text-yellow-600 dark:text-yellow-400' 
          : 'opacity-100 translate-y-0 text-blue-600 dark:text-blue-400'
      }`}>
        {isLight ? t('lightMode') : t('darkMode')}
      </div>
    </button>
  );
}

export default ThemeSwitcher; 