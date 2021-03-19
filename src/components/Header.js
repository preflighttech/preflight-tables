import React from 'react';
import { View } from 'react-native';
import DraggableTitle from './DraggableTitle';
import Title from './Title';

const Header = props => {
  const {
    columns, dimensions, movableColumns, moveColumn, order, updateOrder, styles
  } = props;

  const style = {
    flexDirection: 'row',
    height: 40,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderTopColor: 'lightgray',
    ...styles?.container,
  };

  const TitleComponent = movableColumns ? DraggableTitle : Title;

  return (
    <View style={style}>
      {
        columns.map((options, index) => {
          const { label, key, minViewportWidth, sort, width } = options;

          if ((dimensions?.width || 999999999) < (minViewportWidth || 0)) {
            return null;
          }

          return (
            <TitleComponent
              label={label}
              key={key}
              columnKey={key}
              order={order}
              canSort={'prevent' !== sort}
              index={index}
              moveColumn={moveColumn}
              updateOrder={updateOrder}
              styles={styles}
              width={width}
            />
          );
        })
      }
    </View>
  );
};

export default Header;
