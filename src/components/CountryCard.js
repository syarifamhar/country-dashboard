import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "../hooks/useTranslation";

function CountryCard({ country }) {
  const { t } = useTranslation();

  // Add null checks to prevent crashes
  if (!country || !country.name || !country.name.common) {
    return (
      <div className="p-6 border border-gray-200 rounded-2xl bg-gray-50 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
          <span className="text-gray-500 text-xs text-center">No data</span>
        </div>
        <h2 className="text-lg font-bold text-gray-500 text-center mb-2">{t('unknownCountry')}</h2>
        <p className="text-gray-400 text-center text-sm">{t('dataUnavailable')}</p>
      </div>
    );
  }

  return (
    <Link to={`/country/${country.name.common}`}>
      <div className="p-6 border border-gray-200 rounded-2xl bg-white shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 group">
        {/* Circular Flag */}
        <div className="w-24 h-24 mx-auto mb-4 overflow-hidden rounded-full border-4 border-gray-100 shadow-lg group-hover:border-blue-200 transition-colors duration-300">
          <img
            src={country.flags?.png || country.flags?.svg || '/placeholder-flag.svg'}
            alt={country.name.common}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = '/placeholder-flag.svg';
              e.target.onerror = null; // Prevent infinite loop
            }}
          />
        </div>

        {/* Country Name - Centered and Bold */}
        <h2 className="text-xl font-bold text-gray-800 text-center mb-4 group-hover:text-blue-600 transition-colors duration-300">
          {country.name.common}
        </h2>

        {/* Country Information Grid */}
        <div className="space-y-3">
          {/* Capital */}
          <div className="flex items-center justify-between">
            <span className="text-gray-600 text-sm font-medium">{t('capital')}:</span>
            <span className="text-gray-800 font-semibold">
              {country.capital?.[0] || t('unknown')}
            </span>
          </div>

          {/* Region */}
          <div className="flex items-center justify-between">
            <span className="text-gray-600 text-sm font-medium">{t('region')}:</span>
            <span className="text-gray-800 font-semibold">
              {country.region || t('unknown')}
            </span>
          </div>

          {/* Population */}
          <div className="flex items-center justify-between">
            <span className="text-gray-600 text-sm font-medium">{t('population')}:</span>
            <span className="text-gray-800 font-semibold">
              {country.population ? country.population.toLocaleString() : t('unknown')}
            </span>
          </div>
        </div>

        {/* Hover Effect Indicator */}
        <div className="mt-4 text-center">
          <span className="text-blue-500 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {t('clickToViewDetails')}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default CountryCard;
