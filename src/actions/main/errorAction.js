import { GET_ERRORS, CLEAR_ERRORS } from "../../type/main/type";

// return error
export const returnErrors = (msg, status, id) => {
  return {
    type: GET_ERRORS,
    payload: { msg, status, id },
  };
};

// return error ldap
export const returnErrorsLdap = () => {
  return {
    type: GET_ERRORS,
    payload: {
      msg: { msg: "Buasri ID หรือ password ไม่ถูกต้อง" },
      status: "400",
      id: "LOGIN_FAIL",
    },
  };
};

// return error ldap register
export const returnErrorsLdapRegis = () => {
  return {
    type: GET_ERRORS,
    payload: {
      msg: { msg: "user หรือ password ไม่ถูกต้อง" },
      status: "400",
      id: "REGISTER_FAIL",
    },
  };
};

// Clear error
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS,
  };
};
