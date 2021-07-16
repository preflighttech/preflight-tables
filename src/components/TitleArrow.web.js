import React from 'react';
import { Text, View } from 'react-native';
import './TitleArrow.css';

const TitleArrow = ({ order, styles, canSort, columnKey: key }) => {
  const direction = order && order.find(item => item?.key === key)?.direction;

  let arrow = '-';
  let arrowColor = 'transparent';
  let className = 'title-arrow';

  if ('asc' === direction) {
    arrow = '↑';
    arrowColor = 'green';
    className = 'title-arrow sort-asc';
  } else if ('desc' === direction) {
    arrow = '↓';
    arrowColor = 'red';
    className = 'title-arrow sort-desc';
  } else if (canSort) {
    arrow = '↕';
    arrowColor = 'gray';
    className = 'title-arrow sort';
  }

  const style = {
    fontWeight: 'bold',
    ...styles?.label,
    paddingLeft: 10,
    fontSize: '0.8em',
    color: arrowColor,
    ...styles?.arrowStyle,
  }

  return <i className={className} style={style}></i>;
};

export default TitleArrow;
