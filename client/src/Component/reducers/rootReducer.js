import { combineReducers } from "redux";
import alert from "./alertreducer";
import auth from "./authReducer";
export default combineReducers({
  alert,
  auth,
});
