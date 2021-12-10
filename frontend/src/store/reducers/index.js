import { combineReducers } from "redux";
import { modal } from "./modal.reducer";
import { genre } from "./select.reducer";

const createReducer = (asyncReducers) =>
  combineReducers({
    modal,
    genre,
    ...asyncReducers,
  });

export default createReducer;
