import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "@fortawesome/fontawesome-free/css/all.css";
import { useTranslation } from "../hooks/useTranslation";
import { translateRegion, translateSubRegion } from "../utils/regionTranslations";

// Custom Marker using Font Awesome
const CustomIcon = L.divIcon({
  html: '<i class="fas fa-map-marker-alt" style="font-size: 2rem; color: red;"></i>',
  className: "custom-marker",
  iconSize: [30, 42],
  iconAnchor: [15, 42],
  popupAnchor: [0, -42],
});

function CountryPage() {
  const { name } = useParams();
  const { t, language } = useTranslation();
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(name)}?fields=name,flags,population,region,subregion,capital,currencies,languages,capitalInfo,latlng`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCountry(data[0]);
        } else {
          throw new Error('Country not found');
        }
      })
      .catch((error) => {
        console.error('Error fetching country:', error);
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [name]);

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-800 dark:text-gray-200">{t('loadingCountryInfo')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">{t('errorLoadingCountry')}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-300 shadow-sm hover:shadow-md">
            <i className="fas fa-chevron-left text-sm"></i>
            {t('back')}
          </Link>
        </div>
      </div>
    );
  }

  if (!country) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="text-center">
          <div className="text-gray-500 dark:text-gray-400 text-6xl mb-4">❓</div>
          <h2 className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-2">{t('countryNotFound')}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{t('countryNotFoundDesc')}</p>
          <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-300 shadow-sm hover:shadow-md">
            <i className="fas fa-chevron-left text-sm"></i>
            {t('back')}
          </Link>
        </div>
      </div>
    );
  }

  // Extract currency information
  const currencies = country.currencies
    ? Object.entries(country.currencies).map(([currencyCode, details]) => ({
        code: currencyCode,
        name: details.name,
        symbol: details.symbol,
      }))
    : [];

  // Marker position: Capital city or country center
  const position =
    country.capitalInfo?.latlng || country.latlng || [0, 0];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header with Back Button */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link 
            to="/" 
            className="inline-flex items-center gap-3 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 shadow-sm hover:shadow-md group"
          >
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300">
              <i className="fas fa-chevron-left text-white text-sm"></i>
            </div>
            <span className="font-medium">{t('back')}</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Country Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {country.name?.common || t('unknown')}
          </h1>
          {country.name?.official && country.name.official !== country.name?.common && (
            <p className="text-lg text-gray-600 dark:text-gray-300 italic">
              {country.name.official}
            </p>
          )}
        </div>

        {/* Flag Section */}
        {country.flags?.png && (
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
              <img
                src={country.flags.png}
                alt={`${country.name?.common || t('unknown')} flag`}
                className="max-w-md rounded-lg border-4 border-gray-100 dark:border-gray-600"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          </div>
        )}

        {/* Country Information Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left Column - Basic Info */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <i className="fas fa-info-circle text-blue-500"></i>
              {t('countryInformation')}
            </h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400 font-medium">{t('population')}:</span>
                <span className="text-gray-900 dark:text-white font-semibold">
                  {country.population ? country.population.toLocaleString() : t('unknown')}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400 font-medium">{t('region')}:</span>
                <span className="text-gray-900 dark:text-white font-semibold">
                  {translateRegion(country.region, language) || t('unknown')}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400 font-medium">{t('subRegion')}:</span>
                <span className="text-gray-900 dark:text-white font-semibold">
                  {translateSubRegion(country.subregion, language) || t('unknown')}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400 font-medium">{t('capital')}:</span>
                <span className="text-gray-900 dark:text-white font-semibold">
                  {country.capital?.[0] || t('unknown')}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400 font-medium">{t('languages')}:</span>
                <span className="text-gray-900 dark:text-white font-semibold text-right max-w-xs">
                  {country.languages ? Object.values(country.languages).join(", ") : t('unknown')}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column - Currency Info */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <i className="fas fa-coins text-yellow-500"></i>
              {t('currency')}
            </h2>
            
            {currencies.length > 0 ? (
              <div className="space-y-3">
                {currencies.map((currency) => (
                  <div key={currency.code} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{currency.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{currency.code}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-gray-900 dark:text-white">{currency.symbol}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <i className="fas fa-exclamation-circle text-gray-400 text-4xl mb-3"></i>
                <p className="text-gray-500 dark:text-gray-400">{t('noCurrencyInfo')}</p>
              </div>
            )}
          </div>
        </div>

        {/* Map Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
            <i className="fas fa-map-marked-alt text-green-500"></i>
            {t('map')}
          </h2>
          
          <div className="border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden">
            <MapContainer
              center={position}
              zoom={5}
              style={{ height: "400px", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={position} icon={CustomIcon}>
                <Popup>
                  <div className="text-center">
                    <strong className="text-gray-900">{country.name?.common || t('unknown')}</strong>
                    <br />
                    <span className="text-gray-600">{country.capital?.[0] || t('unknown')}</span>
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CountryPage;