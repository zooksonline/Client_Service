import axios from "axios";
import { PROJECT_FORM_LOG } from "../../type/research/type";

// Env
import { config } from "../../utilis/config";
const conResearch = config.connectResearchAPI;

export const newlog =
  ({
    token,
    research_id,
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
  }) =>
  (dispatch) => {
    // Header
    const config = {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
    };
    // body
    const body = JSON.stringify({
      research_id,
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
    console.log(body);
    axios
      .post(conResearch + "/api/logs/projectadd", body, config)
      .then((res) => {
        dispatch({
          type: PROJECT_FORM_LOG,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
