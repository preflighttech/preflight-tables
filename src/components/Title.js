import React from 'react';
import { Text, TouchableWithoutFeedback, View } from 'react-native';
import TitleArrow from './TitleArrow';

export const TitleLabel = ({label, styles}) => {
  const style = {
    fontWeight: 'bold',
    fontSize: 16,
    ...styles?.label,
  }

  return <Text style={style}>{label}</Text>;
};

export const containerStyle = (styles, width) => {
  const style = {
    flex: 1,
    flexDirection: 'row',
    alignContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
    ...styles?.container,
  };

  if (width) {
    style.flex = 0;
    style.flexBasis = width;
  }

  return style;
};

const Title = props => {
  const { styles, updateOrder, width, htmlTable, columnKey: key } = props;

  const style = containerStyle(styles, width);

  if (htmlTable) {
    style.paddingTop = style.paddingVertical;
    style.paddingBottom = style.paddingVertical;
    style.paddingLeft = style.paddingHorizontal;

    return (
      <th style={style} onClick={() => updateOrder(key)}>
        <TitleLabel {...props} />
        <TitleArrow {...props} />
      </th>
    );
  } else {
    return (
      <TouchableWithoutFeedback onPress={() => updateOrder(key)}>
        <View style={style}>
          <TitleLabel {...props} />
          <TitleArrow {...props} />
        </View>
      </TouchableWithoutFeedback>
    );
  }
};

export default Title;
