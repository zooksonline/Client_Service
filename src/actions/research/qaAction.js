import axios from "axios";
import { RESEARCH_UPDATE_STATUS } from "../../type/research/type";

// Env
import { config } from "../../utilis/config";
const conQA = config.connectQAAPI;

export const add_qa =
  ({
    token,
    buasri_id,
    firstname,
    lastname,
    dep,
    email,
    year_at,
    research_id,
    research_name,
    research_year,
    article,
    level,
    sub_level_1,
    sub_level_2,
    quartile,
    type_name,
    request_number,
    journal_name,
    research_month,
    conf_name,
    country,
    local,
    author,
    tags,
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
    const body = JSON.stringify({
      buasri_id,
      firstname,
      lastname,
      dep,
      email,
      year_at,
      research_id,
      research_name,
      research_year,
      article,
      level,
      sub_level_1,
      sub_level_2,
      quartile,
      type_name,
      request_number,
      journal_name,
      research_month,
      conf_name,
      country,
      local,
      author,
      tags,
      file_name,
      file_path,
    });

    console.log("ส่งไป API QA " + body);
    axios
      .post(conQA + "/api/research/add", body, config)
      .then((resQA) => {
        if (resQA) {
          dispatch({
            type: RESEARCH_UPDATE_STATUS,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
