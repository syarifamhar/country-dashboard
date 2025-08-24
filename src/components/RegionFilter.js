import React from "react";
import { useTranslation } from "../hooks/useTranslation";

function RegionFilter({ setRegion }) {
  const { t } = useTranslation();

  return (
    <select
      onChange={(e) => setRegion(e.target.value)}
      className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    >
      <option value="">{t('filterByRegions')}</option>
      <option value="Africa">{t('africa')}</option>
      <option value="Asia">{t('asia')}</option>
      <option value="Europe">{t('europe')}</option>
      <option value="Oceania">{t('oceania')}</option>
      <option value="Americas">{t('americas')}</option>
    </select>
  );
}

export default RegionFilter;
