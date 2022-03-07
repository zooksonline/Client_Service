import axios from "axios";
import {
  RESEARCH_GET_UPLOAD_FILE,
  LOADING_OVERLAY,
  RESEARCH_SEND_MAIL_COMMITTEE,
  RESEARCH_SEND_NO_COMMITTEE,
  COLLECT_TAG,
  STUDENT_TAG,
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
    .post(conResearch + "/api/upload", NewUploadFile, config)
    .then((res) => {
      dispatch({
        type: RESEARCH_GET_UPLOAD_FILE,
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
    data_email,
    count_email,
    year,
    title_name,
    firstname,
    lastname,
    position,
    buasri_id,
    email,
    article,
    type_name,
    request_number,
    register_number,
    journal_name,
    level,
    sub_level_1,
    sub_level_2,
    conf_year,
    conf_month,
    quartile,
    conference_name,
    conference_name_th,
    conf_country,
    conf_local,
    author,
    name,
    name_th,
    student,
    tags,
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
    const config_email = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    // body
    const body = JSON.stringify({
      year,
      title_name,
      firstname,
      lastname,
      position,
      buasri_id,
      email,
      article,
      type_name: type_name ? type_name : undefined,
      request_number: request_number ? request_number : undefined,
      register_number: register_number ? register_number : undefined,
      journal_name: journal_name ? journal_name : undefined,
      level,
      sub_level_1: sub_level_1 ? sub_level_1 : undefined,
      sub_level_2: sub_level_2 ? sub_level_2 : undefined,
      conf_year,
      conf_month: conf_month ? conf_month : undefined,
      quartile: quartile ? quartile : undefined,
      conference_name: conference_name ? conference_name : undefined,
      conference_name_th: conference_name_th ? conference_name_th : undefined,
      conf_country: conf_country ? conf_country : undefined,
      conf_local: conf_local ? conf_local : undefined,
      author,
      name,
      name_th: name_th ? name_th : undefined,
      student: student ? student : undefined,
      tags: tags ? tags : undefined,
      status,
      file_name,
      file_path,
    });
    // console.log(body);
    const body_email = JSON.stringify({
      email,
      data_email,
      count_email,
      title_name,
      firstname,
      lastname,
      research_name: name,
    });
    // console.log(body);
    axios
      .put(conResearch + "/api/list/add", body, config)
      .then((res) => {
        if (data_email && data_email.length === 0) {
          dispatch({
            type: RESEARCH_SEND_NO_COMMITTEE,
          });
        } else {
          // ส่งรอบแรก
          axios
            .post(
              conphp + "/research/form/email_form_committee.php",
              body_email,
              config_email
            )
            .then((resEmail) => {
              if (resEmail.data.Result) {
                // ส่งรอบสอง
                axios
                  .post(
                    conphp + "/research/form/email_form_sender.php",
                    body_email,
                    config_email
                  )
                  .then((resEmailSender) => {
                    if (resEmailSender.data.Result) {
                      dispatch({
                        type: RESEARCH_SEND_MAIL_COMMITTEE,
                      });
                    } else {
                      console.log("send email ไม่สำเร็จ");
                    }
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              } else {
                console.log("send email ไม่สำเร็จ");
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

// Collect Tags
export const collecttag = (tag) => ({
  type: COLLECT_TAG,
  payload: {
    tag,
  },
});

// Collect Student
export const collectstudent = (tag) => ({
  type: STUDENT_TAG,
  payload: {
    tag,
  },
});
