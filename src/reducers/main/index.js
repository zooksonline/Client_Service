import { combineReducers } from "redux";
import authReducer from "./authReducer";
import depReducer from "./depReducer";
import errorReducer from "./errorReducer";
import triggerReducer from "./triggerReducer";
import serviceReducer from "./serviceReducer";
import listuserReducer from "./listUserServiceReducer";

export default combineReducers({
  trigger: triggerReducer,
  auth: authReducer,
  list: listuserReducer,
  service: serviceReducer,
  departments: depReducer,
  error: errorReducer,
});
