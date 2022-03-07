import { combineReducers } from "redux";
import authReducer from "./authReducer";
import formReducer from "./formReducer";
import listReducer from "./listReducer";
import triggerReducer from "./triggerReducer";
import emailReducer from "./emailReducer";
import buttonReducer from "./buttonReducer";
import projectReducer from "./projectReducer";
import projectformReducer from "./projectformReducer";
import projectemailReducer from "./projectemailReducer";

export default combineReducers({
  auth: authReducer,
  form: formReducer,
  list: listReducer,
  trigger: triggerReducer,
  email: emailReducer,
  button: buttonReducer,
  projectlist: projectReducer,
  projectform: projectformReducer,
  projectemail: projectemailReducer,
});
