import axios from "axios";
import {
  // RESEARCH_GET_EMAIL_USER,
  RESEARCH_GET_EMAIL_COMMITTEE,
  RESEARCH_GET_EMAIL_ADMIN,
} from "../../type/research/type";
// import { PAGE_LOADING } from "../../type/main/type";

// Env
import { config } from "../../utilis/config";
// const conResearch = config.connectResearchAPI;
const conMain = config.connectMainAPI;
// const conPHP = config.connectPHP;

// GET E-MAIL COMMITTEE
export const getemail_committee =
  ({ dep, token }) =>
  (dispatch) => {
    // Headers
    const config = {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
    };
    const body = JSON.stringify({
      dep,
    });
    // console.log(body);
    axios
      .post(conMain + "/api/service/email/research/committee", body, config)
      .then((res) => {
        if (res.data) {
          dispatch({
            type: RESEARCH_GET_EMAIL_COMMITTEE,
            payload: res.data,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

// GET E-MAIL ADMIN
export const getemail_admin = (SendToken,buasri_id) => (dispatch) => {
  // Headers
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": SendToken.token,
    },
  };
  const body = JSON.stringify({
    buasri_id,
  });
  // console.log("check token = " + SendToken.token);
  // console.log(conMain);
  axios
    .post(conMain + "/api/service/email/research/admin", body, config)
    .then((res) => {
      if (res.data) {
        dispatch({
          type: RESEARCH_GET_EMAIL_ADMIN,
          payload: res.data,
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
