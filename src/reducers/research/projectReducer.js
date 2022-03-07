import {
  RESEARCH_PROJECT_GET_USER,
  RESEARCH_PROJECT_GET_ADMIN,
  RESEARCH_PROJECT_GET_COMMITTE,
  RESEARCH_PROJECT_GET_DETAIL,
} from "../../type/research/type";

import { LOGOUT_SUCCESS } from "../../type/main/type";

const initialState = {
  list: null,
  detail: null,
  log: null,
};

export default function projectlistReducer(state = initialState, action) {
  switch (action.type) {
    case RESEARCH_PROJECT_GET_USER:
      return {
        ...state,
        list: action.payload,
      };
    case RESEARCH_PROJECT_GET_ADMIN:
      return {
        ...state,
        list: action.payload,
      };
    case RESEARCH_PROJECT_GET_COMMITTE:
      return {
        ...state,
        list: action.payload,
      };
    case RESEARCH_PROJECT_GET_DETAIL:
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
