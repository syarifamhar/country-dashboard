import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "@fortawesome/fontawesome-free/css/all.css"; // Import Font Awesome CSS

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
  const [country, setCountry] = useState(null);

  useEffect(() => {
    fetch(`https://restcountries.com/v3.1/name/${name}`)
      .then((response) => response.json())
      .then((data) => setCountry(data[0]))
      .catch((error) => console.error(error));
  }, [name]);

  if (!country) return <p>Loading...</p>;

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
    <div className="p-4">
      <Link to="/" className="text-blue-500 underline">Back</Link>
      <h1 className="text-2xl font-bold">{country.name.common}</h1>
      <img
        src={country.flags.png}
        alt={`${country.name.common} flag`}
        className="my-4"
      />
      <p><strong>Population:</strong> {country.population.toLocaleString()}</p>
      <p><strong>Region:</strong> {country.region}</p>
      <p><strong>Sub-Region:</strong> {country.subregion}</p>
      <p><strong>Capital:</strong> {country.capital?.[0]}</p>
      <p><strong>Languages:</strong> {Object.values(country.languages || {}).join(", ")}</p>
      <p><strong>Official Country Name:</strong> {country.name.official}</p>
      
      <h2 className="text-xl font-bold mt-4 mb-2">Currency:</h2>
      {currencies.length > 0 ? (
        <ul>
          {currencies.map((currency) => (
            <li key={currency.code}>
              <strong>{currency.name}</strong> ({currency.symbol}) - Currency Code: {currency.code}
            </li>
          ))}
        </ul>
      ) : (
        <p>No currency information available.</p>
      )}

      <h2 className="text-xl font-bold mt-6 mb-2">Map:</h2>
      <div className="my-4">
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
              {country.name.common} - {country.capital?.[0]}
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}

export default CountryPage;