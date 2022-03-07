import axios from "axios";
import {
  RESEARCH_GET_DEADLINE_ADMIN,
  RESEARCH_ADD_DEADLINE_ADMIN,
  RESEARCH_GET_DEADLINECHECK_ADMIN,
  RESEARCH_ADD_DEADLINECHECK_ADMIN,
  RESEARCH_GET_REPORT_ADMIN,
  RESEARCH_GET_REPORT_COMMITTEE,
  RESEARCH_GET_REPORT_USER,
  RESEARCH_ERROR,
} from "../../type/research/type";
import { config } from "../../utilis/config";
const conResearch = config.connectResearchAPI;

export const add_deadline =
  ({ token, name, buasri_id, datetime, status }) =>
  (dispatch) => {
    // Headers
    const config = {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
    };

    // body
    const body = JSON.stringify({
      name,
      buasri_id,
      datetime,
      status,
    });
    // console.log(body);

    axios
      .put(conResearch + "/api/date/add", body, config)
      .then((res) => {
        dispatch({
          type: RESEARCH_ADD_DEADLINE_ADMIN,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

export const get_deadline =
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
      .post(conResearch + "/api/date/select", body, config)
      .then((res) => {
        // console.log(res);
        dispatch({
          type: RESEARCH_GET_DEADLINE_ADMIN,
          payload: res.data,
        });
      })
      .catch(() => {
        dispatch({
          type: RESEARCH_ERROR,
          payload: "error from buttonAction 1",
        });
      });
  };

export const add_deadline_check =
  ({ token, name, buasri_id, datetime, status }) =>
  (dispatch) => {
    // Headers
    const config = {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
    };

    // body
    const body = JSON.stringify({
      name,
      buasri_id,
      datetime,
      status,
    });
    // console.log(body);

    axios
      .put(conResearch + "/api/date/add_check", body, config)
      .then((res) => {
        dispatch({
          type: RESEARCH_ADD_DEADLINECHECK_ADMIN,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

export const get_deadline_check =
  ({ token, buasri_id }) =>
  (dispatch) => {
    // console.log("get_deadline_check" + token);
    // Headers
    const config = {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
    };
    const body = JSON.stringify({ buasri_id });
    axios
      .post(conResearch + "/api/date/select_check", body, config)
      .then((res) => {
        dispatch({ type: RESEARCH_GET_DEADLINECHECK_ADMIN, payload: res.data });
      })
      .catch(() => {
        dispatch({
          type: RESEARCH_ERROR,
          payload: "error from buttonAction 3",
        });
      });
  };

export const get_report_admin =
  ({ buasri_id, token }) =>
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
      .post(conResearch + "/api/report/report_admin", body, config)
      .then((res) => {
        // console.log(res);
        dispatch({
          type: RESEARCH_GET_REPORT_ADMIN,
          payload: res.data,
        });
      })
      .catch((error) => {
        dispatch({
          type: RESEARCH_ERROR,
          payload: "error from buttonAction 2",
        });
      });
  };

export const get_report_committee =
  ({ dep, token }) =>
  (dispatch) => {
    // console.log(token);
    // Headers
    const config = {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
    };
    const body = JSON.stringify({ dep });
    axios
      .post(conResearch + "/api/report/report_committee", body, config)
      .then((res) => {
        // console.log(res);
        dispatch({
          type: RESEARCH_GET_REPORT_COMMITTEE,
          payload: res.data,
        });
      })
      .catch((error) => {
        dispatch({
          type: RESEARCH_ERROR,
          payload: "error from buttonAction 3",
        });
      });
  };

export const get_report_user =
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
      .post(conResearch + "/api/report/report_user", body, config)
      .then((res) => {
        // console.log(res);
        dispatch({
          type: RESEARCH_GET_REPORT_USER,
          payload: res.data,
        });
      })
      .catch((error) => {
        dispatch({
          type: RESEARCH_ERROR,
          payload: "error from buttonAction 4",
        });
      });
  };
