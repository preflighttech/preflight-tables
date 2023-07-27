import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { useLazyQuery } from '@apollo/client';
import Table from './components/Table';
import { pageCount } from './functions/pagination';
import { useDefaults } from './Context';

export const Gql = props => {
  const {
    query,
    queryName,
    entriesName,
    columns,
    lengthMenu,
    paginationLinks,
    queryVariables,
    dataUpdated,
    setRefetch,
    setSettings,
    movableColumns,
    styles,
    component,
    buttons,
    htmlTable,
    disableSearch,
    alwaysSort,
    multiSort,
    refetch,
    copyComponent,
    initialLoadComponent,
    isLoadingComponent,
    pageLength: initialPageLength,
  } = useDefaults(props);

  const [variables, setVariables] = useState();
  const [entries, setEntries] = useState([]);
  const [count, setCount] = useState(0);
  const [order, setOrder] = useState();
  const [page, setPage] = useState(0);
  const [pageLength, setPageLength] = useState(
    'All' === initialPageLength ? 0 : (initialPageLength || 10)
  );
  const [searchTerm, setSearchTerm] = useState();
  const [called, setCalled] = useState(false);
  const [initialLoadCompleted, setInitialLoadCompleted] = useState(false);

  const [getData, { loading, data, error }] = useLazyQuery(query, {
    fetchPolicy: 'network-only',
    onCompleted: newData => {
      if (dataUpdated) {
        dataUpdated(newData);
      }
    }
  });

  const updateEntries = options => {
    const { newPage, newPageLength, newSearchTerm, newVariables } = options;
    let { newOrder } = options;

    let limit = undefined === newPageLength ? pageLength : newPageLength;
    if (0 === limit) { limit = null; }

    const offset = (undefined === newPage ? page : newPage) * limit;

    const search = undefined === newSearchTerm ? searchTerm : newSearchTerm;

    const tableVariables = { limit, offset, search };

    if (multiSort) {
      tableVariables.order = undefined === newOrder ? order : newOrder;
    } else {
      if (newOrder) {
        tableVariables.sort = newOrder[0] ? newOrder[0].key : undefined;
        tableVariables.sortDirection =
          newOrder[0] ? newOrder[0].direction : undefined;
      } else {
        tableVariables.sort = order[0] ? order[0].key : undefined;
        tableVariables.sortDirection =
          order[0] ? order[0].direction : undefined;
      }
    }

    getData(
      {
        variables: {
          ...tableVariables,
          ...(newVariables || variables || {})
        }
      }
    );

    if (undefined !== newVariables) { setVariables(newVariables) };
    if (undefined !== newOrder) { setOrder(newOrder); }
    if (undefined !== newPage) { setPage(newPage); }
    if (undefined !== newPageLength) { setPageLength(newPageLength); }
    if (undefined !== newSearchTerm) { setSearchTerm(newSearchTerm); }

    if (setSettings) {
      setSettings({search, order: (newOrder || order)});
    }
  };

  if (!order) {
    const newOrder = [];
    columns.forEach(column => {
      if ('asc' === column.sort) {
        newOrder.push({ key: column.key, direction: 'asc' });
      } else if ('desc' === column.sort) {
        newOrder.push({ key: column.key, direction: 'desc' });
      }
    });

    setOrder(newOrder);
    if (setSettings) { setSettings({order: newOrder}) }
  }

  if (!called && !data && order) {
    setCalled(true);
    updateEntries({ newVariables: queryVariables });
  }

  useEffect(() => {
    setRefetch(() => () => updateEntries({ newVariables: queryVariables }));
  }, []);

  if (data && JSON.stringify(queryVariables) !== JSON.stringify(variables)) {
    updateEntries({ newVariables: queryVariables });
  }

  if (data && data[queryName]) {
    // Save entries and count to state to avoid jumpiness when updateEntries
    // fetches new data (due to table rows disappearing).
    const dataEntries = data[queryName][entriesName || 'entries'];

    if (JSON.stringify(dataEntries) !== JSON.stringify(entries)) {
      setEntries(dataEntries);
    }

    if (data[queryName].count != count) {
      setCount(data[queryName].count)

      const maxPage = pageCount(data[queryName].count, pageLength) - 1;
      if (maxPage < page) {
        updateEntries({ newPage: maxPage });
      }
    }
  }

  if (!initialLoadCompleted) {
    if (data) { setInitialLoadCompleted(true); }

    return (
      <View>
        { initialLoadComponent || <Text>Loading...</Text> }
      </View>
    )
  }

  return (
    <>
      {
        error &&
          <View style={{borderWidth: 2, borderColor: 'red'}}>
            <Text style={{fontSize: 18}}>Error: {error.message}</Text>
          </View>
      }
      <Table
        entries={entries}
        columns={columns}
        order={order}
        updateEntries={updateEntries}
        page={page}
        count={count}
        lengthMenu={lengthMenu}
        pageLength={pageLength}
        paginationLinks={paginationLinks}
        searchTerm={searchTerm}
        movableColumns={movableColumns}
        styles={styles}
        component={component}
        buttons={buttons}
        htmlTable={htmlTable}
        disableSearch={disableSearch}
        alwaysSort={alwaysSort}
        multiSort={multiSort}
        isLoading={loading}
        isLoadingComponent={isLoadingComponent}
        copyComponent={copyComponent}
        refetch={
          false === refetch ? false :
          () => {
            setEntries([]); updateEntries({});
          }
        }
      />
    </>
  );
};

export default Gql;
