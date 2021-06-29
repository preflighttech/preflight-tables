import React from 'react';
import { Text, TouchableWithoutFeedback, View } from 'react-native';

export const TitleLabel = ({label, styles}) => {
  const style = {
    fontWeight: 'bold',
    fontSize: 16,
    ...styles?.label,
  }

  return <Text style={style}>{label}</Text>;
};

export const TitleArrow = ({ order, styles, canSort, columnKey: key }) => {
  const sort = order && order.find(item => item?.key === key)?.sort;

  let arrow = '';
  let arrowColor = 'gray';

  if ('asc' === sort) {
    arrow = '↑';
    arrowColor = 'green';
  } else if ('desc' === sort) {
    arrow = '↓';
    arrowColor = 'red';
  } else if (canSort) {
    arrow = '↕';
  }

  const style = {
    fontWeight: 'bold',
    ...styles?.label,
    paddingHorizontal: 10,
    color: arrowColor,
    ...styles?.arrowStyle,
  }

  return <Text style={style}>{arrow}</Text>;
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
