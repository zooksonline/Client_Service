import axios from "axios";
import {
  RESEARCH_EDIT_UPDATE,
  LOADING_OVERLAY,
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

// POST EDIT LIST TO MONGO
export const newlist =
  ({
    token,
    data_email,
    count_email,
    user_email,
    _id,
    buasri_id,
    email,
    dep,
    firstname,
    lastname,
    position,
    research_name,
    research_name_th,
    article_type,
    level,
    level_sub1,
    level_sub2,
    type_name,
    request_number,
    register_number,
    journal_name,
    quartile,
    year,
    author_type,
    research_year,
    research_month,
    conference_name,
    conference_name_th,
    conf_country,
    conf_local,
    tags,
    student,
    note,
    file_name,
    file_path,
    status,
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
      token,
      data_email,
      count_email,
      _id,
      buasri_id,
      year,
      email,
      dep,
      firstname,
      lastname,
      position,
      level,
      level_sub1,
      level_sub2,
      article_type,
      research_name,
      research_name_th,
      research_year,
      quartile,
      author_type,
      note,
      tags,
      student,
      type_name,
      request_number,
      register_number,
      research_month,
      journal_name,
      conference_name,
      conference_name_th,
      conf_country,
      conf_local,
      file_name,
      file_path,
      status,
    });

    const body_email = JSON.stringify({
      data_email,
      count_email,
      user_email,
      firstname,
      lastname,
      research_name,
    });

    console.log(body);
    axios
      .post(conResearch + "/api/list/edit", body, config)
      .then((res) => {
        if (res.data && data_email && data_email.length !== 0) {
          axios
            .post(
              conphp + "/research/detail/email_edit_committee.php",
              body_email,
              config_email
            )
            .then((resEmail) => {
              if (resEmail.data.Result) {
                console.log("ส่งไปยัง Email Sender");
                axios
                  .post(
                    conphp + "/research/detail/email_edit_sender.php",
                    body_email,
                    config_email
                  )
                  .then((resEmailSender) => {
                    if (resEmailSender.data.Result) {
                      dispatch({
                        type: RESEARCH_EDIT_UPDATE,
                      });
                    }
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              } else {
                console.log("ส่งไม่สำเร็จ");
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } else if (res.data && data_email && data_email.length === 0) {
          dispatch({
            type: RESEARCH_EDIT_UPDATE,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
