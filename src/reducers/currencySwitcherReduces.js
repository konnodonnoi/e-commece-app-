const currencySwitcherReduces = (state = false, action) =>{
    if (action.type !== "CURRENCY_SWITCHER") {
        return state;
    }

    return !state;
}
export default currencySwitcherReduces;
