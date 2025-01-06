import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

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

  // Extract currency information from the country data
  const currencies = country.currencies
    ? Object.entries(country.currencies).map(([currencyCode, details]) => ({
        code: currencyCode,
        name: details.name,
        symbol: details.symbol,
      }))
    : [];

  return (
    <div className="p-4">
      <Link to="/" className="text-blue-500 underline">Back</Link>
      <h1 className="text-2xl font-bold">{country.name.common}</h1>
      <img src={country.flags.png} alt={country.name.common} />
      <p>Population: {country.population.toLocaleString()}</p>
      <p>Region: {country.region}</p>
      <p>Sub-Region: {country.subregion}</p>
      <p>Capital: {country.capital?.[0]}</p>
      <p>Languages: {Object.values(country.languages || {}).join(", ")}</p>
      <p>Official Country Name: {country.name.official}</p>
      <h2 className="text-xl font-bold mt-4 mb-2">Currency:</h2>
      {currencies.length > 0 ? (
        <ul>
          {currencies.map((currency) => (
            <li key={currency.code}>
              <strong>{currency.name}</strong> ({currency.symbol}) - Currency Symbol:{" "}
              {currency.code}
            </li>
          ))}
        </ul>
      ) : (
        <p>No currency information available.</p>
      )}
    </div>
    
  );
}

export default CountryPage;
