export const getFoodFromList = (listId, userId) => {
  return `listId:'${listId}' AND user.id:'${userId}'`;
};
