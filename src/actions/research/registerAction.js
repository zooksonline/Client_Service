import axios from "axios";
import { returnErrors } from "../main/errorAction";
import {
  RESEARCH_REGISTER_SUCCESS,
  RESEARCH_REGISTER_FAIL,
} from "../../type/research/type";

// Env
import { config } from "../../utilis/config";
const conResearch = config.connectResearchAPI;

// registerUser
export const register = ({ buasri_id, email, position, dep }) => (dispatch) => {
  // Headers
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  // Request body
  const body = JSON.stringify({ buasri_id, position, email, dep });
  console.log(body);
  axios
    .post(conResearch + "/api/user/register", body, config)
    .then((res) => {
      dispatch({
        type: RESEARCH_REGISTER_SUCCESS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(
        returnErrors(
          err.response.data,
          err.response.status,
          RESEARCH_REGISTER_FAIL
        )
      );
    });
};
