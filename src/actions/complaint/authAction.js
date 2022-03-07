import axios from "axios";
import { returnErrors } from "../main/errorAction";
import {
  COMPLAINT_AUTH_SUCCESS,
  COMPLAINT_AUTH_FAIL,
} from "../../type/complaint/type";

// Env
import { config } from "../../utilis/config";
const conComplaint = config.connectComplaintAPI;

// Auth User
export const auth_user =
  ({ buasri_id }) =>
  (dispatch) => {
    // Headers
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    // Request body
    const body = JSON.stringify({ buasri_id });
    // console.log(body);
    axios
      .post(conComplaint + "/api/auth", body, config)
      .then((res) => {
        // console.log(res.data);
        if (res.data.token) {
          dispatch({
            type: COMPLAINT_AUTH_SUCCESS,
            payload: res.data,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.response) {
          dispatch(returnErrors(err.response.data, err.response.status));
        }
        // dispatch(returnErrors(err.response.data, err.response.status));
        dispatch({
          type: COMPLAINT_AUTH_FAIL,
        });
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
