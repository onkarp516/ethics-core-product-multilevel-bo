import { SET_USER_CONTROL, GET_USER_CONTROL } from "@/helpers";

export default (state = [], action) => {
  switch (action.type) {
    case SET_USER_CONTROL:
      return [...action.payload];
    case GET_USER_CONTROL:
      return state;
    default:
      return state;
  }
};
