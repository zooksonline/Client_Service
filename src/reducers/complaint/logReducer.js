import { COMPLAINT_ERROR } from "../../type/complaint/type";

import { LOGOUT_SUCCESS } from "../../type/main/type";

const initialState = {
  log: null,
};

export default function logComplaintReducer(state = initialState, action) {
  switch (action.type) {
    case COMPLAINT_ERROR:
      return {
        log: action.payload,
      };
    case LOGOUT_SUCCESS:
      return {
        log: null,
      };
    default:
      return state;
  }
}
