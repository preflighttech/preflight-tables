import React from 'react';
import { View } from 'react-native';
import DraggableTitle from './DraggableTitle';
import Title from './Title';

const Header = props => {
  const {
    columns, dimensions, movableColumns, moveColumn, order, updateOrder, styles,
    htmlTable
  } = props;

  const style = {
    flexDirection: 'row',
    minHeight: 40,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderTopWidth: 1,
    borderTopColor: 'lightgray',
    borderTopStyle: 'solid',
    ...styles?.container,
  };

  const TitleComponent = movableColumns ? DraggableTitle : Title;

  const children = columns
    .filter((options) => !options.hidden)
    .map((options, index) => {

    const { label, key, minViewportWidth, sort, width, headerStyle } = options;

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
        htmlTable={htmlTable}
        headerStyle={headerStyle}
      />
    );
  });

  if (htmlTable) {
    return (
      <thead>
        <tr style={style}>
          { children }
        </tr>
      </thead>
    );
  } else {
    return (
      <View style={style}>
        { children }
      </View>
    );
  }
};

export default Header;
