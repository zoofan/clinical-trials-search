import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const SearchBar = ({ value, onChange }) => {
  return (
    <div className="flex justify-center mb-8">
      <div className="relative w-full md:w-2/3 lg:w-1/2">
        <FontAwesomeIcon
          icon={faSearch}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-2xl"
        />
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder="Search by title or keywords..."
          className="w-full p-4 pl-14 border border-blue-300 rounded-full focus:outline-none focus:ring-4 focus:ring-blue-500 text-xl text-gray-800 shadow-lg"
        />
      </div>
    </div>
  );
};

export default SearchBar;