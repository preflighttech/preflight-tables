import React from 'react';
import { TextInput, View } from 'react-native';

const StringInput = ({ value, onChange }) => {
  return (
    <View style={{width: 200, borderWidth: 1}}>
      <TextInput
        value={value}
        onChangeText={onChange}
      />
    </View>
  );
};

export default StringInput;
