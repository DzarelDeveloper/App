import axios from 'axios';
import { CREATE_USER, UP_USER } from '../constans/constans';

// const env = require('../../env.js')
import { BACK_URL } from '../../env';
import Toast from 'react-native-toast-message';
//const {URL} = BACK_URL

// const localhost= env.localhost;

// CREAR USUARIO
export function userUp(code, onSuccess) {
	return (dispatch) => {
		// console.log(code);
		axios
			.get(`${BACK_URL}/api/emails/confirm/${code}`)
			.then((res) => {
				1;
				// console.log("Funciona el Action UPUSER");
				dispatch({
					type: UP_USER,
					user: res.data || {},
				});
				setTimeout(function () {
					Toast.show({
						type: 'success',
						position: 'top',
						text1: 'Felicidades',
						text2: 'Ahora puedes darte de alta',
						visibilityTime: 6000,
						autoHide: true,
						topOffset: 30,
						bottomOffset: 40,
					});
					onSuccess();
				}, 2000);
			})
			.catch((error) => {
				setTimeout(() => {
					Toast.show({
						type: 'error',
						position: 'top',
						text1: 'Error ingresar el token',
						text2: `Token incorrecto`,
						visibilityTime: 6000,
						autoHide: true,
						topOffset: 30,
						bottomOffset: 40,
					});
				}, 2000);
			});
	};
}
