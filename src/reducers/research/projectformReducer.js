import {
  RESEARCH_PROJECT_SEND_MAIL_ADMIN,
  RESEARCH_PROJECT_SEND_NO_ADMIN,
  RESEARCH_GET_PROJECT_UPLOAD_FILE,
  PROJECT_FORM_LOG,
  LOADING_OVERLAY,
  CLOSE_OVERLAY,
} from "../../type/research/type";
import { LOGOUT_SUCCESS, PAGE_LOADING } from "../../type/main/type";

const initialState = {
  upload_success: false,
  email_success: false,
  loading_overlay: false,
  log: false,
};

export default function projectformReducer(state = initialState, action) {
  switch (action.type) {
    case RESEARCH_PROJECT_SEND_MAIL_ADMIN:
      return {
        ...state,
        email_success: true,
      };
    case RESEARCH_PROJECT_SEND_NO_ADMIN:
      return {
        ...state,
        email_success: true,
      };
    case RESEARCH_GET_PROJECT_UPLOAD_FILE:
      return {
        ...state,
        upload_success: true,
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
    case PROJECT_FORM_LOG:
      return {
        ...state,
        log: true,
      };
    case PAGE_LOADING:
      return {
        upload_success: false,
        email_success: false,
        loading_overlay: false,
        log: false,
      };
    case LOGOUT_SUCCESS:
      return {
        upload_success: false,
        email_success: false,
        loading_overlay: false,
        log: false,
      };
    default:
      return state;
  }
}
