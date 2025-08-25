// Region and Sub-region translation mappings
const regionTranslations = {
  en: {
    'Africa': 'Africa',
    'Asia': 'Asia',
    'Europe': 'Europe',
    'Oceania': 'Oceania',
    'Americas': 'Americas',
    'Antarctic': 'Antarctic'
  },
  id: {
    'Africa': 'Afrika',
    'Asia': 'Asia',
    'Europe': 'Eropa',
    'Oceania': 'Oseania',
    'Americas': 'Amerika',
    'Antarctic': 'Antarktika'
  }
};

const subRegionTranslations = {
  en: {
    'Northern Africa': 'Northern Africa',
    'Southern Europe': 'Southern Europe',
    'South-Eastern Asia': 'South-Eastern Asia',
    'South America': 'South America',
    'Caribbean': 'Caribbean',
    'North America': 'North America',
    'Western Asia': 'Western Asia',
    'Northern Europe': 'Northern Europe',
    'Central Europe': 'Central Europe',
    'Southern Asia': 'Southern Asia',
    'Eastern Africa': 'Eastern Africa',
    'Polynesia': 'Polynesia',
    'Middle Africa': 'Middle Africa',
    'Eastern Europe': 'Eastern Europe',
    'Western Africa': 'Western Africa',
    'Southern Africa': 'Southern Africa',
    'Western Europe': 'Western Europe',
    'Micronesia': 'Micronesia',
    'Central Asia': 'Central Asia',
    'Central America': 'Central America',
    'Australia and New Zealand': 'Australia and New Zealand',
    'Eastern Asia': 'Eastern Asia',
    'Southeast Europe': 'Southeast Europe',
    'Melanesia': 'Melanesia'
  },
  id: {
    'Northern Africa': 'Afrika Utara',
    'Southern Europe': 'Eropa Selatan',
    'South-Eastern Asia': 'Asia Tenggara',
    'South America': 'Amerika Selatan',
    'Caribbean': 'Karibia',
    'North America': 'Amerika Utara',
    'Western Asia': 'Asia Barat',
    'Northern Europe': 'Eropa Utara',
    'Central Europe': 'Eropa Tengah',
    'Southern Asia': 'Asia Selatan',
    'Eastern Africa': 'Afrika Timur',
    'Polynesia': 'Polinesia',
    'Middle Africa': 'Afrika Tengah',
    'Eastern Europe': 'Eropa Timur',
    'Western Africa': 'Afrika Barat',
    'Southern Africa': 'Afrika Selatan',
    'Western Europe': 'Eropa Barat',
    'Micronesia': 'Mikronesia',
    'Central Asia': 'Asia Tengah',
    'Central America': 'Amerika Tengah',
    'Australia and New Zealand': 'Australia dan Selandia Baru',
    'Eastern Asia': 'Asia Timur',
    'Southeast Europe': 'Eropa Tenggara',
    'Melanesia': 'Melanesia'
  }
};

// Function to translate region names
export const translateRegion = (regionName, language) => {
  if (!regionName) return '';
  
  const translations = regionTranslations[language] || regionTranslations.en;
  return translations[regionName] || regionName;
};

// Function to translate sub-region names
export const translateSubRegion = (subRegionName, language) => {
  if (!subRegionName) return '';
  
  const translations = subRegionTranslations[language] || subRegionTranslations.en;
  return translations[subRegionName] || subRegionName;
};

// Function to get all available regions in the specified language
export const getTranslatedRegions = (language) => {
  const translations = regionTranslations[language] || regionTranslations.en;
  return Object.values(translations);
};

// Function to get all available sub-regions in the specified language
export const getTranslatedSubRegions = (language) => {
  const translations = subRegionTranslations[language] || subRegionTranslations.en;
  return Object.values(translations);
}; 