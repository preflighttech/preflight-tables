import React from 'react';

const StringInput = ({ value, onChange }) => {
  return (
    <input
      type="text"
      onChange={ e => onChange(e.target.value) }
      value={value || ''}
    />
  );
};

export default StringInput;
