import React from 'react';

const LoadingIndicator = () => {
  return (
    <div className="flex justify-center items-center mb-4">
      <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-500 border-solid"></div>
      <span className="ml-2 text-blue-700">Loading...</span>
    </div>
  );
};

export default LoadingIndicator;