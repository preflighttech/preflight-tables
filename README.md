## Installation

1. For GraphQL, ensure using @apollo/client >= 3.0.0

2. Install and setup React DND for drag/drop support. This is currently required
   even if you're not using drag/drop.

  - Install "react-dnd": "^11.1.3" (install in components for monorepo)

  - Setup (only if you want to use). In App.js:

    ```javascript
    import { HTML5Backend } from 'react-dnd-html5-backend'
    import { DndProvider } from 'react-dnd'

    // Within component return
    <DndProvider backend={HTML5Backend}>
      // children
    </DndProvider>
    ```

2. Add github packages auth token to .npmrc.
   
   ```
   @preflighttech:registry=https://npm.pkg.github.com/
   //npm.pkg.github.com/:_authToken=519261ec59f88e4fa03e87a39e70105902b1b6aa
   ```

3. Install package.

   ```
   yarn add @preflighttech/preflight-tables

   # For monorepo, install in components package:
   yarn workspace components add @preflighttech/preflight-tables

   # or add to package.json directly, updating version as needed:
   "@preflighttech/preflight-tables": "^0.0.4"
   ```

## Example: Simple Data

Simple is when you already have the data and don't need lazy loading. The
javascript will handle pagination, ordering and searching.

```javascript
import React from 'react';
import DataTable from '@preflighttech/preflight-tables';

const columns = [
  {
    key: 'filling',
    label: 'Filling',
    sort: 'asc',
  },
  {
    key: 'shell',
    label: 'Crispy or Soft?',
  },
  {
    key: 'cost',
    label: '$$$',
  },
]

const Tacos = () => {
  data = [
    { filling: 'beef', shell: 'crispy', cost: 2.5 },
    { filling: 'chicken', shell: 'soft', cost: 3.0 },
  ];

  return (
    <DataTable.Simple
      data={data}
      columns={columns}
      pageLength={25}
      lengthMenu={ [10, 25, 50, 'All'] }
    />
  );
};

export default Tacos;
```

## Example: Gql Data

Gql gets data from a GraphQL endpoint, using apollo. Pagination, ordering and
searching are handled on the backend.

```javascript
import React from 'react';
import { gql } from '@apollo/client';
import DataTable from '@preflighttech/preflight-tables';

export const ORDERS_WITH_COUNT = gql`
  query OrdersWithCount(
    $offset: Int
    $limit: Int
    $sort: String
    $sortDirection: String
    $search: String
    $scopes: [String!]
  ) {
    ordersWithCount(
      offset: $offset
      limit: $limit
      sort: $sort
      sortDirection: $sortDirection
      search: $search
      scopes: $scopes
    ) {
      count
      entries {
        quantity
        side
      }
    }
  }
`;

const columns = [
  {
    key: 'quantity',
    label: 'Number of Tacos'
  },
  {
    key: 'side'
    label: 'Side'
  }
];

const Orders = () => {
  return (
    <DataTable.Gql
      query={ORDERS_WITH_COUNT}
      queryName="ordersWithCount"
      columns={columns}
      pageLength={25}
      lengthMenu={ [10, 25, 50, 'All'] }
    />
  );
};

export default Orders;
```

## GraphQL queryVariables

You can send additional variables to the GraphQL query, for example, to enable filtering by columns.

Use the queryVariables prop to DataTable.gql. For example:

```javascript
# onlyShowFilledOrders would be updated through a button or checkbox.
# If this variable is updated using setState, the datatable will requery.
const queryVariables: { scopes: (onlyShowFilledOrders ? ['filled'] : [] }

<DataTable.Gql queryVariables={queryVariables} ...otherProps />
```

## Backend Setup for GraphQL Data

The query type should accept at least the following arguments:

```ruby
argument :limit, Int, required: false
argument :offset, Int, required: false
argument :search, String, required: false
argument :sort, String, required: false
argument :sort_direction, String, required: false
```

and include fields like:

```ruby
field :count, Int, null: false                                               
field :entries, [UnderlyingType], null: false 
```

## Column Definition Options

Name | Required | Notes
-----|----------|------
key | Yes | Unique key to identify the column. It should generally match the field name
label | Yes | Column Label
content | No | JSX content function. It receives an argument with entry and value keys (value is object[key])
sort | No | Default sort, if any. "asc", "desc"; or "prevent" to prevent sorting on column
width | No | Set width of column
minViewportWidth | No | If viewport width is below this amount, hide column (a plus button will display to show hidden columns)
search | No | et to false to exclude content from search in Simple table (has no effect in Gql)

## Styling

DataTable.Simple and DataTable.Gql accept a style prop. Use this to customize styles:

```javascript
const styles = {
  table: {
    // styles for the container, particularly padding and margin
  },
  header: {
    container: {
      // styles for header row
    },
    label: {
      // styles for header label
    },
    arrowStyle: {
      // styles for sorting arrow.
    }
  },
  data: {
    container: {
      // styles for data row
    },
    alternate: {
      // styles for alternate row, such as backgroundColor
    },
    hover: {
      // styles for hover row, such as backgroundColor
    },
    cell: {
      // style of cell, such as border
    },
    content: {
      // styles for data content, usch as font
    },
    hiddenLabelStyle: {
      // styles for label of hidden cells
    },
    hiddenCellStyle: {
      // styles for data of hidden
    }
  },
  pagination: {
    button: {
      // styles for buttons, such as number or First/Previous/Next/Last labels
    },
    currentButton: {
      // styles if button represents current page
    },
    currentNumberButton: {
      // styles for the current number button
    },
    container: {
      // container of pagination buttons
    },
    label: {
      // styles for label text (e.g. "1-10 of 123")
    }
  }
};
```

## Custom UI component

You can provide a custom UI component for full customization. Below is a starting point:

```javascript
import Header from '@preflighttech/preflight-tables/dist/components/Header';
import Row from '@preflighttech/preflight-tables/dist/components/Row';
import Pagination from '@preflighttech/preflight-tables/dist/components/Pagination';
import LengthMenu from '@preflighttech/preflight-tables/dist/components/LengthMenu';
import StringInput from '@preflighttech/preflight-tables/dist/components/inputs/StringInput';

const columns = {
  // column definitions
};

const component = props => {
  const {
    pageLength,
    updateEntries,
    lengthMenu,
    searchTerm,
    search,
    orderedColumns,
    dimensions,
    movableColumns,
    moveColumn,
    order,
    updateOrder,
    styles,
    entries,
    page,
    numberOfPages,
    paginationData
  } = props;

  return (
    <>
      {
        lengthMenu && lengthMenu.length > 1 &&
          <LengthMenu
            pageLength={pageLength}
            updateEntries={updateEntries}
            options={lengthMenu}
          />
      }

      <View style={{ flexDirection: 'row' }}>
        <Text>Search</Text>
        <StringInput
          value={searchTerm || ''}
          onChange={value => search(value)}
        />
      </View>

      <View>
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

      <Pagination
        page={page}
        numberOfPages={numberOfPages}
        onPageChange={ newPage => updateEntries({ newPage }) }
        label={paginationData}
        styles={styles?.pagination}
      />
    </>
  );
}
  
const MyComponent = () => {
  const { loading, error, data } = useQuery(QUERY);

  return (
    <ScrollView>
      <DataTable.Simple
        data={data}
        columns={columns}
        pageLength={25}
        lengthMenu={ [10, 25, 50, 'All'] }
        component={component}
      />
    </ScrollView>
  );
};
```
