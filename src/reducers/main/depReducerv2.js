import { SET_DEPARTMENT, CLOSE_DEPARTMENT } from "../../type/main/type";

const initialState = {
  list: null,
  loginError: null,
};

export default function department(state = initialState, action) {
  switch (action.type) {
    case SET_DEPARTMENT:
      return {
        list: "compare",
        loginError:
          "Sorry, it looks like the Username and/or Password you provided does not match our records",
      };
    case CLOSE_DEPARTMENT:
      return {
        list: null,
      };
    default:
      return state;
  }
}
