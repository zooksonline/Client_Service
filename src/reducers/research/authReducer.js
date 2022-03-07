import {
  RESEARCH_LOADING,
  RESEARCH_LOADED,
  RESEARCH_REGISTER_SUCCESS,
  RESEARCH_REGISTER_FAIL,
  RESEARCH_AUTH_SUCCESS,
} from "../../type/research/type";

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

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case RESEARCH_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case RESEARCH_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload,
      };
    case RESEARCH_REGISTER_SUCCESS:
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
    case RESEARCH_REGISTER_FAIL:
      return {
        isAuthenticated: false,
        isLoading: false,
        user: {
          id: null,
          buasri_id: null,
          email: null,
        },
      };
    case RESEARCH_AUTH_SUCCESS:
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
