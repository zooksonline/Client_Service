import {
  GET_ALL_SERVICE_USER,
  ERROR_GET_SERVICE,
  LOGOUT_SUCCESS,
  // GET_USER_SERVICE,
} from "../../type/main/type";

const initialState = {
  userlist: null,
};

export default function listuserReducer(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_SERVICE_USER:
      const list = action.payload;
      return list
        ? {
            userlist: list,
          }
        : {
            userlist: null,
          };
    case ERROR_GET_SERVICE:
      return {
        userlist: null,
      };
    case LOGOUT_SUCCESS:
      return {
        userlist: null,
      };
    default:
      return state;
  }
}
