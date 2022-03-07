import {
  RESEARCH_GET_LIST_USER,
  RESEARCH_GET_LIST_ADMIN,
  RESEARCH_GET_LIST_COMMITTEE,
  RESEARCH_GET_DETAIL,
} from "../../type/research/type";

import { LOGOUT_SUCCESS } from "../../type/main/type";

const initialState = {
  list: null,
  detail: null,
  log: null,
};

export default function listReducer(state = initialState, action) {
  switch (action.type) {
    case RESEARCH_GET_LIST_USER:
      return {
        ...state,
        list: action.payload,
      };
    case RESEARCH_GET_LIST_COMMITTEE:
      return {
        ...state,
        list: action.payload,
      };
    case RESEARCH_GET_LIST_ADMIN:
      return {
        ...state,
        list: action.payload,
      };
    case RESEARCH_GET_DETAIL:
      return {
        ...state,
        detail: action.payload,
      };
    case LOGOUT_SUCCESS:
      return {
        list: null,
        detail: null,
        log: null,
      };
    default:
      return state;
  }
}
