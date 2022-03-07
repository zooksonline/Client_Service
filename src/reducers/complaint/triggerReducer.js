import {
  COMPLAINT_CLEAN_TRIGGER,
  COMPLAINT_ADD_LIST,
  COMPLAINT_UPDATE_LIST,
} from "../../type/complaint/type";

const initialState = {
  addlist: false,
  updatestatus: false,
};

export default function triggerReducer(state = initialState, action) {
  switch (action.type) {
    case COMPLAINT_ADD_LIST:
      return {
        ...state,
        addlist: true,
      };
    case COMPLAINT_UPDATE_LIST:
      return {
        ...state,
        updatestatus: true,
      };
    case COMPLAINT_CLEAN_TRIGGER:
      return {
        updatestatus: false,
        addlist: false,
      };
    default:
      return state;
  }
}
