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

  return (
    <div className="p-4">
      <Link to="/" className="text-blue-500 underline">Back</Link>
      <h1 className="text-2xl font-bold">{country.name.common}</h1>
      <img src={country.flags.png} alt={country.name.common} />
      <p>Population: {country.population.toLocaleString()}</p>
      <p>Region: {country.region}</p>
      <p>Capital: {country.capital?.[0]}</p>
      <p>Languages: {Object.values(country.languages || {}).join(", ")}</p>
    </div>
  );
}

export default CountryPage;
