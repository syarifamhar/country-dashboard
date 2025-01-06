import React, { useState, useEffect } from "react";
import CountryCard from "../components/CountryCard";
import RegionFilter from "../components/RegionFilter";
import SubRegionFilter from "../components/SubRegionFilter";

function HomePage() {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState(""); // State for selected region
  const [subRegion, setSubRegion] = useState(""); // State for selected sub-region
  const [sortOrder, setSortOrder] = useState(""); // State for sorting
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all")
      .then((response) => response.json())
      .then((data) => setCountries(data))
      .catch((error) => console.error(error));
  }, []);

  // Get unique sub-regions based on selected region
  const subRegions = countries
    .filter((country) => (region ? country.region === region : true))
    .map((country) => country.subregion)
    .filter((value, index, self) => value && self.indexOf(value) === index);

  // Filter and sort countries
  const filteredCountries = countries
    .filter((country) => {
      const matchesSearch = country.name.common
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesRegion = region ? country.region === region : true;
      const matchesSubRegion = subRegion
        ? country.subregion === subRegion
        : true;
      return matchesSearch && matchesRegion && matchesSubRegion;
    })
    .sort((a, b) => {
      if (sortOrder === "A-Z") {
        return a.name.common.localeCompare(b.name.common);
      }
      if (sortOrder === "Z-A") {
        return b.name.common.localeCompare(a.name.common);
      }
      return 0; // No sorting
    });

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

  return (
    <div className="p-4">
      <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
        <input
          type="text"
          placeholder="Search for a country..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded w-full md:w-1/4"
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
          className="p-2 border rounded w-full md:w-1/4"
        >
          <option value="">Sort by</option>
          <option value="A-Z">Alphabetical (A-Z)</option>
          <option value="Z-A">Alphabetical (Z-A)</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {currentCountries.map((country) => (
          <CountryCard key={country.cca3} country={country} />
        ))}
      </div>
      <div className="flex justify-center mt-6">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`px-4 py-2 mx-1 rounded ${
              currentPage === index + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
