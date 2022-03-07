import {
  RESEARCH_GET_DETAIL,
  RESEARCH_PROJECT_GET_DETAIL,
  RESEARCH_UPDATE_STATUS,
  RESEARCH_EDIT_UPDATE,
  FORM_LOG,
  LOADING_OVERLAY,
  CLOSE_OVERLAY,
} from "../../type/research/type";
import { LOGOUT_SUCCESS, PAGE_LOADING } from "../../type/main/type";

const initialState = {
  detail_page: false,
  update_status: false,
  send_success: false,
  log: false,
  loading_overlay: false,
};

export default function Trigger(state = initialState, action) {
  switch (action.type) {
    case RESEARCH_GET_DETAIL:
      return {
        ...state,
        detail_page: true,
      };
    case RESEARCH_UPDATE_STATUS:
      return {
        ...state,
        update_status: true,
      };
    case RESEARCH_EDIT_UPDATE:
      return {
        ...state,
        send_success: true,
      };
    case FORM_LOG:
      return {
        ...state,
        log: true,
      };
    case RESEARCH_PROJECT_GET_DETAIL:
      return {
        ...state,
        detail_page: true,
      };
    case LOADING_OVERLAY:
      return {
        ...state,
        loading_overlay: true,
      };
    case CLOSE_OVERLAY:
      return {
        ...state,
        loading_overlay: false,
      };
    case PAGE_LOADING:
      return {
        detail_page: false,
        update_status: false,
        send_success: false,
        log: false,
        loading_overlay: false,
      };
    case LOGOUT_SUCCESS:
      return {
        detail_page: false,
        update_status: false,
        send_success: false,
        log: false,
        loading_overlay: false,
      };

    default:
      return state;
  }
}
