import axios from "axios";
import { RESEARCH_PROJECT_GET_EMAIL_ADMIN } from "../../type/research/type";

// Env
import { config } from "../../utilis/config";
const conMain = config.connectMainAPI;

// GET E-MAIL ADMIN
export const getemail_admin =
  ({ token, buasri_id }) =>
  (dispatch) => {
    // Headers
    const config = {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
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
            type: RESEARCH_PROJECT_GET_EMAIL_ADMIN,
            payload: res.data,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
