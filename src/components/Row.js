import React, { useState } from 'react';
import { Text, TouchableOpacity, View, Platform } from 'react-native';

import styled from 'styled-components';
const HtmlRowComponent = styled.tr`
`;

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
  const cssHover = htmlTable && !styles?.hover;

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

  const RowComponent = htmlTable ? HtmlRowComponent : View;

  return (
    <>
      {cssHover && (
        <style>
          {`.preflight-table-row:hover{background-color: #f0f0f0}`}
        </style>
      )}
      <RowComponent
        className="preflight-table-row"
        style={style}
        onMouseEnter={cssHover ? undefined : () => setHover(true)}
        onMouseLeave={cssHover ? undefined : () => setHover(false)}
      >
        {
          shownColumns.map(options => {
            const { key, width } = options;
            let { cellStyle } = options;

            let showHiddenButton;

            if (hiddenColumns.length && !foundFirst) {
              if (htmlTable) {
                showHiddenButton = (
                  <span
                    onClick={() => setShowHidden(!showHidden)}
                    style={{paddingRight: 6, cursor: 'pointer'}}
                  >
                    {showHidden ? '⊖' : '⊕'}
                  </span>
                );
              } else {
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
            }

            cellStyle = {...defaultCellStyle, ...cellStyle};
            if (!foundFirst) {
              cellStyle.borderLeftWidth = 0;

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

          const hiddenColumnsView = (
            <View key={key} style={hiddenStyle}>
              <View style={hiddenLabelStyle}>
                <Text style={{fontWeight: 'bold'}}>{label}</Text>
              </View>
              <View style={hiddenCellStyle}>
                {renderContent({ entry, options, styles })}
              </View>
            </View>
          );

          if (htmlTable) {
            return (
              <tr key={key}>
                <td colSpan={shownColumns.length}>
                  {hiddenColumnsView}
                </td>
              </tr>
            );
          } else {
            return hiddenColumnsView;
          }
        })
      }
    </>
  );
};

export default Row;
