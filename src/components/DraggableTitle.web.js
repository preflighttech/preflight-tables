import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { TitleLabel, containerStyle } from './Title';
import TitleArrow from './TitleArrow';

const DraggableTitle = props => {
  const {
    index, styles, updateOrder, moveColumn, width, htmlTable, columnKey: key
  } = props;

  const ref = useRef(null);

  const [, drop] = useDrop({
    accept: 'ui-title',

    hover(item, monitor) {
      if (index === item.index) { return }

      moveColumn(item.index, index);
      item.index = index
    }
  });

  const [{ isDragging }, drag] = useDrag({
    item: { type: 'ui-title', key, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  const style = containerStyle(styles, width);

  const updateOrderWeb = (key, e) => {
    updateOrder(key, e.shiftKey || e.metaKey);
  };

  if (htmlTable) {
    return (
      <th ref={ref} style={style} onClick={e => updateOrderWeb(key, e)}>
        <TitleLabel {...props} />
        <TitleArrow {...props} />
      </th>
    );
  } else {
    return (
      <div ref={ref} style={style} onClick={() => updateOrderWeb(key, e)}>
        <TitleLabel {...props} />
        <TitleArrow {...props} />
      </div>
    );
  }
};

export default DraggableTitle;
