import axios from "axios";
import { QA_AUTH_SUCCESS } from "../../type/qa/type";

// ENV
import { config } from "../../utilis/config";
const conQA = config.connectQAAPI;

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

    axios
      .post(conQA + "/api/user/id", body, config)
      .then((res) => {
        if (res.data.token) {
          dispatch({
            type: QA_AUTH_SUCCESS,
            payload: res.data,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        //   dispatch(returnErrors(err.response.data, err.response.status));
        //   dispatch({
        //     type: RESEARCH_AUTH_FAIL,
        //   });
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
