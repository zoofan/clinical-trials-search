import React from 'react';

const CheckboxFilter = ({ checked, onChange, label }) => {
  return (
    <div className="flex justify-center mb-8">
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="form-checkbox h-5 w-5 text-blue-600"
        />
        <span className="text-blue-700 text-lg">{label}</span>
      </label>
    </div>
  );
};

export default CheckboxFilter;