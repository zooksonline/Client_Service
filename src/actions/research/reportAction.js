import axios from "axios";
import {
  RESEARCH_GET_REPORT_ADMIN,
  RESEARCH_ERROR,
  RESEARCH_GET_REPORT_COMMITTEE,
  RESEARCH_GET_REPORT_USER,
} from "../../type/research/type";
import { config } from "../../utilis/config";
const conResearch = config.connectResearchAPI;

export const get_report_admin =
  ({ token }) =>
  (dispatch) => {
    console.log(token);
    // Headers
    const config = {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
    };
    // const body = JSON.stringify({ buasri_id });
    axios
      .post(conResearch + "/api/report/report_admin", null, config)
      .then((res) => {
        console.log(res);
        dispatch({
          type: RESEARCH_GET_REPORT_ADMIN,
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

export const get_report_commitee =
  ({ token }) =>
  (dispatch) => {
    console.log(token);
    // Headers
    const config = {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
    };
    // const body = JSON.stringify({ buasri_id });
    axios
      .post(conResearch + "/api/report/report_committee", null, config)
      .then((res) => {
        console.log(res);
        dispatch({
          type: RESEARCH_GET_REPORT_COMMITTEE,
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

export const get_report_user =
  ({ token }) =>
  (dispatch) => {
    console.log(token);
    // Headers
    const config = {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
    };
    // const body = JSON.stringify({ buasri_id });
    axios
      .post(conResearch + "/api/report/report_user", null, config)
      .then((res) => {
        console.log(res);
        dispatch({
          type: RESEARCH_GET_REPORT_USER,
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
