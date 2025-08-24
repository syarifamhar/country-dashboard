import React from "react";
import { useTranslation } from "../hooks/useTranslation";

function SubRegionFilter({ subRegions, selectedSubRegion, setSubRegion }) {
  const { t } = useTranslation();

  // Add null check for subRegions
  if (!subRegions || !Array.isArray(subRegions)) {
    return (
      <select
        value=""
        disabled
        className="p-3 border border-gray-300 rounded-xl w-full md:w-1/2 bg-gray-100 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">{t('loading')}...</option>
      </select>
    );
  }

  return (
    <select
      value={selectedSubRegion}
      onChange={(e) => setSubRegion(e.target.value)}
      className="p-3 border border-gray-300 rounded-xl w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    >
      <option value="">{t('allSubRegions')}</option>
      {subRegions.map((subRegion, index) => (
        <option key={index} value={subRegion}>
          {subRegion}
        </option>
      ))}
    </select>
  );
}

export default SubRegionFilter;
