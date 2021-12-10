import * as Action from "../actions";
const initialState = {
  genres: [],
  studios: [],
  year: 0,
};

export const genre = (state = initialState, action) => {
  switch (action.type) {
    case Action.SELECT_GENRE:
      return {
        ...state,
        genres: [...action.payload],
      };
    case Action.SELECT_STUDIO:
      return {
        ...state,
        studios: [...action.payload],
      };
    case Action.SELECT_YEAR:
      return {
        ...state,
        year: action.payload,
      };

    default:
      return state;
  }
};
