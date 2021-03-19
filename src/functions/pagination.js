export const paginatedIndexes = (endIndex, page, pageLength) => {
  let startIndex = 0;
  if (!endIndex) { endIndex = 0; }

  if (pageLength) {
    startIndex = (page) * pageLength;
    endIndex = Math.min(startIndex + pageLength, endIndex);
  }

  return [startIndex, endIndex];
};

export const pageCount = (count, pageLength) => {
  if (pageLength) {
    return count ? Math.ceil(count / pageLength) : 1;
  } else {
    return 1;
  }
}
