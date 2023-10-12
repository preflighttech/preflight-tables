import React from 'react';
import { Pressable, Text, View } from 'react-native';

const TitleArrow = props => {
  const {
    order, styles, canSort, sortOnArrowClickOnly, updateOrder, columnKey: key
  } = props;

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

  if (sortOnArrowClickOnly) {
    return (
      <Pressable onPress={() => updateOrder(key, true)}>
        <Text style={style}>{arrow}</Text>
      </Pressable>
    );
  } else {
    return <Text style={style}>{arrow}</Text>;
  }
};

export default TitleArrow;
