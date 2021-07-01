import React from 'react';
import { Text, View } from 'react-native';

const TitleArrow = ({ order, styles, canSort, columnKey: key }) => {
  const sort = order && order.find(item => item?.key === key)?.sort;

  let arrow = '-';
  let arrowColor = 'transparent';

  if ('asc' === sort) {
    arrow = '↑';
    arrowColor = 'green';
  } else if ('desc' === sort) {
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
