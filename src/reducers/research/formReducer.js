import {
  COLLECT_TAG,
  CLEAR_TAG,
  STUDENT_TAG,
  CLEAR_STUDENT_TAG,
  LOADING_OVERLAY,
  CLOSE_OVERLAY,
  FORM_LOG,
  RESEARCH_SEND_MAIL_COMMITTEE,
  RESEARCH_SEND_NO_COMMITTEE,
  RESEARCH_GET_UPLOAD_FILE,
} from "../../type/research/type";
import { LOGOUT_SUCCESS, PAGE_LOADING } from "../../type/main/type";

const initialState = {
  tags: null,
  student: null,
  upload_success: false,
  email_success: false,
  loading_overlay: false,
  log: false,
};

export default function formReducer(state = initialState, action) {
  switch (action.type) {
    case COLLECT_TAG:
      const data_tag = action.payload;
      return data_tag
        ? {
            ...state,
            tags: data_tag,
          }
        : { ...state };
    case STUDENT_TAG:
      const student_tag = action.payload;
      return student_tag
        ? {
            ...state,
            student: student_tag,
          }
        : { ...state };
    case RESEARCH_SEND_MAIL_COMMITTEE:
      return {
        ...state,
        email_success: true,
      };
    case RESEARCH_SEND_NO_COMMITTEE:
      return {
        ...state,
        email_success: true,
      };
    case RESEARCH_GET_UPLOAD_FILE:
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
    case FORM_LOG:
      return {
        ...state,
        log: true,
      };
    case CLEAR_TAG:
      return {
        tags: null,
        student: null,
        email_success: false,
        upload_success: false,
        loading_overlay: false,
        log: false,
      };
    case PAGE_LOADING:
      return {
        tags: null,
        student: null,
        upload_success: false,
        email_success: false,
        loading_overlay: false,
        log: false,
      };
    case LOGOUT_SUCCESS:
      return {
        tags: null,
        student: null,
        upload_success: false,
        email_success: false,
        loading_overlay: false,
        log: false,
      };

    default:
      return state;
  }
}
