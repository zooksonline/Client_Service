import axios from "axios";
import { returnErrors } from "./errorAction";
import {
  GET_ALL_SERVICE_USER,
  GET_USER_SERVICE,
  GET_CURRENT_USER_SERVICE,
  SEND_ACTIVE_SERVICE,
  // LOGOUT_SUCCESS,
  ERROR_GET_SERVICE,
} from "../../type/main/type";

// Env
import { config } from "../../utilis/config";
const connect = config.connectMainAPI;

export const getServiceForUserPage =
  ({ token, buasri_id }) =>
  (dispatch) => {
    // Headers
    const config = {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
    };

    const body = JSON.stringify({ buasri_id });
    //   console.log(body);
    axios
      .post(connect + "/api/users/service/list", body, config)
      .then((res) => {
        dispatch({
          type: GET_CURRENT_USER_SERVICE,
          payload: res.data,
        });
      })
      .catch((err) => {
        // alert("Session ของคุณหมดอายุ โปรด Login ใหม่");
        // alert(err);
        // dispatch({
        //   type: LOGOUT_SUCCESS,
        // });
      });
  };

export const getAllServiceUserForAdmin =
  ({ token }) =>
  (dispatch) => {
    // Headers
    const config = {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
    };

    axios
      .get(connect + "/api/users", config)
      .then((res) =>
        dispatch({
          type: GET_ALL_SERVICE_USER,
          payload: res.data,
        })
      )
      .catch((err) => {
        try {
          dispatch(returnErrors(err.response.data, err.response.status));
          dispatch({
            type: ERROR_GET_SERVICE,
          });
          // console.log("connect server");
        } catch {
          // console.log("can't connect server");
        }
      });
  };

export const getServiceUser =
  ({ token, buasri_id }) =>
  (dispatch) => {
    // Headers
    const config = {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
    };

    const body = JSON.stringify({ buasri_id });
    // console.log("check" + body);
    axios
      .post(connect + "/api/users/service/list", body, config)
      .then((res) => {
        // console.log(res.data);
        dispatch({
          type: GET_USER_SERVICE,
          payload: res.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

export const sendResearchActive =
  ({ token, user_order, buasri_id, active, position }) =>
  (dispatch) => {
    // Headers
    const config = {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
    };

    const body = JSON.stringify({
      user_order,
      buasri_id,
      position,
      active,
    });
    // console.log(body);
    axios
      .put(connect + "/api/users/service/add/research", body, config)
      .then(() => {
        dispatch({
          type: SEND_ACTIVE_SERVICE,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

export const sendQAActive =
  ({ token, user_order, buasri_id, active, position }) =>
  (dispatch) => {
    // Headers
    const config = {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
    };

    const body = JSON.stringify({
      user_order,
      buasri_id,
      position,
      active,
    });
    console.log(body);
    axios
      .put(connect + "/api/users/service/add/qa", body, config)
      .then(() => {
        dispatch({
          type: SEND_ACTIVE_SERVICE,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

export const sendBudgetActive =
  ({ token, user_order, buasri_id, dep_budget, active, position }) =>
  (dispatch) => {
    // Headers
    const config = {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
    };

    const body = JSON.stringify({
      user_order,
      buasri_id,
      position,
      active,
      dep_budget,
    });
    console.log(body);
    axios
      .put(connect + "/api/users/service/add/budget", body, config)
      .then(() => {
        dispatch({
          type: SEND_ACTIVE_SERVICE,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
