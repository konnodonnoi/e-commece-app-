import {DefaultCurrency} from "../components/CurrencySwitcher/config";

export const InitCurrency = () => {
    return {
        type: DefaultCurrency
    }
}

export const changeCurrency = (name) => {
    return {
        type: "CURRENCY_CHANGE",
        currencyName: name
    }
}

export const AddItemToCart = (item) => {
    return {
        type: 'ADD',
        item: item
    }
}

export const RemoveItemFromCart = (item) =>{
    return {
        type: 'REMOVE',
        item: item
    }
}

export const ResizeItemFromCart = (item, newSize) => {
    return {
        type: 'RESIZE',
        item: item,
        newSize: newSize
    }
}

export const CurrencySwitcherAction = () =>{
    return {
        type: 'CURRENCY_SWITCHER'
    }
}

export const CartSwitcherAction = () =>{
    return {
        type: 'CART_SWITCHER'
    }
}
