import axios from "axios";
import { SET_DEPARTMENT, CLOSE_DEPARTMENT } from "../../type/main/type";

// Env
import { config } from "../../utilis/config";
const connect = config.connectMainAPI;

export const setDepartment = () => (dispatch) => {
  axios.get(connect + "/api/departments").then((res) =>
    dispatch({
      type: SET_DEPARTMENT,
      payload: res.data,
    })
  );
};

export const closeDepartment = () => {
  return {
    type: CLOSE_DEPARTMENT,
  };
};