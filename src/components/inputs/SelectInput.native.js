import React, { useState } from 'react';
import { Picker } from '@react-native-community/picker';

const SelectInput = ({ value, options, onChange }) => {
  const [selectedValue, setSelectedValue] = useState(value);

  const onValueChange = itemValue => {
    onChange(itemValue);
    setSelectedValue(itemValue);
  };

  return (
    <Picker
      selectedValue={selectedValue}
      onValueChange={onValueChange}
    >
      {
        options.map(option => {
          if (option.label) {
            return (
              <Picker.Item
                key={option.value}
                value={option.value}
                label={option.label.toString()}
              />
            );
          } else {
            return (
              <Picker.Item key={option} label={option} value={option} />
            );
          }
        })
      }
    </Picker>
  );
};

export default SelectInput;
