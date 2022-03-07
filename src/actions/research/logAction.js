import axios from "axios";
import { FORM_LOG } from "../../type/research/type";

// Env
import { config } from "../../utilis/config";
const conResearch = config.connectResearchAPI;

export const newlog =
  ({
    token,
    research_id,
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
    research_year,
    conference_month,
    quartile,
    conference_name,
    conference_name_th,
    conference_country,
    conference_local,
    author,
    name,
    name_th,
    status,
    note,
    student,
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

    // body
    const body = JSON.stringify({
      research_id,
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
      research_year: research_year ? research_year : undefined,
      conference_month: conference_month ? conference_month : undefined,
      quartile: quartile ? quartile : undefined,
      conference_name: conference_name ? conference_name : undefined,
      conference_name_th: conference_name_th ? conference_name_th : undefined,
      conference_country: conference_country ? conference_country : undefined,
      conference_local: conference_local ? conference_local : undefined,
      author,
      name,
      name_th: name_th ? name_th : undefined,
      status,
      note: note ? note : undefined,
      tags: tags ? tags : undefined,
      student: student ? student : undefined,
      file_name,
      file_path,
    });

    // console.log(body);
    axios
      .post(conResearch + "/api/logs/add", body, config)
      .then((res) => {
        dispatch({
          type: FORM_LOG,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
