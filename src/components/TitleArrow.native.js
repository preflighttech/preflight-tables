import React from 'react';
import { Text, View } from 'react-native';

const TitleArrow = ({ order, styles, canSort, columnKey: key }) => {
  const direction = order && order.find(item => item?.key === key)?.direction;

  let arrow = '-';
  let arrowColor = 'transparent';

  if ('asc' === direction) {
    arrow = '↑';
    arrowColor = 'green';
  } else if ('desc' === direction) {
    arrow = '↓';
    arrowColor = 'red';
  } else if (canSort) {
    arrow = '↕';
    arrowColor = 'gray';
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

export default TitleArrow;
