import React, { useState } from 'react';
import { Text } from 'react-native';
import Table from './components/Table';
import { paginatedIndexes, pageCount } from './functions/pagination';
import { valueFor } from './functions/util';

import LengthMenu from './components/LengthMenu';
import Row from './components/Row';

const filteredBySearch = (entries, columns, term) => {
  if (!term) { return entries; }

  term = term.toLowerCase();

  return entries.filter(entry => {
    return columns.filter(({ key, search }) => {
      if (search !== false) {
        const value = valueFor(entry, key, columns);

        if (value && value.toString().toLowerCase().includes(term)) {
          return true;
        }
      }

      return false;
    }).length;
  });
}

const paginated = (entries, page, pageLength) => {
  const [startIndex, endIndex] = paginatedIndexes(
    entries.length, page, pageLength
  );

  return entries && entries.slice(startIndex, endIndex);
}

const sorted = ({ entries, order, columns }) => {
  return [...entries].sort((entry, other) => {
    let entryResult = 0;

    order.some(({ key, sort }) => {
      let entryValue = valueFor(entry, key, columns);
      let otherValue = valueFor(other, key, columns);

      if ('string' === typeof entryValue) {
        entryValue = entryValue.toLowerCase();
      }

      if ('string' === typeof otherValue) {
        otherValue = otherValue.toLowerCase();
      }

      if (entryValue === otherValue) {
        return false;
      } else {
        let result = entryValue < otherValue ? -1 : 1;

        if (typeof entryValue === 'undefined' || entryValue === null) {
          result = -1;
        } else if (typeof otherValue === 'undefined' || otherValue === null) {
          result = 1;
        }

        entryResult = 'asc' === sort ? result : (result * -1);
        return true;
      }
    });

    return entryResult;
  });
};

export const Simple = (props) => {
  const {
    data,
    columns,
    lengthMenu,
    setSettings,
    movableColumns,
    styles,
    component,
    buttons,
    htmlTable,
    disableSearch,
    multiSort,
    refetch,
    pageLength: initialPageLength,
  } = props;

  const [loadedData, setLoadedData] = useState();
  const [entries, setEntries] = useState({ filtered: [], visible: [] });
  const [order, setOrder] = useState();
  const [page, setPage] = useState(0);
  const [pageLength, setPageLength] = useState(
    'All' === initialPageLength ? 0 : (initialPageLength || 10)
  );
  const [searchTerm, setSearchTerm] = useState();

  if (!data) return <Text>Loading...</Text>;

  const updateEntries = options => {
    let { newOrder, newPage, newPageLength, newSearchTerm } = options;

    if (!multiSort && typeof newOrder !== 'undefined') {
      newOrder = newOrder.slice(0, 1);
    }

    const search =
      typeof newSearchTerm !== 'undefined' ? newSearchTerm : searchTerm;
    const filtered = filteredBySearch(data, columns, search);

    const maxPage =
      pageCount(filtered.length, (newPageLength || pageLength)) - 1;

    if (maxPage < (newPage || page)) {
      newPage = maxPage;
    }

    const visible = paginated(
      sorted({ columns, entries: filtered, order: (newOrder || order) }),
      (newPage === undefined ? page : newPage),
      (newPageLength  === undefined ? pageLength : newPageLength)
    );

    setEntries({ filtered, visible });

    if (data != loadedData) { setLoadedData(data); }
    if (typeof newOrder !== 'undefined') { setOrder(newOrder); }
    if (typeof newPage !== 'undefined') { setPage(newPage); }
    if (typeof newPageLength !== 'undefined') { setPageLength(newPageLength); }
    if (typeof newSearchTerm !== 'undefined') { setSearchTerm(newSearchTerm); }

    if (setSettings) {
      setSettings({search, order: (newOrder || order)});
    }
  };

  if (!order) {
    const newOrder = [];
    columns.forEach(column => {
      if ('asc' === column.sort) {
        newOrder.push({ key: column.key, sort: 'asc' });
      } else if ('desc' === column.sort) {
        newOrder.push({ key: column.key, sort: 'desc' });
      }
    });

    setOrder(newOrder);
  }

  if (data && order && data != loadedData) {
    updateEntries({});
  }

  return (
    <Table
      entries={entries.visible}
      columns={columns}
      order={order}
      updateEntries={updateEntries}
      page={page}
      count={entries.filtered.length}
      lengthMenu={lengthMenu}
      pageLength={pageLength}
      searchTerm={searchTerm}
      movableColumns={movableColumns}
      styles={styles}
      component={component}
      htmlTable={htmlTable}
      disableSearch={disableSearch}
      buttons={buttons}
      refetch={refetch}
    />
  );
};

export default Simple;
