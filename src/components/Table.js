import React, { useState, useEffect } from 'react';
import { Dimensions, View, Text } from 'react-native';

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
  } = props;

  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [columnOrder, setColumnOrder] =
    useState(columns.map(column => column.key));

  const orderedColumns =
    columnOrder.map(key => columns.find(column => column.key === key));

  const updateDimensions = () => {
    setDimensions(Dimensions.get('window'));
  };

  useEffect(() => (window.onresize = updateDimensions), []);

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
    paddingTop: 10,
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

  return (
    <>
      <View style={functionRowStyle}>
        <View>
          <Text>{formattedNumber(count)} entries</Text>
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
          isLoading &&
            <View style={{paddingHorizontal: 10}}>
              <Text>Loading...</Text>
            </View>
        }

        { buttons }

        <View style={searchStyle}>
          <Text>Search</Text>
          <View style={{paddingHorizontal: 6}}>
            <StringInput
              value={searchTerm || ''}
              onChange={value => search(value)}
            />
          </View>
        </View>
      </View>

      <View style={tableStyle}>
        <Header
          columns={orderedColumns}
          dimensions={dimensions}
          movableColumns={movableColumns}
          moveColumn={moveColumn}
          order={order}
          updateOrder={updateOrder}
          styles={styles?.header}
        />

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
              />
            );
          })
        }
      </View>

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
