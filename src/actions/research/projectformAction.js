import axios from "axios";
import {
  RESEARCH_PROJECT_SEND_MAIL_ADMIN,
  RESEARCH_GET_PROJECT_UPLOAD_FILE,
  LOADING_OVERLAY,
  RESEARCH_PROJECT_SEND_NO_ADMIN,
} from "../../type/research/type";

// Env
import { config } from "../../utilis/config";
const conResearch = config.connectResearchAPI;
const conphp = config.connectPHP;

// loadingOverlay
export const loadingoverlay = () => (dispatch) => {
  dispatch({
    type: LOADING_OVERLAY,
  });
};

// PUT LIST TO MONGODB
export const newlist =
  ({
    token,
    buasri_id,
    title_name,
    firstname,
    lastname,
    position,
    email,
    data_email_admin,
    count_email,
    project_name,
    funds_type,
    funds,
    project_type,
    datetime,
    file_name,
    file_path,
    project_status,
  }) =>
  (dispatch) => {
    // Headers
    const config = {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
    };
    const config_email = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    // body
    const body = JSON.stringify({
      buasri_id,
      title_name,
      firstname,
      lastname,
      position,
      email,
      project_name,
      funds_type,
      funds,
      project_type,
      datetime,
      file_name,
      file_path,
      project_status,
    });
    // console.log("action" + body);
    const body_email = JSON.stringify({
      email,
      data_email_admin,
      count_email,
      title_name,
      firstname,
      lastname,
      project_name,
    });
    axios.put(conResearch + "/api/project/add", body, config).then((res) => {
      if (data_email_admin && data_email_admin.length === 0) {
        dispatch({
          type: RESEARCH_PROJECT_SEND_NO_ADMIN,
        });
      } else {
        // ส่งรอบแรก
        axios
          .post(
            conphp + "/research/project/form/email_form_admin.php",
            body_email,
            config_email
          )
          .then((resEmail) => {
            if (resEmail.data.Result) {
              // ส่งรอบสอง
              axios
                .post(
                  conphp + "/research/project/form/email_form_sender.php",
                  body_email,
                  config_email
                )
                .then((resEmailSender) => {
                  if (resEmailSender.data.Result) {
                    dispatch({
                      type: RESEARCH_PROJECT_SEND_MAIL_ADMIN,
                    });
                  } else {
                    console.log("send email se ไม่สำเร็จ");
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            } else {
              console.log("send email ad ไม่สำเร็จ");
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  };

// Upload File
export const project_uploadfile = (NewUploadFile, token) => (dispatch) => {
  // console.log("sent_upload: " + NewUploadFile);
  // Headers
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      "x-auth-token": token,
    },
  };
  axios
    .post(conResearch + "/api/upload/project", NewUploadFile, config)
    .then((res) => {
      dispatch({
        type: RESEARCH_GET_PROJECT_UPLOAD_FILE,
        payload: res.data,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};
