import axios from 'axios';
import jwt_decode from 'jwt-decode';

import { BACK_URL } from '../../env';

import Toast from 'react-native-toast-message';

import AsyncStorage from '@react-native-async-storage/async-storage';

// const {URL} = BACK_URL

import * as actionTypes from '../constans/constans';
// const env = require('../../env.js')
import { getDollarsTransactions, getPesosTransactions } from './acountActions';
// const localhost= env.localhost;

//loguin  -> funciona loguin correcto e incorrecto.
export const loguinUser = (email, password, onSuccess) => (dispatch) => {
	axios
		.post(`${BACK_URL}/api/auth/login`, {
			email: email,
			password: password,
		})
		.then((res) => {
			const token = res.data;
			var decoded = jwt_decode(token);

			// console.log('soy el token',token);
			if (token) {
				AsyncStorage.setItem('@token', token);
				dispatch({
					type: actionTypes.USER_LOGIN,
				});
				dispatch(getCurrentUser(token, true));
				setTimeout(function () {
					onSuccess();
				}, 1500);
			}
		})
		.catch((error) => {
			setTimeout(function () {
				Toast.show({
					type: 'error',
					position: 'top',
					text1: 'Login incorrecto',
					text2: `Email o password incorrecto`,
					visibilityTime: 6000,
					autoHide: true,
					topOffset: 30,
					bottomOffset: 40,
				});
			}, 1500);
		});
};

//obtener información del usuario logueado
export const getCurrentUser = (token, login) => async (dispatch) => {
	//Headers con Token
	var decoded = jwt_decode(token);
	// console.log(typeof decoded.id);
	axios
		.get(`${BACK_URL}/api/users/by-id`, {
			params: {
				_id: decoded.id,
			},
		})
		.then((res) => {
			dispatch({
				type: actionTypes.CURRENT_USER,
				user: res.data,
			});
			if (login) {
				setTimeout(function () {
					Toast.show({
						type: 'success',
						position: 'top',
						text1: `Bienvenido ${res.data.username} `,
						visibilityTime: 2000,
						autoHide: true,
						topOffset: 30,
						bottomOffset: 40,
					});
				}, 1500);
			}
			dispatch(getDollarsTransactions(res.data.accounts[1].cvu));
			dispatch(getPesosTransactions(res.data.accounts[0].cvu));
		})
		.catch((error) => {
			setTimeout(function () {
				Toast.show({
					type: 'error',
					position: 'top',
					text1: 'Error',
					text2: `${error.message}`,
					visibilityTime: 6000,
					autoHide: true,
					topOffset: 30,
					bottomOffset: 40,
				});
			}, 1500);
		});
};

export const verifySession = () => async (dispatch) => {
	//const { token } = AsyncStorage;
	const token = await AsyncStorage.getItem('@token');
	if (token) {
		//alert('usuario logeado');
		dispatch(getCurrentUser(token, false));
	} else {
		dispatch({
			type: actionTypes.NOT_CURRENT_USER,
			message: 'No hay un usuario logueado.',
		});
	}
};

//logout
export const logoutUser = (onSuccess) => (dispatch) => {
	Toast.show({
		type: 'info',
		position: 'top',
		text1: 'Cerraste sesión',
		visibilityTime: 3 * 1000,
		autoHide: true,
		topOffset: 30,
		bottomOffset: 40,
	});
	dispatch({
		type: actionTypes.LOGOUT_USER,
	});
	dispatch({
		type: actionTypes.DELETE_ALL_CART,
	});
	AsyncStorage.removeItem('@token');
};

// export const passwordChange = (id, values) => (dispatch) => {
//   return axios
//     .put(`${url}/users/${id}/passwordChange`, values)
//     .then((res) => {
//       dispatch({
//         type: actionTypes.USER_PUT_PASSWORD,
//         pass: res.data,
//       });
//       toast.fire({
//         icon: "success",
//         title: "Ha modificado su contraseña con exito!",
//       });
//     })
//     .catch((error) => {
//       console.log(error);
//       Toast.fire({
//         icon: "error",
//         title: "Error: No se ha podido actualizar la contraseña",
//       });
//     });
// };
