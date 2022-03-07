import {
  RESEARCH_GET_DEADLINE_ADMIN,
  RESEARCH_GET_DEADLINECHECK_ADMIN,
  RESEARCH_GET_REPORT_ADMIN,
  RESEARCH_GET_REPORT_COMMITTEE,
  RESEARCH_GET_REPORT_USER,
} from "../../type/research/type";

import { LOGOUT_SUCCESS } from "../../type/main/type";

const initialState = {
  date: {
    buasri_id: null,
    datetime: null,
    status: null,
  },
  date_check: {
    buasri_id: null,
    datetime: null,
    status: null,
  },
  report: null,
};

export default function buttonReducer(state = initialState, action) {
  switch (action.type) {
    case RESEARCH_GET_DEADLINE_ADMIN:
      return {
        ...state,
        date: action.payload,
      };
    case RESEARCH_GET_DEADLINECHECK_ADMIN:
      return {
        ...state,
        date_check: action.payload,
      };
    case RESEARCH_GET_REPORT_ADMIN:
      return {
        ...state,
        report: action.payload,
      };
    case RESEARCH_GET_REPORT_COMMITTEE:
      return {
        ...state,
        report: action.payload,
      };
    case RESEARCH_GET_REPORT_USER:
      return {
        ...state,
        report: action.payload,
      };
    case LOGOUT_SUCCESS:
      return {
        date: null,
        date_check: null,
        report: null,
      };
    default:
      return state;
  }
}
