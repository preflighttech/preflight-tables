import React, { useState, useEffect, useRef } from 'react';
import {
  Dimensions, View, Text, TouchableOpacity, Platform
} from 'react-native';

import Header from './Header';
import Row from './Row';
import Pagination from './Pagination';
import LengthMenu from './LengthMenu';

import { paginatedIndexes, pageCount } from '../functions/pagination';
import { formattedNumber } from '../functions/util';

import StringInput from './inputs/StringInput';

const Table = props => {
  const {
    entries,
    columns,
    order,
    updateEntries,
    page,
    count,
    lengthMenu,
    pageLength,
    paginationLinks,
    searchTerm,
    styles,
    movableColumns,
    component,
    componentProps,
    buttons,
    isLoading,
    htmlTable,
    disableSearch,
    alwaysSort,
    multiSort,
    refetch,
    isLoadingComponent,
  } = props;

  let copyComponent = props.copyComponent;

  const tableRef = useRef(null);

  const currentColumnKeys = columns.map(column => column.key);

  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [columnKeys, setColumnKeys] = useState([...currentColumnKeys]);
  const [columnOrder, setColumnOrder] = useState([...currentColumnKeys]);

  const orderedColumns =
    columnOrder.map(key => columns.find(column => column.key === key));

  const updateDimensions = () => {
    setDimensions(Dimensions.get('window'));
  };

  useEffect(() => (window.onresize = updateDimensions), []);

  // If columns have been added/removed, need to reset order, or else the
  // columns won't update.
  if (JSON.stringify(currentColumnKeys) !== JSON.stringify(columnKeys)) {
    setColumnKeys([...currentColumnKeys]);
    setColumnOrder([...currentColumnKeys]);
  }

  /**
   * @param {string} key - Column key.
   * @param {boolean} append - True to append to order.
   */
  const updateOrder = (key, append) => {
    if ('prevent' === columns.find(column => column.key === key).sort) {
      return false;
    }

    const oldDirection =
      order.find(orderData => orderData?.key === key)?.direction;

    let newOrder;

    if (multiSort && append) {
      if ('asc' === oldDirection) {
        newOrder = [...order];
        newOrder.find(orderData => orderData?.key === key).direction = 'desc';
      } else if ('desc' === oldDirection) {
        newOrder = order.filter(orderData => orderData?.key !== key);
      } else {
        newOrder = [...order, { key, direction: 'asc' }];
      }
    } else {
      if ('asc' === oldDirection) {
        newOrder = [{ key, direction: 'desc' }];
      } else if ('desc' === oldDirection) {
        newOrder = [];
      } else {
        newOrder = [{ key, direction: 'asc' }];
      }
    }

    if (0 === newOrder.length && alwaysSort) {
      newOrder = [{ key, direction: 'asc' }];
    }

    updateEntries({ newOrder });
  };

  const moveColumn = (dragIndex, dropIndex) => {
    const element = columnOrder[dragIndex];
    columnOrder.splice(dragIndex, 1);
    columnOrder.splice(dropIndex, 0, element);

    setColumnOrder([...columnOrder]);
  };

  const search = newSearchTerm => {
    updateEntries({ newSearchTerm });
  };

  const [pageStart, pageEnd] = paginatedIndexes(count, page, pageLength);
  const paginationData =
    `${formattedNumber(pageStart + 1)}-${formattedNumber(pageEnd)} of ` +
    formattedNumber(count);
  const numberOfPages = pageCount(count, pageLength);

  const copyToClipboard = () => {
    const range = document.createRange();
    const selection = window.getSelection();
    selection.removeAllRanges();
    range.selectNode(tableRef.current);
    selection.addRange(range);
    document.execCommand('copy');
  };

  if (component) {
    const Component = component;

    return (
      <Component
        pageLength={pageLength}
        updateEntries={updateEntries}
        lengthMenu={lengthMenu}
        searchTerm={searchTerm}
        search={search}
        orderedColumns={orderedColumns}
        dimensions={dimensions}
        movableColumns={movableColumns}
        moveColumn={moveColumn}
        order={order}
        updateOrder={updateOrder}
        styles={styles}
        entries={entries}
        page={page}
        numberOfPages={numberOfPages}
        paginationData={paginationData}
        isLoading={isLoading}
        buttons={buttons}
        {...componentProps}
      />
    );
  }

  const tableStyle = {
    marginTop: 8,
    ...styles?.table,
  };

  const searchStyle = {
    flexDirection: 'row',
    alignItems: 'baseline',
    ...styles?.search?.container,
  };

  const functionRowStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    ...styles?.functionRow,
  }

  const HtmlTableComponent = ({children, ...props}) => (
    <table ref={tableRef} {...props}>{children}</table>
  );

  const HtmlTbodyComponent = ({children, ...props}) => (
    <tbody {...props}>{children}</tbody>
  );

  const showPagination = lengthMenu || pageLength ? true : undefined;

  let topPagination = showPagination;
  let bottomPagination = showPagination;

  if ('top' === paginationLinks) { bottomPagination = false; }
  if ('bottom' === paginationLinks) { topPagination = false; }

  const htmlTableAndWeb = (htmlTable && 'web' === Platform.OS)
  const TableComponent = htmlTableAndWeb ?  HtmlTableComponent : View;
  const TableBodyComponent =
    htmlTableAndWeb ? HtmlTbodyComponent : React.Fragment;

  if (htmlTableAndWeb) {
    if (!tableStyle.width) {
      tableStyle.width = '100%';
    }
  }

  const refetchComponent = (typeof refetch === 'function') ?
    (
      <TouchableOpacity onPress={refetch}>
        <View style={{paddingHorizontal: 6}}>
          <Text style={{fontWeight: 'bold'}}>↻</Text>
        </View>
      </TouchableOpacity>
    ) : refetch;

  if (copyComponent) {
    copyComponent = (
      <TouchableOpacity onPress={copyToClipboard}>
        {true === copyComponent ? (
          <View style={{paddingHorizontal: 6}}>
            <Text style={{fontWeight: 'bold', fontSize: 20, marginTop: -5}}>
              ⎘
            </Text>
          </View>
        ) : copyComponent
        }
      </TouchableOpacity>
    )
  }

  return (
    <>
      <View style={functionRowStyle}>
        <View style={{flexDirection: 'row'}}>
          <Text>{formattedNumber(count)} entries</Text>
          {refetchComponent}
          {htmlTableAndWeb && copyComponent}
        </View>

        {
          topPagination &&
            <Pagination
              page={page}
              numberOfPages={numberOfPages}
              onPageChange={ newPage => updateEntries({ newPage }) }
              styles={styles?.pagination}
            />
        }
      </View>

      <View style={functionRowStyle}>
        {
          lengthMenu && lengthMenu.length > 1 &&
            <LengthMenu
              pageLength={pageLength}
              updateEntries={updateEntries}
              options={lengthMenu}
            />
        }

        {
          isLoading && (
            isLoadingComponent || (
              <View style={{paddingHorizontal: 10}}>
                <Text style={{fontWeight: 'bold', fontSize: 16}}>
                  Updating Data...
                </Text>
              </View>
            )
          )
        }

        { buttons }

        <View style={searchStyle}>
          {
            disableSearch ?
              null
            :
              <>
                <Text>Search</Text>
                <View style={{paddingHorizontal: 6}}>
                  <StringInput
                    value={searchTerm || ''}
                    onChange={value => search(value)}
                  />
                </View>
              </>
          }
        </View>
      </View>

      <TableComponent style={tableStyle}>
        <Header
          columns={orderedColumns}
          dimensions={dimensions}
          movableColumns={movableColumns}
          moveColumn={moveColumn}
          order={order}
          updateOrder={updateOrder}
          styles={styles?.header}
          htmlTable={htmlTableAndWeb}
        />

        <TableBodyComponent>
          {
            entries.map((entry, index) => {
              return (
                <Row
                  key={entry.id}
                  entry={entry}
                  columns={orderedColumns}
                  index={index}
                  dimensions={dimensions}
                  styles={styles?.data}
                  htmlTable={htmlTableAndWeb}
                />
              );
            })
          }
        </TableBodyComponent>

      </TableComponent>

      {
        bottomPagination &&
          <Pagination
            page={page}
            numberOfPages={numberOfPages}
            onPageChange={ newPage => updateEntries({ newPage }) }
            label={paginationData}
            styles={styles?.pagination}
          />
      }
    </>
  );
};

export default Table;
