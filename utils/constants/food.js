export const FOOD_VERDICT = {
  TO_TRY: 'to try',
  NO_GO: 'no go',
  CAN_GO: 'can go',
  MUST_GO: 'must go',
};

export const isValidFoodVerdict = (foodVerdict) => {
  return Object.values(FOOD_VERDICT).includes(foodVerdict);
};