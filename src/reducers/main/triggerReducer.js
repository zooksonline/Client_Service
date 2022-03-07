import {
  PAGE_LOADED,
  PAGE_LOADING,
  SEND_ACTIVE_SERVICE,
} from "../../type/main/type";

const initialState = {
  load: false,
  active: false,
};

export default function LoadPage(state = initialState, action) {
  switch (action.type) {
    case PAGE_LOADING:
      return {
        ...state,
        load: true,
      };
    case SEND_ACTIVE_SERVICE:
      return {
        ...state,
        active: true,
      };
    case PAGE_LOADED:
      return {
        load: false,
        active: false,
      };
    default:
      return state;
  }
}
