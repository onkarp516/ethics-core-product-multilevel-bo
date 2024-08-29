import {
    SET_USER_CONTROL,
    GET_USER_CONTROL
  } from "@/helpers";
  
  export const setUserControl = (payload) => {
    return {
      type: SET_USER_CONTROL,
      payload,
    };
  };
  
  export const getUserControl = () => {
    return {
      type: GET_USER_CONTROL,
    };
  };
  