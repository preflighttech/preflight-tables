import React from 'react';

const SelectInput = ({ options, value, onChange }) => {
  return (
    <select
      onChange={ e => onChange(e.target.value) }
      value={value}
    >
      {
        options.map(option => {
          if (option.label) {
            return (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            );
          } else {
            return (
              <option key={option} value={option}>{option}</option>
            );
          }
        })
      }
    </select>
  );
};

export default SelectInput;
