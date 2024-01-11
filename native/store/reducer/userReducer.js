import { CREATE_USER, LOGIN_USER,GET_USERS } from "../constans/constans";

const initialState = {
  users: [],
  userDetail: [],
  err: [],
  message: "",
};

const userReducers = (state = initialState, action) => {
  console.log(action);
  switch (action.type) {
    case CREATE_USER:
      return { ...state, users: state.users.concat(action.users) };
    case GET_USERS:
      return { ...state, users: action.users };
 
    default:
      return state;
  }
};

export default userReducers;
