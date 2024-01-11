import axios from 'axios';
import { GET_ACCOUNT, RECHARGE_QR, RECHARGE_CARD, TRANSFER_MONEY, GET_TRANSACTIONS, GET_TRANSACTIONS_DOLAR, GET_TRANSACTIONS_PESOS, GET_TRANSACTIONS_DOLLARS, GET_TRANSACTIONS_PESOS_GRAP, BALANCE_PESOS_EGRESOS, BALANCE_PESOS_INGRESOS } from '../constans/constans';

import { BACK_URL } from '../../env';
import Toast from 'react-native-toast-message';

export function getAccount(id) {
	return (dispatch) => {
		axios
			.get(`${BACK_URL}/api/accounts/getAccounts/`, {
				params: {
					_id: id,
				},
			})
			.then((res) => {
				// console.log(res.data);
				dispatch({
					type: GET_ACCOUNT,
					data: res.data || [],
				});
			})
			.catch((error) => {
				console.log(error);
			});
	};
}

export function rechargeByQr(data, cvuDollars, cvuPesos) {
	return (dispatch) => {
		// console.log(data);
		axios
			.post(`${BACK_URL}/api/accounts/rechargebyqr/`, data)
			.then((res) => {
				// console.log(res.data);
				dispatch({
					type: RECHARGE_QR,
					data: res.data || {},
				});
				dispatch(getDollarsTransactions(cvuDollars));
				dispatch(getPesosTransactions(cvuPesos));
				setTimeout(() => {
					Toast.show({
						type: 'success',
						position: 'top',
						text1: ` Transaccion exitosa ... `,
						visibilityTime: 3000,
						autoHide: true,
						topOffset: 30,
						bottomOffset: 40,
					});
				}, 3000);

				Toast.show({
					type: 'success',
					position: 'top',
					text1: `Cargando ... `,
					visibilityTime: 2000,
					autoHide: true,
					topOffset: 30,
					bottomOffset: 40,
				});
			})
			.catch((error) => {
				Toast.show({
					type: 'error',
					position: 'top',
					text1: `${error.message} `,
					visibilityTime: 2000,
					autoHide: true,
					topOffset: 30,
					bottomOffset: 40,
				});
			});
	};
}

export function rechargeByCard(data, cvuDollars, cvuPesos) {
	return (dispatch) => {
		// console.log("***est este***");
		// console.log(data);
		axios
			.post(`${BACK_URL}/api/accounts/rechargebycard`, data)
			.then((res) => {
				// console.log("*****res card recharse***");
				dispatch({
					type: RECHARGE_CARD,
					data: res.data || {},
				});
				dispatch(getDollarsTransactions(cvuDollars));
				dispatch(getPesosTransactions(cvuPesos));
				setTimeout(() => {
					Toast.show({
						type: 'success',
						position: 'top',
						text1: ` Transaccion exitosa ... `,
						visibilityTime: 3000,
						autoHide: true,
						topOffset: 30,
						bottomOffset: 40,
					});
				}, 3000);

				Toast.show({
					type: 'success',
					position: 'top',
					text1: `Cargando ... `,
					visibilityTime: 2000,
					autoHide: true,
					topOffset: 30,
					bottomOffset: 40,
				});
			})
			.catch((error) => {
				Toast.show({
					type: 'error',
					position: 'top',
					text1: `${error.message} `,
					visibilityTime: 2000,
					autoHide: true,
					topOffset: 30,
					bottomOffset: 40,
				});
			});
	};
}

export function transferMoney(data, cvuDollars, cvuPesos) {
	return (dispatch) => {
		// console.log('Transfer Money');
		// console.log(data);

		axios
			.post(`${BACK_URL}/api/accounts/transfer`, data)
			.then((res) => {
				// console.log("Transferencia exitosa", res.data);
				dispatch({
					type: TRANSFER_MONEY,
					data: res.data || {},
				});
				dispatch(getDollarsTransactions(cvuDollars));
				dispatch(getPesosTransactions(cvuPesos));
			})
			.catch((error) => {
				Toast.show({
					type: 'error',
					position: 'top',
					text1: `${error.message} `,
					visibilityTime: 2000,
					autoHide: true,
					topOffset: 30,
					bottomOffset: 40,
				});
				// onSuccess();
			});
	};
}

export function getTransactions(data) {
	return (dispatch) => {
		// console.log("Get transactions");
		// // console.log(data);

		axios
			.get(`${BACK_URL}/api/accounts/transactions`, {
				params: {
					cvu: data,
				},
			})
			.then((res) => {
				// console.log("Estas son las transacciones", res.data);
				dispatch({
					type: GET_TRANSACTIONS,
					data: res.data || [],
				});
			})
			.catch((error) => {
				console.log('Error en la consulta', error);
			});
	};
}

export function getTransactionsDolar(data) {
	return (dispatch) => {
		axios
			.get(`${BACK_URL}/api/accounts/transactions`, {
				params: {
					cvu: data,
				},
			})
			.then((res) => {
				// console.log("Estas son las transacciones dolar", res.data);
				dispatch({
					type: GET_TRANSACTIONS_DOLAR,
					data: res.data || [],
				});
			})
			.catch((error) => {
				console.log('Error en la consulta', error);
			});
	};
}

export function getTransactionsPesos(data) {
	return (dispatch) => {
		axios
			.get(`${BACK_URL}/api/accounts/transactions`, {
				params: {
					cvu: data,
				},
			})
			.then((res) => {
				// console.log("Estas son las transacciones Pesos", res.data);
				dispatch({
					type: GET_TRANSACTIONS_PESOS_GRAP,
					data: res.data || [],
				});
			})
			.catch((error) => {
				console.log('Error en la consulta', error);
			});
	};
}

// GET transacciones en pesos
export function getPesosTransactions(data) {
	return (dispatch) => {
		// console.log('Get transactions');
		// console.log(data);
		axios
			.get(`${BACK_URL}/api/accounts/transactions`, {
				params: {
					cvu: data,
				},
			})
			.then((res) => {
				// console.log('Estas son las transacciones', res);
				dispatch({
					type: GET_TRANSACTIONS_PESOS,
					data: res.data || {},
				});
			})
			.catch((error) => {
				// console.log('Error en la consulta', error);
			});
	};
}

// GET transacciones en dolares
export function getDollarsTransactions(data) {
	return (dispatch) => {
		// console.log('Get transactions');
		// console.log(data);
		axios
			.get(`${BACK_URL}/api/accounts/transactions`, {
				params: {
					cvu: data,
				},
			})
			.then((res) => {
				// console.log('Estas son las transacciones', res);
				return new Promise((resolve, reject) => {
					dispatch({
						type: GET_TRANSACTIONS_DOLLARS,
						data: res.data || {},
					});
					resolve();
				});
			})
			.catch((error) => {
				console.log('Error en la consulta', error);
			});
	};
}

export function balancePesosIn(data) {
	return (dispatch) => {
		// console.log('Get transactions');
		console.log(data);
		dispatch({
			type: BALANCE_PESOS_INGRESOS,
			payload: data,
		});
	};
}

export function balancePesosOut(data) {
	return (dispatch) => {
		// console.log('Get transactions');
		console.log(data);
		dispatch({
			type: BALANCE_PESOS_EGRESOS,
			payload: data,
		});
	};
}
