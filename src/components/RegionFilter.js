import React from "react";
import { useTranslation } from "../hooks/useTranslation";
import { translateRegion } from "../utils/regionTranslations";

function RegionFilter({ setRegion }) {
  const { t, language } = useTranslation();

  return (
    <select
      onChange={(e) => setRegion(e.target.value)}
      className="p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
    >
      <option value="">{t('filterByRegions')}</option>
      <option value="Africa">{translateRegion('Africa', language)}</option>
      <option value="Asia">{translateRegion('Asia', language)}</option>
      <option value="Europe">{translateRegion('Europe', language)}</option>
      <option value="Oceania">{translateRegion('Oceania', language)}</option>
      <option value="Americas">{translateRegion('Americas', language)}</option>
    </select>
  );
}

export default RegionFilter;
