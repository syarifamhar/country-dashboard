import React from "react";

function SubRegionFilter({ subRegions, selectedSubRegion, setSubRegion }) {
  return (
    <select
      value={selectedSubRegion}
      onChange={(e) => setSubRegion(e.target.value)}
      className="p-2 border rounded w-full md:w-1/2"
    >
      <option value="">All Sub-Regions</option>
      {subRegions.map((subRegion, index) => (
        <option key={index} value={subRegion}>
          {subRegion}
        </option>
      ))}
    </select>
  );
}

export default SubRegionFilter;
