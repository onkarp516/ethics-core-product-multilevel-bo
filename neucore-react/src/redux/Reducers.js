import { combineReducers } from "redux";
import userPermissions from "./userPermissions/Reducer";
import userControl from "./userControl/Reducer";
const Reducers = combineReducers({
  userPermissions,
  userControl
});

export default Reducers;
