import axios from "axios";
import {
  RESEARCH_PROJECT_EDIT_UPDATE,
  LOADING_OVERLAY,
} from "../../type/research/type";

// Env
import { config } from "../../utilis/config";
const conResearch = config.connectResearchAPI;
const comphp = config.connectPHP;

// loadingOverlay
export const loadingoverlay = () => (dispatch) => {
  dispatch({
    type: LOADING_OVERLAY,
  });
};

// POST EDIT LIST TO MONGO
export const newlist =
  ({ token }) =>
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
  };
