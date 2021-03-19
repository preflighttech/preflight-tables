import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { TitleLabel, TitleArrow, containerStyle } from './Title';

const DraggableTitle = props => {
  const {
    index, styles, updateOrder, moveColumn, width, columnKey: key
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

  style.paddingTop = style.paddingVertical;
  style.paddingLeft = style.paddingHorizontal;

  drag(drop(ref));

  return (
    <div ref={ref} style={style} onClick={() => updateOrder(key)}>
      <TitleLabel {...props} />
      <TitleArrow {...props} />
    </div>
  );
};

export default DraggableTitle;
