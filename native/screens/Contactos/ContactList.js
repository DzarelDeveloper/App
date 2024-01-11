import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dimensions, View, Text, StyleSheet, SafeAreaView, TextInput, FlatList, TouchableOpacity, ScrollView, Image, RefreshControl, Button } from 'react-native';
import { Link } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Animatable from 'react-native-animatable';
import { Searchbar } from 'react-native-paper';
import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';

//Actions
import { getAccount } from '../../store/actions/acountActions';
import { verifySession, logoutUser } from '../../store/actions/jwtUsersActions';
import { getContacts, addContact } from '../../store/actions/contactsAction';
import { getUsers, clearUserState } from '../../store/actions/userActions';

// Dimensions
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

//Functions
function wait(timeout) {
	return new Promise((resolve) => {
		setTimeout(resolve, timeout);
	});
}
const ContactList = ({ navigation }) => {
	const dispatch = useDispatch();
	const [results, setResults] = useState([]);
	const [refresh, setRefresh] = useState(false);
	const [refreshing, setRefreshing] = useState(false);
	const [visible, setVisible] = useState(false);
	const [value, setValue] = useState();
	const [bool, setBool] = useState(false);

	const session = useSelector((state) => state.session.userDetail);
	var contacts = useSelector((state) => state.contacts.contacts);
	var users = useSelector((state) => state.users.users);
	//Vars
	const bal = session.balance;
	const id = session._id;

	//Hooks functs
	const onRefresh = useCallback(() => {
		setRefreshing(true);

		wait(2000).then(() => {
			setRefreshing(false);
			setResults([]);
			dispatch(getContacts(id ? id : null));
		});
	}, [refreshing]);

	//Redux
	useEffect(() => {
		dispatch(getContacts(id ? id : null));
	}, []);

	//Logs

	//
	const searchContacts = (value) => {
		setRefresh(true);
		let search = [];
		dispatch(getUsers());
		for (var i = 0; i <= users.length - 1; i++) {
			if (users[i].email.includes(value) || users[i].username.includes(value)) {
				search.push(users[i]);
				for (var j = 0; j <= contacts.length - 1; j++) {
					if (contacts[j].email === users[i].email) {
						search = search.filter((e) => e.email !== contacts[j].email);
					}
				}
			}
		}

		setResults(search);
	};

	const renderItem = ({ item }) => (
		<Animatable.View animation='fadeInUpBig' duration={1800} delay={1000}>
			<View style={{ marginVertical: 10 }}>
				<View>
					{/* fila de ULTIMO MOVIMIENTO */}
					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'space-evenly',
							alignItems: 'center',
						}}
					>
						{item.address ? (
							<View style={{ flexDirection: 'row', alignItems: 'center' }}>
								<Text style={styles.text_contactsInfo}>
									{item.name.charAt(0).toUpperCase()}
									{item.email.charAt(0).toUpperCase()}
								</Text>
							</View>
						) : (
							<View style={{ flexDirection: 'row', alignItems: 'center' }}>
								<Text style={styles.text_contactsInfo}>
									{item.username.charAt(0).toUpperCase()}
									{item.email.charAt(0).toUpperCase()}
								</Text>
							</View>
						)}
						{item.address ? (
							<View style={{ alignItems: 'flex-start', marginLeft: 0 }} on>
								<Text style={styles.text_contactsInfo}>{item.name}</Text>

								<Text style={styles.text_contactsInfo}>{item.email}</Text>
							</View>
						) : (
							<TouchableOpacity
								style={styles.container}
								onPress={() =>
									navigation.navigate('ContactCard', {
										item: item,
									})
								}
							>
								<View style={{ alignItems: 'flex-start', marginLeft: 0 }} on>
									<Text style={styles.text_contactsInfo}>{item.username}</Text>

									<Text style={styles.text_contactsInfo}>{item.email}</Text>
								</View>
							</TouchableOpacity>
						)}

						{item.address ? (
							<View style={{ alignItems: 'flex-end', marginLeft: 0 }} on>
								<Icon.Button
									name='user-plus'
									backgroundColor='#3b5998'
									onPress={() => {
										dispatch(addContact(session._id, item.email,id));
										setResults([]);
										setValue('');
										setBool(false);
										navigation.reset({
											index: 0,
											routes: [{ name: 'Contactos' }],
										});
									}}
								></Icon.Button>
							</View>
						) : (
							<View style={{ alignItems: 'flex-end', marginLeft: 0 }} on>
								<Text>Contacto</Text>
							</View>
						)}
					</View>
					{/* Separador Horizontal */}
					<View
						style={{
							borderBottomColor: 'grey',
							borderBottomWidth: 1,
							marginVertical: 10,
						}}
					/>
				</View>
			</View>
		</Animatable.View>
	);

	return (
		<View style={styles.containerPrin}>
			<Image source={require('../../assets/background2.png')} style={{ position: 'absolute' }} />

			{/* header */}
			<ScrollView contentContainerStyle={{ alignItems: 'center' }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
				<View
					style={{
						marginVertical: 0,
						marginTop: 10,
						// backgroundColor: 'blue',
						alignItems: 'center',
						// paddingVertical: accounts.length > 1 ? 0 : 20, // Pone padding solo si hay mas de una cuenta
					}}
				>
					<Text
						style={{
							color: 'white',
							fontSize: 18,
							textAlign: 'center',
							width: 0.7 * deviceWidth,
						}}
					>
						Escribe el correo o nombre de usuario y los resultados apareceran abajo.
					</Text>
					<View
						style={{
							flexDirection: 'row',
							// backgroundColor: 'blue',
							width: 0.9 * deviceWidth,
							alignSelf: 'center',
							alignItems: 'center',
							justifyContent: 'space-between',
							marginVertical: 0.05 * deviceHeight,
						}}
					>
						<View style={styles.searchContainer}>
							{/*Buscar en mis contactos */}
							<View>
								<TextInput
									placeholder='Buscar un contacto'
									placeholderTextColor='grey'
									style={
										{
											// backgroundColor: 'red',
										}
									}
									onChangeText={(value) => searchContacts(value)}
									onFocus={() => {
										setVisible(true);
										setValue();
										setBool(true);
									}}
									value={value}
								/>
							</View>
						</View>
						<View>
							{visible ? (
								<Icon.Button
									name='close'
									backgroundColor='white'
									color='indigo'
									onPress={() => {
										setResults([]);
										setVisible(false);
										setValue('');
										setBool(false);
									}}
								>
									Cancelar
								</Icon.Button>
							) : (
								<Text>'</Text>
							)}
						</View>
					</View>

					{/* Container de CONTACTOS de la cuenta */}
					<Animatable.View animation='fadeInUpBig' duration={1800} delay={1000}>
						<View style={{ marginVertical: 30 }}>
							<View style={styles.ultimosMovimientosContainer}>
								{bool ? <Text style={styles.textTitle_ultimosMovimientos}>Agregar contactos</Text> : <Text style={styles.textTitle_ultimosMovimientos}>Mis contactos</Text>}

								<FlatList
									extraData={results}
									data={results.length == 0 ? contacts : results}
									renderItem={renderItem}
									keyExtractor={(item, index) => index.toString()}
									ListEmptyComponent={() => (
										<View>
											<Text style={styles.items}>No tienes contactos Henry's</Text>
										</View>
									)}
								/>
							</View>
						</View>
					</Animatable.View>
				</View>

				{/* renderizar resultados de busqueda */}
				{/* <View style={styles.flatList}>
            
          </View> */}
			</ScrollView>
		</View>
	);
};
export default ContactList;

