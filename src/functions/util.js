export const formattedNumber = value => {
  const formatter = new Intl.NumberFormat('en-US', {});
  return formatter.format(value);
};

export const valueFor = (entry, key, columns) => {
  const column = columns.find(column => column.key === key);
  if (!column) { return 0 }; // column has been removed.

  const value = entry[key];

  if (column.value) {
    return column.value({ entry, value });
  } else {
    return value;
  }
};
