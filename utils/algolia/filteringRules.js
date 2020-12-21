export const getFoodFromList = (listId, userId) => {
  return `listId:'${listId}' AND user.id:'${userId}'`;
};

export const getFood = (userId) => {
  if (userId) {
    return `user.id:'${userId}'`;
  } else {
    return ``;
  }
};
