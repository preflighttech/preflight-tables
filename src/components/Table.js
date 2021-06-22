import React, { useState, useEffect } from 'react';
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
    searchTerm,
    styles,
    movableColumns,
    component,
    buttons,
    isLoading,
    htmlTable,
    disableSearch,
    refetch,
    isLoadingComponent,
  } = props;

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

  const updateOrder = key => {
    if ('prevent' === columns.find(column => column.key === key).sort) {
      return false;
    }

    const oldSort = order.find(orderData => orderData?.key === key)?.sort
    let newSort = 'asc';

    if ('asc' === oldSort) {
      newSort = 'desc';
    } else if ('desc' === oldSort) {
      newSort = false;
    }

    const newOrder = order.filter(orderData => orderData?.key !== key );

    if (newSort) {
      newOrder.unshift({ key, sort: newSort });
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
  }

  const showPagination = lengthMenu || pageLength ? true : undefined;

  const htmlTableAndWeb = (htmlTable && 'web' === Platform.OS)
  const TableComponent = htmlTableAndWeb ?
    ({children, ...props}) => <table {...props}>{children}</table> :
    View;
  const TableBodyComponent = htmlTableAndWeb ?
    ({children, ...props}) => <tbody {...props}>{children}</tbody> :
    React.Fragment;

  if (htmlTableAndWeb) {
    if (!tableStyle.width) {
      tableStyle.width = '100%';
    }
  }

  const refetchComponent = (typeof refetch === 'function') ?
    (
      <TouchableOpacity onPress={() => refetch()}>
        <View style={{paddingHorizontal: 6}}>
          <Text style={{fontWeight: 'bold'}}>↻</Text>
        </View>
      </TouchableOpacity>
    ) : refetch;

  return (
    <>
      <View style={functionRowStyle}>
        <View style={{flexDirection: 'row'}}>
          <Text>{formattedNumber(count)} entries</Text>
          {refetchComponent}
        </View>

        {
          showPagination &&
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
        showPagination &&
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
