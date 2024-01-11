import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import { Link } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { theme } from '../core/theme';
import { ScrollView } from 'react-native-gesture-handler';

const { width } = Dimensions.get('window');
const tabWidth = width / 3;

/* * * * * * * * * * * * * * * * *
 * Renderiza todas las tabs      *
 * * * * * * * * * * * * * * * * */
const Tabs = ({ children }) => {
	return <View style={styles.tabs}>{children}</View>;
};

/* * * * * * * * * * * * * * * * *
 * Renderiza una sola tab        *
 * * * * * * * * * * * * * * * * */
const Tab = ({ title, active, icon_name }) => {
	return (
		<View style={[styles.tab, active ? styles.activeTab : {}]}>
			<Icon name={icon_name} color={theme.colors.primary} size={20} />
			<Text style={styles.tabText}>{title}</Text>
		</View>
	);
};

/* * * * * * * * * * * * * * * * * * * * * * * *
 * Opciones que se renderizan en Accordion     *
 * * * * * * * * * * * * * * * * * * * * * * * */
const appUseOptions = [
	{
		title: '¿En cuánto tiempo verifican mi cuenta bancaria?',
		data: ' Ni bien ingreses tus datos, el tiempo de verificación de la cuenta bancaria es de 24 horas hábiles.',
	},
	{
		title: '¿Es necesario vincular la cuenta bancaria para hacer un depósito?',
		data: 'Para hacer un depósito de saldo en tu cuenta no necesitas agregar una cuenta bancaria. Tenés otros métodos de fondeo: podes depositar por Mercado Pago o depositar en efectivo por Rapipago y PagoFacil',
	},
	{
		title: '¿Qué necesito para crear una cuenta?',
		data: 'Documento de identidad físico (Permanente o temporal). Teléfono celular a la mano. En caso de no contar con cámara en el dispositivo, debes tomar: Una foto en formato .jpg del documento de identidad (sin flash, y con datos legibles). Una selfie tuya en formato .jpg (la capacidad de estas fotos no debe superar los 2MB).',
	},
	{
		title: 'Comisiones por operaciones',
		data: 'Todas las operaciones son gratuitas',
	},
	{
		title: '¿Cómo protegerte de las estafas online?',
		data: 'Muchas ofertas que se presentan como negocios son en realidad estafas, tené cuidado de no ser víctima de fraude informático.Cuidate de las ofertas de negocios con ingresos rápidos y elevados. Si suena demasiado bueno para ser cierto, en general es porque es una estafa. Nunca permitas a terceros el uso de tu cuenta.',
	},
];

const accountOptions = [
	{
		title: 'Olvidé mi contraseña',
		data: 'Aquí deben ir las instrucciones de cómo recuperar la contraseña o un link que nos redirija a la screen en donde se recupera la contraseña.',
	},
	{
		title: 'Olvidé mi usuario',
		data: 'Puedes ingresar con el correo electrónico con el que te registraste en la aplicación. Esta opción es por si podemos habilitar la opción de hacer Log In con username',
	},
	{
		title: 'Cambiar mis datos',
		data: 'Acá podemos poner las instrucciones de cómo ver y modificar los datos que estarán disponibles dentro de la app cuando el usuario esté logueado',
	},
];

const aboutOptions = [
	{
		title: '¿Acerca de esta aplicación?',
		data: 'Esta aplicación fue desarrollada por alumnos de HENRY, grupo 5 de la cohorte 05.',
	},
	{
		title: '¿Desarrolladores',
		data: 'El equipo de desarrollo: Cecilia Cáccamo, Olivert, Camilo Lindarte, Alexis, Gabriela, Juan, Sebastián, Martin Catalá, Carlos Saballe',
	},
];

/* * * * * * * * * * * * * * * * * * * * *
 * Renderiza componentes Accordion       *
 * * * * * * * * * * * * * * * * * * * * */
const rendeOptionAccordion = (option) => {
	const items = [];
	option.map((el, i) => {
		items.push(<Accordion title={el.title} data={el.data} key={i} />);
	});
	return items;
};

/* * * * * * * * * * * * * * * * * * * * *
 * Renderiza un acordeón de opciones     *
 * * * * * * * * * * * * * * * * * * * * */
