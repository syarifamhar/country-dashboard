import React from "react";
import { Link } from "react-router-dom";

function CountryCard({ country }) {
  return (
    <Link to={`/country/${country.name.common}`}>
      <div className="p-4 border rounded hover:shadow-lg">
        <img
          src={country.flags.png}
          alt={country.name.common}
          className="w-full h-32 object-cover rounded"
        />
        <h2 className="text-lg font-bold mt-2">{country.name.common}</h2>
        <p>Population: {country.population.toLocaleString()}</p>
        <p>Region: {country.region}</p>
        <p>Capital: {country.capital?.[0]}</p>
      </div>
    </Link>
  );
}

export default CountryCard;
