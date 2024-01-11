import {
  GET_CONTACTS,
  EDIT_CONTACT,
  ADD_CONTACT_EMAIL,
  ADD_CONTACT_PHONE,
  DELETE_CONTACT,
  SEND_WHATSAPP,
} from "../constans/constans";

const initialState = {

  contacts: [],
  contact: [],
  contactD: [],
  message: [],
};

const contactsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CONTACTS:
      return {
        ...state,
        contacts: action.contacts,
      };
    case EDIT_CONTACT:
      return {
        ...state,
        message: action.message,
      };
    case ADD_CONTACT_EMAIL:
      return {
        ...state,
        contact: action.contact,
      };
    case ADD_CONTACT_PHONE:
      return {
        ...state,
        contact: action.contact,
      };
    case DELETE_CONTACT:
      return {
        ...state,
        contactD: action.contactD,
      };
    case SEND_WHATSAPP:
      return {
        ...state,
        message: action.message,
      };

    default:
      return state;
  }
};

export default contactsReducer;