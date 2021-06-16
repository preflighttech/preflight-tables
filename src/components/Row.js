import React, { useState } from 'react';
import { Text, TouchableOpacity, View, Platform } from 'react-native';

const renderContent = ({ entry, options, styles }) => {
  let { content, value: getValue } = options;

  if (!content) {
    if ('web' === Platform.OS) {
      content = ({value}) => <span style={styles?.content}>{value}</span>;
    } else {
      content = ({value}) => <Text style={styles?.content}>{value}</Text>;
    }
  }

  let valueToRender = entry[options.key];
  if (getValue) {
    valueToRender = getValue({ entry, value: valueToRender });
  }

  let rendered = content({ entry, value: valueToRender });

  if ('string' === typeof rendered) {
    if ('web' === Platform.OS) {
      rendered = <span style={styles?.content}>{rendered}</span>;
    } else {
      rendered = <Text style={styles?.content}>{rendered}</Text>;
    }
  }

  return rendered;
};

const Row = ({ entry, columns, index, dimensions, styles, htmlTable }) => {
  const [hover, setHover] = useState(false);
  const [showHidden, setShowHidden] = useState(false);

  let style = {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    borderBottomStyle: 'solid',
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
    borderLeftStyle: 'solid',
    paddingHorizontal: 8,
    paddingVertical: 8,
    ...styles?.cell,
  };

  const hiddenStyle = {
    flexDirection: 'row',
    paddingVertical: 6,
  };

  const hiddenLabelStyle = {
    flex: 1,
    maxWidth: 260,
    paddingHorizontal: 22,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    ...styles?.hiddenLabel,
  };

  const hiddenCellStyle = {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  };

  let foundFirst = false;

  const shownColumns = [];
  const hiddenColumns = [];

  columns.forEach(options => {
    const { minViewportWidth } = options;

    if (options.hidden) {
      // Ignore
    } else if ((dimensions?.width || 999999999) < (minViewportWidth || 0)) {
      hiddenColumns.push(options);
    } else {
      shownColumns.push(options);
    }
  });

  const RowComponent = htmlTable ?
    ({children, ...props}) => <tr {...props}>{children}</tr> : View;

  return (
    <>
      <RowComponent
        style={style}
        onMouseEnter={ () => setHover(true) }
        onMouseLeave={ () => setHover(false) }
      >
        {
          shownColumns.map(options => {
            const { key, width } = options;
            let { cellStyle } = options;

            let showHiddenButton;

            if (hiddenColumns.length && !foundFirst) {
              showHiddenButton = (
                <TouchableOpacity onPress={() => setShowHidden(!showHidden)}>
                  <View style={{paddingHorizontal: 6}}>
                    <Text style={{fontWeight: 'bold'}}>
                      {showHidden ? '⊖' : '⊕'}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            }

            cellStyle = {...defaultCellStyle, ...cellStyle};
            if (!foundFirst) {
              delete cellStyle.borderLeftWidth;

              // TODO Build a better way to keep showHiddenButton inline.
              cellStyle.flexDirection = 'row';
              foundFirst = true;
            }

            if (width) {
              cellStyle.flex = 0;
              cellStyle.flexBasis = width;
            }

            if (htmlTable) {
              cellStyle.paddingLeft = cellStyle.paddingHorizontal;
              cellStyle.paddingRight = cellStyle.paddingHorizontal;
              cellStyle.paddingTop = cellStyle.paddingVertical;
              cellStyle.paddingBottom = cellStyle.paddingVertical;

              return (
                <td key={key} style={cellStyle}>
                  {showHiddenButton}
                  {renderContent({ entry, options, styles })}
                </td>
              );
            } else {
              return (
                <View style={cellStyle} key={key}>
                  {showHiddenButton}
                  {renderContent({ entry, options, styles })}
                </View>
              );
            }
          })
        }
      </RowComponent>

      {
        showHidden && hiddenColumns.map(options => {
          const { key, label } = options;
          let { content, cellStyle } = options;
          cellStyle = {...hiddenCellStyle, ...cellStyle};

          return (
            <View key={key} style={hiddenStyle}>
              <View style={hiddenLabelStyle}>
                <Text style={{fontWeight: 'bold'}}>{label}</Text>
              </View>
              <View style={hiddenCellStyle}>
                {renderContent({ entry, options, styles })}
              </View>
            </View>
          );
        })
      }
    </>
  );
};

export default Row;
