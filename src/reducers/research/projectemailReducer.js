import { RESEARCH_PROJECT_GET_EMAIL_ADMIN } from "../../type/research/type";
import { LOGOUT_SUCCESS, PAGE_LOADING } from "../../type/main/type";

const initialState = {
  email_admin: null,
};

export default function projectemailReducer(state = initialState, action) {
  switch (action.type) {
    case RESEARCH_PROJECT_GET_EMAIL_ADMIN:
      const data_admin = action.payload;
      return data_admin
        ? {
            ...state,
            email_admin: data_admin ? data_admin : null,
          }
        : { ...state };
    case PAGE_LOADING:
      return {
        ...state,
        email_admin: null,
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        email_admin: null,
      };
    default:
      return state;
  }
}
