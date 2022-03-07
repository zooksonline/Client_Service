import {
  COMPLAINT_GET_LIST_USER,
  COMPLAINT_GET_LIST_ALL,
  COMPLAINT_SELECT_LIST,
  COMPLAINT_ERROR,
} from "../../type/complaint/type";
import { LOGOUT_SUCCESS } from "../../type/main/type";

const initialState = {
  list: null,
  detail: null,
};

export default function listuserReducer(state = initialState, action) {
  switch (action.type) {
    case COMPLAINT_GET_LIST_USER:
      return {
        ...state,
        list: action.payload,
      };
    case COMPLAINT_GET_LIST_ALL:
      return {
        ...state,
        list: action.payload,
      };
    case COMPLAINT_SELECT_LIST:
      return {
        ...state,
        detail: action.payload,
      };
    case COMPLAINT_ERROR:
      return {
        list: null,
        detail: null,
      };
    case LOGOUT_SUCCESS:
      return {
        list: null,
        detail: null,
      };
    default:
      return state;
  }
}
