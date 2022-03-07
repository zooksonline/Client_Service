import axios from "axios";
import {
  COMPLAINT_GET_UPLOAD_FILE,
  COMPLAINT_ADD_LIST,
  COMPLAINT_ERROR,
} from "../../type/complaint/type";

// Env
import { config } from "../../utilis/config";
const conComplaint = config.connectComplaintAPI;
const conphp = config.connectPHP;

// Upload File
export const uploadfile = (NewUploadFile, token) => (dispatch) => {
  // Headers
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      "x-auth-token": token,
    },
  };
  axios
    .post(conComplaint + "/api/list/upload", NewUploadFile, config)
    .then((res) => {
      dispatch({
        type: COMPLAINT_GET_UPLOAD_FILE,
        payload: res.data,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

// PUT LIST TO MONGODB
export const newlist =
  ({
    token,
    buasri_id,
    member,
    email,
    phone,
    type,
    topic,
    detail,
    status,
    file_name,
    file_path,
  }) =>
  (dispatch) => {
    // Headers
    const config = {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
    };

    const configemail = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const body = JSON.stringify({
      buasri_id,
      type,
      member,
      email,
      phone,
      topic,
      detail,
      status,
      file_name,
      file_path,
    });

    const sendemail = JSON.stringify({
      type,
      member,
      email,
      phone,
      topic,
      detail,
    });
    axios
      .put(conComplaint + "/api/list/user/add", body, config)
      .then((res) => {
        if (res) {
          axios
            .post(conphp + "/dev_add_user.php", sendemail, configemail)
            .then((res) => {
              if (res.data.Result) {
                axios
                  .post(conphp + "/dev_add_admin.php", sendemail, configemail)
                  .then((res) => {
                    if (res.data.Result) {
                      dispatch({
                        type: COMPLAINT_ADD_LIST,
                      });
                    }
                  })
                  .catch((err) => {
                    dispatch({
                      type: COMPLAINT_ERROR,
                      payload: err,
                    });
                  });
              }
            })
            .catch((err) => {
              dispatch({
                type: COMPLAINT_ERROR,
                payload: err,
              });
            });
        }
      })
      .catch((err) => {
        dispatch({
          type: COMPLAINT_ERROR,
          payload: err,
        });
      });

    //
    axios
      .post(conphp + "/dev_add_user.php", sendemail, configemail)
      .then((res) => {
        if (res.data.Result) {
          console.log("OK");
        }
        if (!res.data.Result) {
          console.log("Not OK");
        }
      });
  };
