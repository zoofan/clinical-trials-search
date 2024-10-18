"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import SearchBar from './components/SearchBar';
import CheckboxFilter from './components/CheckboxFilter';
import SortToggle from './components/SortToggle';
import LoadingIndicator from './components/LoadingIndicator';
import NoResultsMessage from './components/NoResultsMessage';
import TrialCard from './components/TrialCard';

export default function Trials() {
  const [trials, setTrials] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [includeCompleted, setIncludeCompleted] = useState(false);
  const [sortOrder, setSortOrder] = useState('desc');
  const [isLoading, setIsLoading] = useState(false);

  const fetchTrials = async (query = '', includeCompleted = false, sort = sortOrder) => {
    setIsLoading(true);
    try {
      const status = includeCompleted ? 'COMPLETED' : 'ALL';
      const response = await fetch(
        `/api/trials?q=${encodeURIComponent(query)}&status=${encodeURIComponent(
          status
        )}&sort=${encodeURIComponent(sort)}`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setTrials(data);
    } catch (error) {
      console.error('Error fetching trials:', error);
      setTrials([]); // Optionally, clear trials on error
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTrials();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const debouncedFetchTrials = useCallback(
    debounce((query, includeCompleted, sort) => {
      fetchTrials(query, includeCompleted, sort);
    }, 500),
    [includeCompleted, sortOrder]
  );

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    debouncedFetchTrials(query, includeCompleted, sortOrder);
  };

  const handleCheckboxChange = (event) => {
    const checked = event.target.checked;
    setIncludeCompleted(checked);
    fetchTrials(searchQuery, checked, sortOrder);
  };

  const handleSortOrderToggle = () => {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newSortOrder);
    fetchTrials(searchQuery, includeCompleted, newSortOrder);
  };

  return (
    <div className="container mx-auto p-4 bg-blue-50 min-h-screen">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-4 text-center text-blue-700">
        Clinical Trials Search
      </h1>

      {/* Search Bar */}
      <SearchBar value={searchQuery} onChange={handleSearch} />

      {/* Include Only Completed Studies Checkbox */}
      <CheckboxFilter
        checked={includeCompleted}
        onChange={handleCheckboxChange}
        label="Include only completed studies"
      />

      {/* Sort Order Toggle */}
      <SortToggle sortOrder={sortOrder} onToggle={handleSortOrderToggle} />

      {/* Loading Indicator */}
      {isLoading && <LoadingIndicator />}

      {/* No Trials Found Message */}
      {!isLoading && trials.length === 0 && (
        <NoResultsMessage message="No trials found. Please try a different search query." />
      )}

      {/* Trials List */}
      {!isLoading && trials.length > 0 && (
        <div className="space-y-4">
          {trials.map((trial) => (
            <TrialCard key={trial.protocolSection.identificationModule.nctId} trial={trial} />
          ))}
        </div>
      )}
    </div>
  );
}