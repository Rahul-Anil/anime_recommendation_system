import * as Action from "../actions";
const initialState = {
  open: false,
  selectData: {},
};

export const modal = (state = initialState, action) => {
  switch (action.type) {
    case Action.OPEN_MODAL:
      return {
        ...state,
        open: true,
        selectData: action.payload,
      };
    case Action.CLOSE_MODAL:
      return {
        ...state,
        open: false,
        selectData: {},
      };

    default:
      return state;
  }
};
