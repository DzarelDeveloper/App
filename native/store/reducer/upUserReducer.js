import { UP_USER } from "../constans/constans";

const initialState = {
  users: [],
  userDetail: [],
  err: [],
  message: "",
  userUp:{}
};

const userUpReducers = (state = initialState, action) => {
  console.log(action);
  switch (action.type) {
    case UP_USER:
      return { ...state, userUp: action.user };
    // case LOGIN_USER:
    //   return { user: action.users };
    default:
      return state;
  }
};

export default userUpReducers;