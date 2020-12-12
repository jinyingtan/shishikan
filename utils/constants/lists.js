export const LIST_VISIBILITY = {
  PUBLIC: 'public',
  PRIVATE: 'private',
};

export const isValidListVisibility = (listVisibility) => {
  return Object.values(LIST_VISIBILITY).includes(listVisibility);
};
