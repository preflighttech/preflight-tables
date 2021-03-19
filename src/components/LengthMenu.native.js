import React, { useState } from 'react';
import { View, Text, TouchableHighlight } from 'react-native';

import SelectInput from './inputs/SelectInput';

const LengthMenu = ({pageLength, updateEntries, options}) => {
  const [showSelect, setShowSelect] = useState(false);

  return (
    <View>
      <TouchableHighlight onPress={() => setShowSelect(!showSelect)}>
        <Text>Show {pageLength || 'All'} Entries</Text>
      </TouchableHighlight>
      {
        showSelect &&
          <SelectInput
            value={pageLength}
            onChange={ value => updateEntries({newPageLength: parseInt(value)}) }
            options={
              options.map(length => {
                return ({ value: parseInt(length) || 0, label: length});
              })
            }
          />
      }
    </View>
  );
};

export default LengthMenu;
