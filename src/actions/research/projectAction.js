import axios from "axios";
import {
  RESEARCH_PROJECT_GET_ADMIN,
  // RESEARCH_PROJECT_GET_USER,
  // RESEARCH_PROJECT_GET_COMMITTE,
  RESEARCH_PROJECT_GET_DETAIL,
  RESEARCH_ERROR,
  LOADING_OVERLAY,
} from "../../type/research/type";

// Env
import { config } from "../../utilis/config";
const conResearch = config.connectResearchAPI;
// const conphp = config.connectPHP;

export const loadingoverlay = () => (dispatch) => {
  dispatch({
    type: LOADING_OVERLAY,
  });
};

// get project list admin
export const getproject_admin =
  ({ token, buasri_id }) =>
  (dispatch) => {
    // console.log(token);
    // Headers
    const config = {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
    };
    const body = JSON.stringify({ buasri_id });
    axios
      .post(conResearch + "/api/project/list_user", body, config)
      .then((res) => {
        dispatch({
          type: RESEARCH_PROJECT_GET_ADMIN,
          payload: res.data,
        });
      })
      .catch((error) => {
        dispatch({
          type: RESEARCH_ERROR,
          payload: error.data,
        });
      });
  };

export const getproject_user = () => {};

export const getdetail_project =
  ({ token, id, buasri_id }) =>
  (dispatch) => {
    // Headers
    const config = {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
    };
    const body = JSON.stringify({ buasri_id, id });
    // console.log(body);
    axios
      .post(conResearch + "/api/project/select", body, config)
      .then((res) => {
        dispatch({
          type: RESEARCH_PROJECT_GET_DETAIL,
          payload: res.data,
        });
      });
  };
