import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, ImageBackground, Image, Dimensions } from 'react-native';
import { useDispatch } from 'react-redux';
import { Formik } from 'formik';
import { userUp } from '../store/actions/userUpActions';
import Button from '../components/Button';
import { theme } from '../core/theme';
import Spinner from 'react-native-loading-spinner-overlay';

const { width, height } = Dimensions.get('window');

const SingleNumInput = ({ changed, id, _ref, _next }) => {
	return (
		<TextInput
			style={styles.numInput}
			keyboardType={'phone-pad'}
			maxLength={1}
			onChangeText={(value) => {
				changed(value, id);
				value && _next && _next.current.focus();
			}}
			ref={_ref}
		/>
	);
};
const background = require('../assets/WelcomeBackground.png');
const logo = require('../assets/logo.png');
export default function CodeVerification({ navigation }) {
	const dispatch = useDispatch();
	const [codeIn, setCodeIn] = React.useState({
		A: '',
		B: '',
		C: '',
		D: '',
		E: '',
	});

	const handleInputChange = (value, id) => {
		console.log('ID: ', id, 'value: ', value);
		setCodeIn({ ...codeIn, [id]: value });
	};

	const verification_code = parseInt(codeIn.A + codeIn.B + codeIn.C + codeIn.D + codeIn.E);
	const [loading, setLoading] = useState(false);

	const startLoading = () => {
		setLoading(true);
		setTimeout(() => {
			setLoading(false);
		}, 1500);
	};

	const pin1 = useRef();
	const pin2 = useRef();
	const pin3 = useRef();
	const pin4 = useRef();
	const pin5 = useRef();

	return (
		<ImageBackground source={background} style={styles.image}>
			<View
				style={
					{
						// backgroundColor: 'blue',
					}
				}
			>
				{/* <Logo /> */}
				<Image
					source={logo}
					style={{
						alignSelf: 'center',
						width: 0.5 * width,
						height: 50,
						resizeMode: 'contain',
						marginBottom: 50,
					}}
				></Image>
				{/* <Logo /> */}
				<Text style={styles.title}>Validación de cuenta</Text>

				<Formik
					initialValues={{
						code: '',
					}}
					onSubmit={(values) => {
						const { code } = values;
						startLoading();
						dispatch(userUp(verification_code, () => navigation.navigate('AltaUser')));
					}}
				>
					{({ handleChange, handleSubmit, values }) => (
						<View style={styles.containerII}>
							<Spinner
								//visibility of Overlay Loading Spinner
								visible={loading}
								//Text with the Spinner
								textContent={'Loading...'}
								//Text style of the Spinner Text
								textStyle={styles.spinnerTextStyle}
							/>
							<Text style={styles.instruction}>Ingresa el código que hemos enviado a tu correo</Text>

							<View style={styles.row}>
								<SingleNumInput changed={handleInputChange} id={'A'} _ref={pin1} _next={pin2} />
								<SingleNumInput changed={handleInputChange} id={'B'} _ref={pin2} _next={pin3} />
								<SingleNumInput changed={handleInputChange} id={'C'} _ref={pin3} _next={pin4} />
								<SingleNumInput changed={handleInputChange} id={'D'} _ref={pin4} _next={pin5} />
								<SingleNumInput changed={handleInputChange} id={'E'} _ref={pin5} _next={null} />
							</View>

							<Button mode='contained' secureTextEntry={true} title='Register' style={styles.button} onPress={handleSubmit}>
								Validar
							</Button>

							<View style={styles.row}>
								<Text style={styles.label}>¿No te ha llegado el código? </Text>
								<TouchableOpacity onPress={() => navigation.navigate('Login')}>
									<Text style={styles.link}>Reenviar código</Text>
								</TouchableOpacity>
							</View>
						</View>
					)}
				</Formik>
			</View>
		</ImageBackground>
	);
}

const styles = StyleSheet.create({
	image: {
		flex: 1,
		resizeMode: 'cover',
		justifyContent: 'center',
		alignItems: 'center',
		// backgroundColor: 'blue',
	},
	container: {
		flex: 1,
		alignItems: 'center',
		backgroundColor: '#fff',
	},
	title: {
		textAlign: 'center',
		// paddingTop: 230,
		fontSize: 30,
		paddingBottom: 5,
		fontWeight: 'bold',
		color: theme.colors.primary,
	},
	label: {
		color: theme.colors.secondary,
		textAlign: 'center',
		paddingBottom: 10,
	},
	instruction: {
		color: theme.colors.secondary,
		textAlign: 'center',
		paddingBottom: 10,
		fontSize: 11,
	},
	button: {
		marginTop: 20,
		marginBottom: 30,
		backgroundColor: theme.colors.primary,
	},
	row: {
		flexDirection: 'row',
	},
	link: {
		fontWeight: 'bold',
		color: theme.colors.primary,
	},
	input: {
		height: 40,
		backgroundColor: 'white',
	},
	numInput: {
		height: 45,
		width: 45,
		borderColor: 'gray',
		borderWidth: 1,
		borderRadius: 5,
		margin: 10,
		textAlign: 'center',
		fontSize: 25,
	},
	containerII: {
		alignItems: 'center',
	},
});