const styles = StyleSheet.create({
	containerPrin: {
		backgroundColor: 'white',
		flex: 1,
		resizeMode: 'cover',
		justifyContent: 'flex-start',
		height: vh(100),
		width: deviceWidth,
		alignItems: 'center',
		paddingTop: 2,
	},

	header: {
		flexDirection: 'row',
		alignItems: 'flex-end',
		height: 60,
		justifyContent: 'space-between',
		backgroundColor: 'indigo',
	},
	saldoContainer: {
		width: 0.9 * deviceWidth,
		// backgroundColor: 'cyan',
		borderRadius: 20,
		// minHeight: 100,
		padding: 0,
		marginBottom: 10,
	},
	balance_horizontalScrollview: {
		paddingVertical: 0,
		// alignItems: 'center',
		// backgroundColor: 'gold',
	},
	searchContainer: {
		width: '70%',
		alignSelf: 'center',
		backgroundColor: 'white',
		borderRadius: 15,
		paddingVertical: 10,
		paddingHorizontal: 15,
		marginVertical: 10,
		// marginHorizontal: deviceWidth * 0.05,
		shadowColor: '#000', // iOS
		shadowOffset: { width: 0, height: 5 }, // iOS
		shadowOpacity: 0.36, // iOS
		shadowRadius: 6.68, // iOS
		elevation: 11, // Android
	},
	accionesContainer: {
		width: deviceWidth * 0.9,
		marginHorizontal: deviceWidth * 0.05,
	},
	mainActionIconContainer: {
		width: vw(15),
		aspectRatio: 1,
		borderRadius: 15,
		backgroundColor: 'white',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 5,
		shadowColor: '#000', // iOS
		shadowOffset: { width: 0, height: 5 }, // iOS
		shadowOpacity: 0.36, // iOS
		shadowRadius: 6.68, // iOS
		elevation: 11, // Android
	},
	ultimosMovimientosContainer: {
		width: deviceWidth * 0.9,
		marginHorizontal: deviceWidth * 0.05,
		height: 'auto',
		backgroundColor: 'white',
		borderRadius: 15,
		minHeight: 100,
		padding: 15,
		shadowColor: '#000', // iOS
		shadowOffset: { width: 0, height: 5 }, // iOS
		shadowOpacity: 0.36, // iOS
		shadowRadius: 6.68, // iOS
		elevation: 11, // Android
	},
	shopBrandLogosContainer: {
		height: 30,
		width: 30,
		// backgroundColor: 'indigo',
		borderColor: 'indigo',
		borderWidth: 1,
		borderRadius: 10,
		overflow: 'hidden',
	},

	// <-------> Avatar <------->
	avatar: {
		marginRight: vh(7),
	},
	// <-------> Avatar <------->
	// <-------> Text <------->
	text_saldoCuentaTitle: {
		color: 'white',
		fontSize: 16,
		// fontWeight: 'bold',
	},
	text_saldoCuenta: {
		color: 'white',
		fontSize: 36,
		// fontWeight: 'bold',
	},
	text_saldoCuenta2: {
		color: 'rgb(30,30,30)',
		fontSize: 36,
		// fontWeight: 'bold',
	},
	textTitle: {
		color: 'rgb(30,30,30)',
		fontSize: 18,
		marginBottom: 5,
	},
	text_ingresosEgresos: {
		color: 'black',
		fontSize: 16,
	},
	text_ingresos: {
		color: 'darkgreen',
		fontSize: 24,
	},
	text_egresos: {
		color: 'firebrick',
		fontSize: 24,
	},
	text_body: {
		color: 'rgb(30,30,30)', // Negro
		fontSize: 14,
		lineHeight: 22,
	},
	text_acciones: {
		color: 'rgb(30,30,30)', // Negro
		fontSize: 14,
		// lineHeight: 22,
		textAlign: 'center',
	},
	text_link: {
		color: 'steelblue',
		fontSize: 14,
	},
	textTitle_ultimosMovimientos: {
		color: 'rgb(30,30,30)',
		fontSize: 18,
		marginBottom: 12,
	},
	text_contactsInfo: {
		fontSize: 14,
		color: 'black',
	},
	text_detailUltimosMovimientos: {
		fontSize: 12,
		color: 'darkgrey',
	},
	text_ingresosUltimosMovimientos: {
		color: 'darkgreen',
		fontSize: 14,
	},
	text_egresosUltimosMovimientos: {
		color: 'firebrick',
		fontSize: 14,
	},
	// <-------> Text <------->
});
