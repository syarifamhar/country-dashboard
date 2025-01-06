import React from "react";

function RegionFilter({ setRegion }) {
  return (
    <select
      onChange={(e) => setRegion(e.target.value)}
      className="p-2 border rounded"
    >
      <option value="">Filter By Regions</option>
      <option value="Africa">Africa</option>
      <option value="Asia">Asia</option>
      <option value="Europe">Europe</option>
      <option value="Oceania">Oceania</option>
      <option value="Americas">Americas</option>
    </select>
  );
}

export default RegionFilter;
