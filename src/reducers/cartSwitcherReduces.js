const currencySwitcherReduces = (state = false, action) => {
  if (action.type !== "CART_SWITCHER") {
    return state;
  }

  return !state;
};
export default currencySwitcherReduces;
