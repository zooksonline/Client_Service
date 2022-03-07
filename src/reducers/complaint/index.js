import { combineReducers } from "redux";
import authReducer from "./authReducer";
import logReducer from "./logReducer";
import triggerReducer from "./triggerReducer";
import listReducer from "./listReducer";

export default combineReducers({
  auth: authReducer,
  log: logReducer,
  trigger: triggerReducer,
  list: listReducer,
});
