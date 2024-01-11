import axios from 'axios';
import { CREATE_USER, LOGIN_USER, UPDATE_USER, GET_USERS } from '../constans/constans';
import { BACK_URL } from '../../env';
import Toast from 'react-native-toast-message';
import { verifySession } from './jwtUsersActions';
// const {URL} = BACK_URL

/* * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Acción para crear usuario (Desde Register Screen) *
 * * * * * * * * * * * * * * * * * * * * * * * * * * */
export function createUser(userData, onSuccess) {
	const dataUser = {
		username: userData.username,
		email: userData.email,
		dni: userData.dni,
		password: userData.password,
	};
	return (dispatch) => {
		// console.log(BACK_URL);

		axios
			.post(`${BACK_URL}/api/users/create`, dataUser)
			.then((res) => {
				// console.log(res.data);
				dispatch({
					type: CREATE_USER,
					users: res.data || {},
					createUserSuccess: true,
				});
				setTimeout(function () {
					onSuccess();
					Toast.show({
						type: 'success',
						position: 'top',
						text1: 'Registro exitoso',
						text2: 'Por favor verifique su correo',
						visibilityTime: 6000,
						autoHide: true,
						topOffset: 30,
						bottomOffset: 40,
					});
				}, 3000);
			})
			.catch((error) => {
				console.log(error);
				setTimeout(function () {
					Toast.show({
						type: 'error',
						position: 'top',
						text1: 'Error al registrarse',
						text2: `${error.message.emailError}`,
						visibilityTime: 6000,
						autoHide: true,
						topOffset: 30,
						bottomOffset: 40,
					});
				}, 2000);
			});
	};
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Acción para completar registro usuario(Desde AltaUser Screen) *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
export function completeUserRegister(userData, onSuccess) {
	// console.log(userData);
	const { name, lastname, dni, phone, address, dob, _id, province, city } = userData;
	const dataUser = { name, lastname, dni, phone, address, dob, _id, province, city };
	console.log('DATA USER', dataUser);

	return (dispatch) => {
		axios
			.put(`${BACK_URL}/api/users/update`, dataUser)
			.then((res) => {
				// console.log("User updated", res.data);
				dispatch({ type: UPDATE_USER, users: res.data });
				setTimeout(function () {
					onSuccess();
					Toast.show({
						type: 'success',
						position: 'top',
						text1: 'Alta exitosa',
						text2: 'Ahora puede disfrutar de su henry bank',
						visibilityTime: 6000,
						autoHide: true,
						topOffset: 30,
						bottomOffset: 40,
					});
				}, 3000);
			})
			.catch((error) => {
				setTimeout(() => {
					Toast.show({
						type: 'error',
						position: 'top',
						text1: 'Error al darse de alta',
						text2: `${error.message}`,
						visibilityTime: 6000,
						autoHide: true,
						topOffset: 30,
						bottomOffset: 40,
					});
				}, 2000);
			});
	};
}

//action para modificar el avatar
export function updateUserAvatar(userData) {
	console.log('data usuario', userData);
	console.log('entramos aca');
	return (dispatch) => {
		axios.put(`${BACK_URL}/api/users/updateAvatar`, userData).then((res) => {
			console.log('User updated', res.data);
			dispatch(verifySession());
			return res;
		});
	};
}

export function getUsers() {
	return (dispatch) => {
		axios
			.get(`${BACK_URL}/api/users/all`)
			.then((res) => {
				// console.log('proveniente de get users');
				dispatch({ type: GET_USERS, users: res.data || [] });
			})
			.catch((error) => {
				console.log(error);
			});
	};
}

export function clearUserState() {
	return (dispatch) => {
		dispatch({ type: GET_USERS, users: [] });
	};
}

export function search() {
	return (dispatch) => {
		dispatch({ type: GET_USERS, users: [] });
	};
}
