import {
  USER_LOGIN,
  USER_LOGIN_ERROR,
  LOGOUT_USER,
  CURRENT_USER,
  NOT_CURRENT_USER,
  PUT_USER,
} from "../constans/constans";

const initialState = {
  userDetail: {},
  login: "",
  message: "",
};

const jwtUserRducers= (state = initialState, action) => {
  switch (action.type) {
    /* ====== USERS LOGUINS ========== */

    case USER_LOGIN_ERROR:
      return {
        ...state,
        message: action.message,
      };
    case CURRENT_USER:
      return {
        ...state,
        userDetail: action.user,
      };
    case NOT_CURRENT_USER:
      return {
        ...state,
        message: action.message,
      };
    case LOGOUT_USER:
      return {
        ...state,
        userDetail: {},
      };
    case PUT_USER:
      return {
        ...state,
        userDetail: action.userDetail,
      };
    case USER_LOGIN:

    default:
      return state;
  }
}
export default jwtUserRducers;
