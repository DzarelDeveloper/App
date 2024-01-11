import jwtUserRducers from "./jwtUsersReducers";
import userReducers from "./userReducer";
import userUpReducers from './upUserReducer'
import acoountReducers from './accountReducer'
import contactReducers from './contactsreducer'

import { combineReducers } from "redux";

const mainReducers = combineReducers({
  users: userReducers,
  session: jwtUserRducers,
  userUp: userUpReducers,
  acoount : acoountReducers,
  contacts: contactReducers
});

export default mainReducers;
