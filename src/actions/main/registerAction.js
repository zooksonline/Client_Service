import axios from "axios";
import {
  returnErrors,
  // returnErrorsLdap,
  returnErrorsLdapRegis,
} from "../../actions/main/errorAction";
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  PAGE_LOADING,
} from "../../type/main/type";

// Env
import { config } from "../../utilis/config";
const connect = config.connectMainAPI;
const conphp = config.connectPHP;

// Register User
export const register =
  ({
    buasri_id,
    password,
    title,
    firstname,
    lastname,
    email,
    dep,
    position,
    type,
    active,
  }) =>
  (dispatch) => {
    // Headers
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    // Request body
    const body = JSON.stringify({
      buasri_id,
      title,
      firstname,
      lastname,
      email,
      dep,
      position,
      type,
      active,
    });
    const bodyLDAP = JSON.stringify({ buasri_id, password });

    axios
      .post(conphp + "/ldap.php", bodyLDAP, config)
      .then((ldap) => {
        if (ldap.data.Result) {
          // register สำเร็จ
          return axios
            .post(connect + "/api/register", body, config)
            .then((res) => {
              dispatch({
                type: REGISTER_SUCCESS,
                payload: res.data,
              });
            })
            .then(() =>
              dispatch({
                type: PAGE_LOADING,
              })
            )
            .catch((err) => {
              //   error ฝั่ง api
              dispatch(
                returnErrors(
                  err.response.data,
                  err.response.status,
                  "REGISTER_FAIL"
                )
              );
            });
        } else {
          //   error ฝั่ง php
          dispatch(returnErrorsLdapRegis());
        }
      })
      .catch((err) => {
        dispatch({
          type: REGISTER_FAIL,
        });
      });
  };
