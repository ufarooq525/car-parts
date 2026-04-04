import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import { getMakes, getModels, getYears, YearRange } from '../../api/vehicles';
import styles from './VehicleSelector.module.css';

interface VehicleSelectorProps {
  onSearch?: (make: string, model: string, year: string) => void;
}

const VehicleSelector: React.FC<VehicleSelectorProps> = ({ onSearch }) => {
  const navigate = useNavigate();

  const [makes, setMakes] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [years, setYears] = useState<YearRange[]>([]);

  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  const [loadingMakes, setLoadingMakes] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  const [loadingYears, setLoadingYears] = useState(false);

  useEffect(() => {
    setLoadingMakes(true);
    getMakes()
      .then(setMakes)
      .catch(() => {})
      .finally(() => setLoadingMakes(false));
  }, []);

  useEffect(() => {
    if (selectedMake) {
      setSelectedModel('');
      setSelectedYear('');
      setModels([]);
      setYears([]);
      setLoadingModels(true);
      getModels(selectedMake)
        .then(setModels)
        .catch(() => {})
        .finally(() => setLoadingModels(false));
    }
  }, [selectedMake]);

  useEffect(() => {
    if (selectedMake && selectedModel) {
      setSelectedYear('');
      setYears([]);
      setLoadingYears(true);
      getYears(selectedMake, selectedModel)
        .then(setYears)
        .catch(() => {})
        .finally(() => setLoadingYears(false));
    }
  }, [selectedMake, selectedModel]);

  const handleSearch = () => {
    if (onSearch) {
      onSearch(selectedMake, selectedModel, selectedYear);
    } else {
      const params = new URLSearchParams();
      if (selectedMake) params.set('make', selectedMake);
      if (selectedModel) params.set('model', selectedModel);
      if (selectedYear) params.set('year', selectedYear);
      navigate(`/products?${params.toString()}`);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.selectGroup}>
        <label className={styles.label}>Make</label>
        <select
          className={styles.select}
          value={selectedMake}
          onChange={(e) => setSelectedMake(e.target.value)}
          disabled={loadingMakes}
        >
          <option value="">{loadingMakes ? 'Loading...' : 'Select Make'}</option>
          {makes.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.selectGroup}>
        <label className={styles.label}>Model</label>
        <select
          className={styles.select}
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          disabled={!selectedMake || loadingModels}
        >
          <option value="">{loadingModels ? 'Loading...' : 'Select Model'}</option>
          {models.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.selectGroup}>
        <label className={styles.label}>Year</label>
        <select
          className={styles.select}
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          disabled={!selectedModel || loadingYears}
        >
          <option value="">{loadingYears ? 'Loading...' : 'Select Year'}</option>
          {years.map((y) => (
            <option key={`${y.year_from}-${y.year_to}`} value={String(y.year_from)}>
              {y.year_from === y.year_to ? y.year_from : `${y.year_from} - ${y.year_to}`}
            </option>
          ))}
        </select>
      </div>

      <button
        className={styles.searchBtn}
        onClick={handleSearch}
        disabled={!selectedMake}
      >
        <FiSearch />
        Search Parts
      </button>
    </div>
  );
};

export default VehicleSelector;
