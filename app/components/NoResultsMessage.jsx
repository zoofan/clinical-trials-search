import React from 'react';

const NoResultsMessage = ({ message }) => {
  return (
    <div className="flex justify-center items-center mb-4">
      <span className="text-blue-700">{message}</span>
    </div>
  );
};

export default NoResultsMessage;