import axios from "axios";
import { returnErrors, returnErrorsLdap } from "./errorAction";
import {
  AUTH_ERROR,
  USER_LOADED,
  USER_LOADING,
  PAGE_LOADING,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
} from "../../type/main/type";

// Env
import { config } from "../../utilis/config";
const connect = config.connectMainAPI;
const conphp = config.connectPHP;

// Check token & load user
export const loadUser = () => (dispatch, getState) => {
  // User loading
  dispatch({ type: USER_LOADING });

  axios
    .get(connect + "/api/auth/user", token(getState))
    .then((res) =>
      dispatch({
        type: USER_LOADED,
        payload: res.data,
      })
    )
    .catch((err) => {
      try {
        dispatch(returnErrors(err.response.data, err.response.status));
        dispatch({
          type: AUTH_ERROR,
        });
        // console.log("connect server");
      } catch {
        // console.log("can't connect server");
      }
    });
};

// Setup config/headers and token
export const token = (getState) => {
  // Get token from localstorage
  const token = getState().main.auth.token;
  // Headers
  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };

  // If token, add to headers
  if (token) {
    config.headers["x-auth-token"] = token;
  }

  return config;
};

// Login
export const login = ({ buasri_id, password }) => (dispatch) => {
  // Headers
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  // Request body
  const body = JSON.stringify({ buasri_id, password });
  axios
    .post(conphp + "/ldap.php", body, config)
    .then((res) => {
      if (res.data.Result) {
        axios
          .post(connect + "/api/auth", body, config)
          .then((res) =>
            dispatch({
              type: LOGIN_SUCCESS,
              payload: res.data,
            })
          )
          .then(() =>
            dispatch({
              type: PAGE_LOADING,
            })
          )
          .catch((err) => {
            // console.log(1);
            dispatch(returnErrorsLdap());
            dispatch({
              type: LOGIN_FAIL,
            });
          });
      } else {
        axios.catch((err) => {
          // console.log(2);
          dispatch(returnErrorsLdap());
          dispatch({
            type: LOGIN_FAIL,
          });
        });
      }
    })
    .catch((err) => {
      // console.log(3);
      dispatch(returnErrorsLdap());
      dispatch({
        type: LOGIN_FAIL,
      });
    });
};

// Logout User
export const logout = () => {
  return function (dispatch) {
    dispatch({
      type: LOGOUT_SUCCESS,
    });
    dispatch({
      type: PAGE_LOADING,
    });
  };
};
