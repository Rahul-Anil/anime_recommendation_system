export const SELECT_GENRE = "SELECT_GENRE";
export const SELECT_YEAR = "SELECT_YEAR";
export const SELECT_STUDIO = "SELECT_STUDIO";

export const selectGenre = (val) => {
  return (dispatch) =>
    dispatch({
      type: SELECT_GENRE,
      payload: val,
    });
};

export const selectYear = (val) => {
  return (dispatch) =>
    dispatch({
      type: SELECT_YEAR,
      payload: val,
    });
};

export const selectStudio = (val) => {
  return (dispatch) =>
    dispatch({
      type: SELECT_STUDIO,
      payload: val,
    });
};
