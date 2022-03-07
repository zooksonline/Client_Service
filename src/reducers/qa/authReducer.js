import {
  QA_LOADING,
  QA_LOADED,
  QA_REGISTER_SUCCESS,
  QA_REGISTER_FAIL,
  QA_AUTH_SUCCESS,
} from "../../type/qa/type";

import { LOGOUT_SUCCESS } from "../../type/main/type";

const initialState = {
  isAuthenticated: false,
  isLoading: false,
  user: {
    id: null,
    buasri_id: null,
    email: null,
  },
};

export default function qaReducer(state = initialState, action) {
  switch (action.type) {
    case QA_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case QA_LOADED:
      return {
        ...state,
        isLoading: false,
      };
    case QA_REGISTER_SUCCESS:
      const regisSuccess = action.payload;
      return regisSuccess
        ? {
            ...state,
            isAuthenticated: true,
            isLoading: false,
            user: {
              id: regisSuccess.user.id,
              buasri_id: regisSuccess.user.buasri_id,
              email: regisSuccess.user.email,
            },
          }
        : {
            ...state,
          };
    case QA_REGISTER_FAIL:
      return {
        isAuthenticated: false,
        isLoading: false,
        user: {
          id: null,
          buasri_id: null,
          email: null,
        },
      };
    case QA_AUTH_SUCCESS:
      const researchUser = action.payload;
      return researchUser
        ? {
            ...state,
            isAuthenticated: true,
            isLoading: false,
            user: {
              id: researchUser.user.id,
              buasri_id: researchUser.user.buasri_id,
              email: researchUser.user.email,
            },
          }
        : {
            ...state,
          };
    case LOGOUT_SUCCESS:
      return {
        isAuthenticated: false,
        isLoading: false,
        user: {
          id: null,
          buasri_id: null,
          email: null,
        },
      };
    default:
      return state;
  }
}
