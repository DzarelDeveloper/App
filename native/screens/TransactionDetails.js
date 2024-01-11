import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, TouchableOpacityComponent } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import { theme } from '../core/theme';
import { useDispatch, useSelector } from 'react-redux';
import { getTransactionById } from '../store/actions/acountActions';
import axios from 'axios';
// import { BACK_URL } from "../env";
import { Button } from 'react-native-paper';
const { height } = Dimensions.get('window');

export default function TransactionDetails({ navigation, route }) {
	const [details, setDetails] = useState({
		_id: '',
		from: {},
		to: {},
		amount: '',
		by: '',
		date: '',
		description: '',
		type: '',
	});

	const getOneTransaction = (_id) => {
		axios
			.get(`${process.env.BACK_URL}/api/accounts/transactionbyid`, { params: { _id } })
			.then((res) => {
				console.log(res.data);
				setDetails(res.data);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	useEffect(() => {
		getOneTransaction(route.params._id);
	}, [route.params]);

	return (
		<View>
			{details._id !== '' && (
				<View style={styles.container}>
					<View style={styles.rowI}>
						<Icon name='info-circle' color={theme.colors.primary} size={25} />
						<Text style={styles.title}> Detalles de la transacción</Text>
					</View>

					<View style={styles.icons}>
						<Icon name='user' color={'#ddd'} size={60} style={{ padding: 5 }} />
						<Icon name='exchange' color={'#ddd'} size={60} style={{ padding: 5 }} />
						<Icon name='user' color={'#ddd'} size={60} style={{ padding: 5 }} />
					</View>

					<View style={styles.row}>
						<Text style={styles.key}>Transacción:</Text>
						<Text style={styles.value}>{details.id} </Text>
					</View>

					<View style={styles.row}>
						<Text style={styles.key}>Desde la cuenta:</Text>
						<Text style={styles.value}>{details.from.account}</Text>
					</View>

					<View style={styles.row}>
						<Text style={styles.key}>A nombre de:</Text>
						<Text style={styles.value}>{details.from.user.name[0].toUpperCase() + details.from.user.name.slice(1)}</Text>
					</View>

					<View style={styles.row}>
						<Text style={styles.key}>Hacia la cuenta:</Text>
						<Text style={styles.value}>{details.to.account}</Text>
					</View>

					<View style={styles.row}>
						<Text style={styles.key}>A nombre de:</Text>
						<Text style={styles.value}>{details.to.user.name[0].toUpperCase() + details.to.user.name.slice(1)}</Text>
					</View>

					<View style={styles.row}>
						<Text style={styles.key}>Monto total:</Text>
						<Text style={styles.value}>{details.amount}</Text>
					</View>

					<View style={styles.row}>
						<Text style={styles.key}>Fecha:</Text>
						<Text style={styles.value}>{new Date(details.date).toDateString().substring(4, 15) + ' - ' + new Date(details.date).toLocaleTimeString()} </Text>
					</View>

					<View style={styles.row}>
						<Text style={styles.key}>Por medio de:</Text>
						<Text style={styles.value}>{details.by} </Text>
					</View>

					<View style={styles.row}>
						<Text style={styles.key}>Movimiento en la cuenta:</Text>
						{details.type === 'Transfer' ? <Text style={styles.value}>Egreso </Text> : <Text style={styles.value}>Ingreso </Text>}
					</View>

					<Text style={styles.foot}>HBank</Text>
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		height: height * 0.85,
		margin: 10,
		padding: 20,
		borderColor: '#ddd',
		borderRadius: 5,
		backgroundColor: 'white',
		elevation: 2,
	},
	icons: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingBottom: 30,
	},
	title: {
		textAlign: 'center',
		fontSize: 20,
		fontWeight: 'bold',
		color: theme.colors.primary,
		paddingVertical: 30,
		paddingBottom: 30,
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingBottom: 15,
	},
	rowI: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	key: {
		color: theme.colors.secondary,
		fontWeight: 'bold',
	},
	value: {
		color: theme.colors.secondary,
	},
	foot: {
		fontSize: 30,
		padding: 10,
		color: '#ddd',
		fontWeight: 'bold',
		textAlign: 'center',
	},
});
