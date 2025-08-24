import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "@fortawesome/fontawesome-free/css/all.css"; // Import Font Awesome CSS
import { useTranslation } from "../hooks/useTranslation";

// Custom Marker using Font Awesome
const CustomIcon = L.divIcon({
  html: '<i class="fas fa-map-marker-alt" style="font-size: 2rem; color: red;"></i>',
  className: "custom-marker",
  iconSize: [30, 42],
  iconAnchor: [15, 42], // Center of the icon
  popupAnchor: [0, -42], // Popup position relative to the icon
});

function CountryPage() {
  const { name } = useParams();
  const { t } = useTranslation();
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
      <div className="p-4 flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-800 dark:text-gray-200">{t('loadingCountryInfo')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">{t('errorLoadingCountry')}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <Link to="/" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
            {t('backToHome')}
          </Link>
        </div>
      </div>
    );
  }

  if (!country) {
    return (
      <div className="p-4 flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="text-gray-500 dark:text-gray-400 text-6xl mb-4">❓</div>
          <h2 className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-2">{t('countryNotFound')}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{t('countryNotFoundDesc')}</p>
          <Link to="/" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
            {t('backToHome')}
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
    country.capitalInfo?.latlng || country.latlng || [0, 0]; // Fallback to country center if capitalInfo is unavailable

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <Link to="/" className="text-blue-500 dark:text-blue-400 underline hover:text-blue-700 dark:hover:text-blue-300">{t('backToHome')}</Link>
      
      <div className="mt-6">
        <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-200">{country.name?.common || t('unknown')}</h1>
        
        {country.flags?.png && (
          <img
            src={country.flags.png}
            alt={`${country.name?.common || t('unknown')} flag`}
            className="my-4 max-w-md rounded-lg shadow-lg"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <p><strong>{t('population')}:</strong> {country.population ? country.population.toLocaleString() : t('unknown')}</p>
            <p><strong>{t('region')}:</strong> {country.region || t('unknown')}</p>
            <p><strong>{t('subRegion')}:</strong> {country.subregion || t('unknown')}</p>
            <p><strong>{t('capital')}:</strong> {country.capital?.[0] || t('unknown')}</p>
            <p><strong>{t('languages')}:</strong> {country.languages ? Object.values(country.languages).join(", ") : t('unknown')}</p>
            <p><strong>{t('officialCountryName')}:</strong> {country.name?.official || t('unknown')}</p>
          </div>
          
          <div>
            <h2 className="text-xl font-bold mb-3">{t('currency')}:</h2>
            {currencies.length > 0 ? (
              <ul className="space-y-2">
                {currencies.map((currency) => (
                  <li key={currency.code} className="p-2 bg-gray-50 rounded">
                    <strong>{currency.name}</strong> ({currency.symbol}) - {currency.code}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">{t('noCurrencyInfo')}</p>
            )}
          </div>
        </div>

        <h2 className="text-xl font-bold mt-8 mb-4">{t('map')}:</h2>
        <div className="my-4 border rounded-lg overflow-hidden">
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
                {country.name?.common || t('unknown')} - {country.capital?.[0] || t('unknown')}
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

export default CountryPage;