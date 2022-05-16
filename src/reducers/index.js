import currencyReducer from "./currency";
import cartReducer from "./cartReduces";
import currencySwitcherReduces from "./currencySwitcherReduces";
import {combineReducers} from "redux";
import cartSwitcherReduces from "./cartSwitcherReduces";

const rootReducers = combineReducers({
    currency: currencyReducer,
    cartStore: cartReducer,
    currencySwitcherReducer: currencySwitcherReduces,
    cartSwitcherReducer: cartSwitcherReduces
})

export default rootReducers;