function Accordion({ title, data }) {
	const [state, setState] = useState({
		data: data,
		expanded: false,
	});

	function toggleExpand() {
		state.expanded ? setState({ expanded: false }) : setState({ expanded: true });
	}

	return (
		<View style={styles.container}>
			<View>
				<TouchableOpacity onPress={toggleExpand}>
					<View style={styles.row}>
						<Text style={styles.title}>{title}</Text>
						<Icon name={state.expanded ? 'angle-up' : 'angle-down'} color={theme.colors.primary} size={20} />
					</View>
				</TouchableOpacity>
				{state.expanded ? (
					<View>
						<Text style={styles.data}>{data}</Text>
					</View>
				) : null}
			</View>
		</View>
	);
}

/* * * * * * * * * * * * * * * * *
 * Renderiza el screen FAQ       *
 * * * * * * * * * * * * * * * * */
export default function FAQ() {
	const [tabState, setTabState] = useState({
		account: true,
		appUse: false,
		about: false,
	});

	const pressedTab = (key) => {
		if (key === 'A') {
			setTabState({ account: true, appUse: false, about: false });
		} else if (key === 'B') {
			setTabState({ account: false, appUse: true, about: false });
		} else {
			setTabState({ account: false, appUse: false, about: true });
		}
	};

	return (
		<ScrollView backgroundColor={'white'}>
			<View style={styles.scroll}>
				{/* Imagen de fondo */}
				<Image source={require('../assets/background1.png')} style={{ position: 'absolute' }} />
				<View style={styles.header}>
					{/* <Link to="/Welcome">
            <Icon name="arrow-left" color={theme.colors.primary} size={25} />
          </Link> */}

					<Text style={styles.how}> ¿Cómo te podemos ayudar? </Text>
				</View>

				<Tabs>
					<TouchableOpacity style={styles.rowII} onPress={() => pressedTab('A')}>
						<Tab title='Cuenta' active={tabState.account} icon_name={'user'} />
					</TouchableOpacity>

					<TouchableOpacity style={styles.rowII} onPress={() => pressedTab('B')}>
						<Tab title='Uso de la app' active={tabState.appUse} icon_name={'check-circle'} />
					</TouchableOpacity>

					<TouchableOpacity style={styles.rowII} onPress={() => pressedTab('C')}>
						<Tab title='Acerca de' active={tabState.about} icon_name={'question-circle'} />
					</TouchableOpacity>
				</Tabs>

				{tabState.account ? rendeOptionAccordion(accountOptions) : tabState.appUse ? rendeOptionAccordion(appUseOptions) : tabState.about ? rendeOptionAccordion(aboutOptions) : null}
			</View>
		</ScrollView>
	);
}

/* * * * * * * * * * * * * * * *
 * Estilos de la screen FQA    *
 * * * * * * * * * * * * * * * */
const styles = StyleSheet.create({
	tabs: {
		height: 60,
		width: width,
		borderBottomWidth: 1,
		borderBottomColor: '#ddd',
		justifyContent: 'space-around',
		alignItems: 'center',
		flexDirection: 'row',
	},
	tab: {
		height: 60,
		width: tabWidth,
		justifyContent: 'center',
		alignItems: 'center',
		justifyContent: 'center',
	},
	tabText: {
		fontWeight: 'bold',
		color: theme.colors.secondary,
		padding: 5,
	},
	activeTab: {
		borderBottomWidth: 2,
		borderBottomColor: theme.colors.primary,
	},
	container: {
		// backgroundColor: '#fff',
	},
	scroll: {
		flex: 1,
		paddingBottom: 15,
		// backgroundColor: '#fff',
	},
	header: {
		width: '100%',
		// backgroundColor: '#fff',
		paddingTop: 40,
		paddingLeft: 15,
		marginBottom: 50,
	},
	how: {
		textAlign: 'center',
		padding: 40,
		fontSize: 20,
		fontWeight: 'bold',
		color: 'white',
		// color: theme.colors.secondary,
	},
	row: {
		flexDirection: 'row',
		width: width,
		justifyContent: 'space-between',
		padding: 15,
	},
	rowII: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		justifyContent: 'center',
		justifyContent: 'space-around',
	},
	title: {
		fontSize: 15,
		fontWeight: 'bold',
		color: theme.colors.secondary,
		width: '90%',
	},
	data: {
		backgroundColor: '#fff',
		marginLeft: 15,
		marginRight: 15,
		padding: 15,
		borderRadius: 5,
		borderWidth: 0.3,
		borderColor: theme.colors.primary,
		color: theme.colors.secondary,
	},
});
