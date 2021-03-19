import React, { useState } from 'react';
import { Text, View } from 'react-native';

const Row = ({ entry, columns, index, dimensions, styles }) => {
  const [hover, setHover] = useState(false);

  let style = {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    paddingHorizontal: 16,
    ...styles?.container,
  }

  if (index % 2 === 0) {
    style = {
      ...style,
      backgroundColor: '#f0f0f0',
      ...styles?.alternate,
    };
  }

  if (hover) {
    style = {
      ...style,
      backgroundColor: '#f0f0f0',
      ...styles?.hover,
    };
  }

  const defaultCellStyle = {
    flex: 1,
    borderLeftWidth: 1,
    borderLeftColor: 'lightgray',
    paddingHorizontal: 8,
    paddingVertical: 8,
    ...styles?.cell,
  };

  let foundFirst = false;

  return (
    <View
      style={style}
      onMouseEnter={ () => setHover(true) }
      onMouseLeave={ () => setHover(false) }
    >
      {
        columns.map(({ key, content, minViewportWidth, width }) => {
          if ((dimensions?.width || 999999999) < (minViewportWidth || 0)) {
            return null;
          }

          const cellStyle = {...defaultCellStyle};
          if (!foundFirst) {
            delete cellStyle.borderLeftWidth;
            foundFirst = true;
          }

          if (width) {
            cellStyle.flex = 0;
            cellStyle.flexBasis = width;
          }

          if (!content) {
            content = ({value}) => <Text style={styles?.content}>{value}</Text>;
          }

          return (
            <View style={cellStyle} key={key}>
              { content({ value: entry[key] }) }
            </View>
          )
        })
      }
    </View>
  );
};

export default Row;
