export const FOOD_VERDICT = {
  TO_TRY: 'to try',
  NO_GO: 'no go',
  CAN_GO: 'can go',
  MUST_GO: 'must go',
};

export const isValidFoodVerdict = (foodVerdict) => {
  return Object.values(FOOD_VERDICT).includes(foodVerdict);
};

export const FOOD_COST = {
  Cheap: '1',
  Affordable: '2',
  Expensive: '3',
};

export const FOOD_VERDICT_REVIEW = {
  NO_GO: 'no go',
  CAN_GO: 'can go',
  MUST_GO: 'must go',
};
