import React from 'react';
import { View, Text } from 'react-native';

import SelectInput from './inputs/SelectInput';

const LengthMenu = ({pageLength, updateEntries, options}) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
      <Text>Show </Text>
      <SelectInput
        value={pageLength}
        onChange={ value => updateEntries({newPageLength: parseInt(value)}) }
        options={
          options.map(length => {
            return ({ value: parseInt(length) || 0, label: length});
          })
        }
      />
      <Text> entries</Text>
    </View>
  );
};

export default LengthMenu;
