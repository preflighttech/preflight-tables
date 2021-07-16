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

  const style = containerStyle(styles, width);

  drag(drop(ref));

  if (htmlTable) {
    style.paddingTop = style.paddingVertical;
    style.paddingBottom = style.paddingVertical;
    style.paddingLeft = style.paddingHorizontal;

    return (
      <th ref={ref} style={style} onClick={e => updateOrder(key, e.shiftKey)}>
        <TitleLabel {...props} />
        <TitleArrow {...props} />
      </th>
    );
  } else {
    return (
      <div ref={ref} style={style} onClick={() => updateOrder(key)}>
        <TitleLabel {...props} />
        <TitleArrow {...props} />
      </div>
    );
  }
};

export default DraggableTitle;
