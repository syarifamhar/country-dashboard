import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import CountryCard from "../components/CountryCard";
import RegionFilter from "../components/RegionFilter";
import SubRegionFilter from "../components/SubRegionFilter";
import LanguageSwitcher from "../components/LanguageSwitcher";
import ThemeSwitcher from "../components/ThemeSwitcher";
import { useTranslation } from "../hooks/useTranslation";
function HomePage() {
  const { t } = useTranslation();
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("");
  const [subRegion, setSubRegion] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 12;

  // Fetch countries only once on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch("https://restcountries.com/v3.1/all?fields=name,flags,population,region,subregion,capital,cca3");
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (Array.isArray(data)) {
          setCountries(data);
        } else {
          throw new Error('Invalid data format received');
        }
      } catch (error) {
        console.error('Error fetching countries:', error);
        setError('Failed to load countries. Please try again later.');
        setCountries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []); // Empty dependency array - only run once

  // Get unique sub-regions
  const subRegions = countries && Array.isArray(countries) 
    ? countries
        .filter((country) => (region ? country.region === region : true))
        .map((country) => country.subregion)
        .filter((value, index, self) => value && self.indexOf(value) === index)
    : [];

  // Filter and sort countries
  const filteredCountries = countries && Array.isArray(countries)
    ? countries
        .filter((country) => {
          const matchesSearch = country.name?.common
            ?.toLowerCase()
            ?.includes(search.toLowerCase()) ?? true;
          const matchesRegion = region ? country.region === region : true;
          const matchesSubRegion = subRegion
            ? country.subregion === subRegion
            : true;
          return matchesSearch && matchesRegion && matchesSubRegion;
        })
        .sort((a, b) => {
          if (sortOrder === "A-Z") {
            return (a.name?.common ?? '').localeCompare(b.name?.common ?? '');
          }
          if (sortOrder === "Z-A") {
            return (b.name?.common ?? '').localeCompare(a.name?.common ?? '');
          }
          return 0;
        })
    : [];

  // Pagination logic
  const totalItems = filteredCountries.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCountries = filteredCountries.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, region, subRegion, sortOrder]);

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-800 dark:text-gray-200">{t('loadingCountries')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">{t('errorLoadingCountries')}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            {t('tryAgain')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <div className="flex flex-wrap justify-between items-center mb-8 gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm dark:shadow-gray-900/50">
        <input
          type="text"
          placeholder={t('searchPlaceholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-3 border border-gray-300 dark:border-gray-600 rounded-xl w-full md:w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
        />
        <RegionFilter setRegion={setRegion} />
        <SubRegionFilter
          subRegions={subRegions}
          selectedSubRegion={subRegion}
          setSubRegion={setSubRegion}
        />
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="p-3 border border-gray-300 dark:border-gray-600 rounded-xl w-full md:w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
        >
          <option value="">{t('sortBy')}</option>
          <option value="A-Z">{t('alphabeticalAZ')}</option>
          <option value="Z-A">{t('alphabeticalZA')}</option>
        </select>

        {/* Theme and Language Switchers */}
        <div className="flex items-center gap-4">
          <ThemeSwitcher />
          <LanguageSwitcher />
          
          {/* Link to the game */}
          <Link to="/flag-game">
            <button className="p-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors duration-300 shadow-sm hover:shadow-md">
              {t('playFlagGame')}
            </button>
          </Link>
        </div>
      </div>

      {filteredCountries.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400 text-lg">{t('noCountriesFound')}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {currentCountries.map((country) => (
              <CountryCard key={country.cca3} country={country} />
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-4 py-2 mx-1 rounded-xl transition-all duration-200 ${
                    currentPage === index + 1
                      ? "bg-blue-500 text-white shadow-md"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default HomePage;
