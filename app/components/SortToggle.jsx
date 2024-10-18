import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons';

const SortToggle = ({ sortOrder, onToggle }) => {
  return (
    <div className="flex justify-end mb-8 pr-4">
      <div className="flex items-center space-x-2">
        <span className="text-blue-700 text-sm">Sort by Completion Date:</span>
        <button
          onClick={onToggle}
          className="focus:outline-none"
          aria-label={`Sort ${sortOrder === 'asc' ? 'ascending' : 'descending'}`}
        >
          <FontAwesomeIcon
            icon={sortOrder === 'asc' ? faCaretUp : faCaretDown}
            className="text-blue-700 text-xl"
          />
        </button>
      </div>
    </div>
  );
};

export default SortToggle;