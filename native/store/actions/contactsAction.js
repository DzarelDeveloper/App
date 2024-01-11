import axios from 'axios';
import { GET_CONTACTS, ADD_CONTACT_EMAIL, DELETE_CONTACT } from '../constans/constans';

import { BACK_URL } from '../../env';
import Toast from 'react-native-toast-message';

export function getContacts(id) {
	return (dispatch) => {
		axios
			.get(`${BACK_URL}/api/contacts/getContacts/`, {
				params: {
					_id: id,
				},
			})
			.then((res) => {
				dispatch({
					type: GET_CONTACTS,
					contacts: res.data || [],
				});
			})
			.catch((error) => {
				console.log(error);
			});
	};
}

export function addContact(currentId, email, id) {
	return (dispatch) => {
		axios
			.post(`${BACK_URL}/api/contacts/`, { _id: currentId, email: email })
			.then((res) => {
				dispatch({
					type: ADD_CONTACT_EMAIL,
					contact: res.data || [],
				});
				dispatch(getContacts(id ? id : null));
				Toast.show({
					type: 'success',
					position: 'top',
					text1: 'Contacto agregado',
					visibilityTime: 6000,
					autoHide: true,
					topOffset: 30,
					bottomOffset: 40,
				});
			})
			.catch((error) => {
				console.log(error);
			});
	};
}
export function deleteContact(email, id, OnSucess) {
	return (dispatch) => {
		axios
			.delete(`${BACK_URL}/api/contacts/`, {
				params: { email: email, idUserLoggedIn: id },
			})
			.then((res) => {
				dispatch({
					type: DELETE_CONTACT,
					contactD: res.data || [],
				});
				setTimeout(function () {
					Toast.show({
						type: 'success',
						position: 'top',
						text1: 'Contacto eliminado',
						visibilityTime: 6000,
						autoHide: true,
						topOffset: 30,
						bottomOffset: 40,
					});
					OnSucess();
				}, 3000);
			})
			.catch((error) => {
				Toast.show({
					type: 'error',
					position: 'top',
					text1: error.message,
					visibilityTime: 6000,
					autoHide: true,
					topOffset: 30,
					bottomOffset: 40,
				});
			});
	};
}
