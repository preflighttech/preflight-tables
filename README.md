## Installation

1. For GraphQL, ensure using @apollo/client >= 3.0.0

2. Install and setup React DND for drag/drop support. This is currently required
   even if you're not using drag/drop.

  - Install "react-dnd": "^11.1.3" (install in components for monorepo)

  - Setup (only if you want to use).
    - In App.js:

    ```javascript
    import { HTML5Backend } from 'react-dnd-html5-backend'
    import { DndProvider } from 'react-dnd'

    // Within component return
    <DndProvider backend={HTML5Backend}>
      // children
    </DndProvider>
    ```

2. Add github packages auth token to .npmrc.

    @preflighttech:registry=https://npm.pkg.github.com/
    //npm.pkg.github.com/:_authToken=519261ec59f88e4fa03e87a39e70105902b1b6aa

3. Install package.
    yarn add @preflighttech/preflight-tables

    # For monorepo, install in components package:
    yarn workspace components add @preflighttech/preflight-tables

    # or add to package.json directly, updating version as needed:
    "@preflighttech/preflight-tables": "^0.0.4"

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

## GraphGL queryVariables

TODO

## Backend Setup for GraphQL Data

TODO

## Column Definition Options

TODO

## Styling

TODO

## Custom UI component

TODO
