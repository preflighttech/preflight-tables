export const formattedNumber = value => {
  const formatter = new Intl.NumberFormat('en-US', {});
  return formatter.format(value);
};
