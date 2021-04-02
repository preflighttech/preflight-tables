import React, { useState } from 'react';
import { Text } from 'react-native';
import { useLazyQuery } from '@apollo/client';
import Table from './components/Table';
import { pageCount } from './functions/pagination';

export const Gql = (props) => {
  const {
    query,
    queryName,
    entriesName,
    columns,
    lengthMenu,
    queryVariables,
    dataUpdated,
    movableColumns,
    styles,
    component,
    buttons,
    pageLength: initialPageLength,
  } = props;

  const [variables, setVariables] = useState();
  const [entries, setEntries] = useState([]);
  const [count, setCount] = useState(0);
  const [order, setOrder] = useState();
  const [page, setPage] = useState(0);
  const [pageLength, setPageLength] = useState(initialPageLength || 10);
  const [searchTerm, setSearchTerm] = useState();
  const [called, setCalled] = useState(false);

  const [getData, { loading, data, error }] = useLazyQuery(query, {
    onCompleted: data => {
      if (dataUpdated) {
        dataUpdated(data);
      }
    }
  });

  const updateEntries = options => {
    const {
      newOrder, newPage, newPageLength, newSearchTerm, newVariables
    } = options;

    const limit = newPageLength === undefined ? pageLength : newPageLength;
    const offset = (newPage === undefined ? page : newPage) * limit;

    let sort = order[0] ? order[0].key : undefined;
    let sortDirection = order[0] ? order[0].sort : undefined;

    if (newOrder) {
       sort = newOrder[0] ? newOrder[0].key : undefined;
       sortDirection = newOrder[0] ? newOrder[0].sort : undefined;
    }

    getData(
      {
        variables: {
          limit, offset, sort, sortDirection,
          search: (newSearchTerm || searchTerm),
          ...(newVariables || variables || {})
        }
      }
    );

    if (typeof newVariables !== 'undefined') { setVariables(newVariables) };
    if (typeof newOrder !== 'undefined') { setOrder([newOrder[0]]); }
    if (typeof newPage !== 'undefined') { setPage(newPage); }
    if (typeof newPageLength !== 'undefined') { setPageLength(newPageLength); }
    if (typeof newSearchTerm !== 'undefined') { setSearchTerm(newSearchTerm); }
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

  if (!called && !data && order) {
    setCalled(true);
    updateEntries({ newVariables: queryVariables });
  }

  if (data && JSON.stringify(queryVariables) != JSON.stringify(variables)) {
    updateEntries({ newVariables: queryVariables });
  }

  if (data && data[queryName]) {
    // Save entries and count to state to avoid jumpiness when updateEntries
    // fetches new data (due to table rows disappearing).

    const dataIds =
      data[queryName][entriesName || 'entries'].map(entry => entry.id);

    const entryIds = entries.map(entry => entry.id);

    if (JSON.stringify(dataIds) != JSON.stringify(entryIds)) {
      setEntries(data[queryName][entriesName || 'entries'])
    }

    if (data[queryName].count != count) {
      setCount(data[queryName].count)

      const maxPage = pageCount(data[queryName].count, pageLength) - 1;
      if (maxPage < page) {
        updateEntries({ newPage: maxPage });
      }
    }
  }

  return (
    <Table
      entries={entries}
      columns={columns}
      order={order}
      updateEntries={updateEntries}
      page={page}
      count={count}
      lengthMenu={lengthMenu}
      pageLength={pageLength}
      searchTerm={searchTerm}
      movableColumns={movableColumns}
      styles={styles}
      component={component}
      buttons={buttons}
      isLoading={loading}
    />
  );
};

export default Gql;
