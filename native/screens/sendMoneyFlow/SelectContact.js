import React, { useEffect, useState,useCallback } from "react";
import {
    getAccount,
    getDollarsTransactions,
    getPesosTransactions,
  } from "../../store/actions/acountActions";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { theme } from '../../core/theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import Button from '../../components/Button';
import { useDispatch, useSelector } from 'react-redux';
import { getContacts } from '../../store/actions/contactsAction'

const { width, height } = Dimensions.get('window');

const SummaryItem = ({ keyName, value }) => {

	if (keyName === 'Nombre' && value.length > 1) {
		let completeName = value.split(' ')
		let firstName = completeName[0][0].toUpperCase() + completeName[0].slice(1);
		let lastName = completeName[1][0].toUpperCase() + completeName[1].slice(1);
		value = firstName + ' ' + lastName;
	}

	return (
		<View style={styles.summary}>
			<Text style={styles.summaryKey}>{keyName}: </Text>
			<Text style={styles.summaryValue}>{value}</Text>
		</View>
	);
};

export default function SelectContact({ navigation }) {

	const dispatch = useDispatch();
	const session = useSelector((state) => state.session.userDetail);
	const accounts = useSelector((state) => state.acoount.account);
	const contacts = useSelector((state) => state.contacts.contacts);
    const pesosAccount = accounts[0];
	const dollarsAccount = accounts[1];
	
	const cvuP = pesosAccount && pesosAccount.cvu;
	const cvuD = dollarsAccount && dollarsAccount.cvu;

	useEffect(() => {
		let id = session._id
		dispatch(getContacts(id))
		dispatch(getDollarsTransactions(cvuD));
        dispatch(getPesosTransactions(cvuP));
	}, []);

	const [selected, setSelected] = useState({
		name: '',
		lastname: '',
		email: '',
		accounts: {},
		phone: '',
		username: ''
	});

	const handleSelect = (contact) => {
		setSelected(contact);
	};

	return (
		<ScrollView backgroundColor={'white'}>
			<View>

				<View style={styles.header}>
					<Image source={require('../../assets/background2.png')} style={{ position: 'absolute' }} />
					<View style={styles.rowII}>
						<Icon name='user' color={'white'} size={30} />
						<Text style={styles.title}> Transferir dinero </Text>
					</View>
					<Text style={styles.instruction}> ¡Empecemos! Primero elige a quién le vas a enviar dinero </Text>
				</View>

				<View style={styles.contactContainer}>
					<Text style={styles.contactTitle}> Selecciona el contacto que recibirá la transferencia </Text>
					<ScrollView>
						{contacts.length > 0 ?
							contacts.map((contact, i) => (
								<TouchableOpacity style={styles.contactList} name={contact} onPress={() => handleSelect(contact)} key={i}>
									<View style={{ flexDirection: 'row', alignItems: 'center' }}>
										<Icon name='user' color={'#ddd'} size={15} />
										<Text style={styles.name}>{contact.name[0].toUpperCase() + contact.name.slice(1)} </Text>
									</View>

									<Text style={styles.complement}>{contact.email}</Text>
								</TouchableOpacity>
							)) :
							null
						}
					</ScrollView>
				</View>

				<View>
					<Text style={styles.summaryTitle}> Se hará la transferencia a: </Text>
					<View style={styles.summaryContent}>
						<SummaryItem keyName={'Nombre'} value={selected.name + ' ' + selected.lastname} />
						<SummaryItem keyName={'Correo'} value={selected.email} />
						<SummaryItem keyName={'Teléfono'} value={selected.phone} />
						<SummaryItem keyName={'Usuario'} value={selected.username.length > 0 && '@' + selected.username} />
					</View>
				</View>

				<View style={styles.buttonContainer}>
					<Button
						mode='contained'
						disabled={selected.name.length > 0 ? false : true}
						secureTextEntry={true}
						style={selected.name.length > 0 ? styles.button : { ...styles.button, backgroundColor: '#ddd' }}
						onPress={() => navigation.navigate('FinishSend', selected)}>
						Siguiente
					</Button>
				</View>
				
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	header: {
		width: '100%',
		paddingLeft: 15,
	},
	rowI: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	rowII: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 35,
		justifyContent: 'center',
	},
	cancel: {
		color: 'white',
		alignItems: 'center',
		marginLeft: 5,
	},
	title: {
		textAlign: 'center',
		fontSize: 20,
		fontWeight: 'bold',
		color: 'white',
		paddingLeft: 5,
	},
	instruction: {
		textAlign: 'center',
		fontSize: 12,
		color: 'white',
		paddingBottom: 15,
	},
	contactContainer: {
		padding: 17,
		backgroundColor: '#fff',
		borderColor: theme.colors.secondary,
		height: parseInt(height * 0.35),
		margin: 10,
		borderRadius: 5,
		elevation: 1,
	},
	contactTitle: {
		textAlign: 'center',
		fontSize: 12,
		color: theme.colors.secondary,
		paddingBottom: 15,
		fontWeight: 'bold',
	},
	contactList: {
		fontSize: 15,
		paddingTop: 12,
		paddingBottom: 12,
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	name: {
		paddingLeft: 10,
		color: theme.colors.secondary,
		fontWeight: 'bold',
	},
	complement: {
		color: theme.colors.secondary,
		fontSize: 12,
	},
	summaryTitle: {
		color: theme.colors.secondary,
		fontWeight: 'bold',
		textAlign: 'center',
		fontSize: 15,
		padding: 10,
	},
	summaryContent: {
		marginLeft: 10,
		marginRight: 10,
		padding: 17,
		borderWidth: 0.2,
		borderColor: theme.colors.primary,
		borderRadius: 5,
	},
	summary: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	summaryKey: {
		color: theme.colors.secondary,
		fontWeight: 'bold',
	},
	summaryValue: {
		color: theme.colors.secondary,
	},
	button: {
		marginTop: 20,
		marginBottom: 20,
		borderWidth: 1,
		backgroundColor: theme.colors.primary,
		width: width * 0.5,
	},
	buttonContainer: {
		alignItems: 'center',
	},
});
