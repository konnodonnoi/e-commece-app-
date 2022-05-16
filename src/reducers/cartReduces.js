const cartReducer = (state = { items: {}, itemsCount: 0 }, action) => {
  switch (action.type) {
    case "ADD":
      const itemId = action.item.id + "-" + action.item.selectedSize?.value;
      if (itemId in state.items) {
        let newItem = { ...state.items[itemId] };
        newItem.counter++;
        state.items[itemId] = newItem;
      } else {
        let newItem = { ...action.item };
        newItem.counter = 1;
        state.items[itemId] = newItem;
      }

      state.itemsCount++;
      return { ...state };
    case "REMOVE":
      const removeItemId =
        action.item.id + "-" + action.item.selectedSize?.value;

      if (removeItemId in state.items) {
        let newItem = { ...state.items[removeItemId] };
        newItem.counter--;
        if (!newItem.counter) {
          delete state.items[removeItemId];
        } else {
          state.items[removeItemId] = newItem;
        }
      }

      state.itemsCount--;
      return { ...state };
    case "RESIZE":
      const reSizeItemKey =
        action.item.id + "-" + action.item.selectedSize?.value;
      //Remove old key
      const newItemKey = action.item.id + "-" + action.newSize.value;
      let newItem = action.item;
      newItem.selectedSize = action.newSize;

      const x = Object.keys(state.items).reduce((newState, oldKey) => {
        if (newItemKey === oldKey) {
          newItem.counter += state.items[oldKey].counter;
          newState[newItemKey] = newItem;
        } else if (reSizeItemKey === oldKey) {
          newState[newItemKey] = newItem;
        } else {
          newState[oldKey] = state.items[oldKey];
        }
        return newState;
      }, {});

      state.items = x;
      return { ...state };
    default:
      return { ...state };
  }
};
export default cartReducer;
