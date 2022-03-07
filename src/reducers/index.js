import { combineReducers } from "redux";
import combineMain from "./main/index";
import combineComplaint from "./complaint/index";
import combineResearch from "./research/index";
import combineQA from "./qa/index";

export default combineReducers({
  main: combineMain,
  complaint: combineComplaint,
  research: combineResearch,
  qa: combineQA,
});
