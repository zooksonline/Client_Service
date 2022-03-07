import axios from "axios";
import {
  COMPLAINT_UPDATE_LIST,
  COMPLAINT_ERROR,
} from "../../type/complaint/type";

// Env
import { config } from "../../utilis/config";
const conComplaint = config.connectComplaintAPI;
const conphp = config.connectPHP;

// Update Status
export const sendUpdateStatus = (
  {
    id,
    buasri_id,
    member,
    status,
    topic,
    note,
    file_name,
    file_path,
    email,
    phone,
    status_before,
  },
  token
) => (dispatch) => {
  // Headers
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": token,
    },
  };
  // Headers
  const configemail = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const body = JSON.stringify({
    id,
    buasri_id,
    status,
    note,
    file_name,
    file_path,
  });

  const sendemail = JSON.stringify({
    id,
    email,
    phone,
    member,
    status,
    status_before,
    topic,
    note,
  });
  //   console.log(body);

  axios
    .put(conComplaint + "/api/update/status", body, config)
    .then((res) => {
      if (res) {
        axios
          .post(conphp + "/dev_update_user.php", sendemail, configemail)
          .then((res) => {
            if (res.data.Result) {
              axios
                .post(conphp + "/dev_update_admin.php", sendemail, configemail)
                .then((res) => {
                  if (res.data.Result) {
                    dispatch({
                      type: COMPLAINT_UPDATE_LIST,
                    });
                  }
                })
                .catch((err) => {
                  dispatch({
                    type: COMPLAINT_ERROR,
                    payload: err.data,
                  });
                });
            }
          })
          .catch((err) => {
            dispatch({
              type: COMPLAINT_ERROR,
              payload: err.data,
            });
          });
      }
    })
    .catch((err) => {
      dispatch({
        type: COMPLAINT_ERROR,
        payload: err.data,
      });
    });
};
