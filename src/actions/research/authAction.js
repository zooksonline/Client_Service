import axios from "axios";
// import { returnErrors } from "../main/errorAction";
import {
  RESEARCH_AUTH_SUCCESS,
  RESEARCH_AUTH_FAIL,
} from "../../type/research/type";

// ENV
import { config } from "../../utilis/config";
const conResearch = config.connectResearchAPI;

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
      .post(conResearch + "/api/user/id", body, config)
      .then((res) => {
        if (res.data.token) {
          dispatch({
            type: RESEARCH_AUTH_SUCCESS,
            payload: res.data,
          });
        } else {
          dispatch({
            type: RESEARCH_AUTH_FAIL,
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
