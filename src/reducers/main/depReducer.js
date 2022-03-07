import { SET_DEPARTMENT, CLOSE_DEPARTMENT } from "../../type/main/type";

const initialState = {
  list: null,
};

export default function department(state = initialState, action) {
  switch (action.type) {
    case SET_DEPARTMENT:
      const setDepartment = action.payload;
      return setDepartment
        ? {
            list: setDepartment,
          }
        : {
            list: null,
          };
    case CLOSE_DEPARTMENT:
      return {
        list: null,
      };
    default:
      return state;
  }
}
