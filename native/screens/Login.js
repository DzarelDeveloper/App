import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ImageBackground, Dimensions, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { loguinUser } from '../store/actions/jwtUsersActions';
import Button from '../components/Button';
import Header from '../components/Header';
import CustomInput from '../components/CustomInput';
import { theme } from '../core/theme';
import Logo from '../components/Logo';
import * as Animatable from 'react-native-animatable';
import Spinner from 'react-native-loading-spinner-overlay';

const background = require('../assets/WelcomeBackground.png');
const logo = require('../assets/logo.png');
const { width, height } = Dimensions.get('window');

export default function Login({ id, email, password, isValid, navigation }) {
	const [hidePassword, setHidePassword] = useState(false);
	const dispatch = useDispatch();
	const session = useSelector((state) => state.session.userDetail);
	const [loading, setLoading] = useState(false);

	const startLoading = () => {
		setLoading(true);
		setTimeout(() => {
			setLoading(false);
		}, 2000);
	};

	return (
		<ImageBackground source={background} style={styles.image}>
			<View style={styles.container}>
				{/* <Logo style={styles.down}/> */}
				<View
					style={{
						// backgroundColor: 'gold',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<Image
						source={logo}
						style={{
							// flex: 1,
							width: 0.5 * width,
							height: 50,
							resizeMode: 'contain',
						}}
					></Image>
					<Text style={styles.title}>Iniciar sesión</Text>
				</View>

				<Formik
					initialValues={{
						email: '',
						password: '',
					}}
					validationSchema={Yup.object({
						email: Yup.string().email('Introduzca un email valido por favor').required('Ingresa tu correo'),
						password: Yup.string().required('Ingresa tu contraseña'),
					})}
					onSubmit={(values, action) => {
						let user = { ...values };
						action.resetForm();

						//To lower case (wtf?)
						user.email = user.email.toLowerCase();
						startLoading();
						dispatch(
							loguinUser(user.email, user.password, () =>
								navigation.reset({
									index: 0,
									routes: [{ name: 'Main' }],
								})
							)
						);

						// navigation.navigate("RegisterModal");
					}}
				>
					{({ handleChange, handleSubmit, values, errors, touched }) => (
						<View>
							<Spinner
								//visibility of Overlay Loading Spinner
								visible={loading}
								//Text with the Spinner
								textContent={'Cargando...'}
								//Text style of the Spinner Text
								textStyle={styles.spinnerTextStyle}
							/>
							<Animatable.View animation='bounceInUp' delay={500}>
								<CustomInput label='Correo' name='email' returnKeyType='next' onChangeText={handleChange('email')} value={values.email} autoCapitalize='none' autoCompleteType='email' textContentType='emailAddress' keyboardType='email-address' style={styles.input} />

								{errors.email ? <Text style={{ fontSize: 10, color: 'red' }}>{errors.email}</Text> : <Text style={{ fontSize: 10 }}></Text>}

								<CustomInput label='Contraseña' name='password' returnKeyType='done' onChangeText={handleChange('password')} value={values.password} secureTextEntry={true} style={styles.input} />

								{errors.password ? <Text style={{ fontSize: 10, color: 'red' }}>{errors.password}</Text> : <Text style={{ fontSize: 10 }}></Text>}

								<Button mode='contained' secureTextEntry={true} title='Register' style={styles.button} onPress={handleSubmit}>
									Ingresar
								</Button>

								<View style={styles.down}>
									<View style={styles.row}>
										<Text style={styles.label}>¿Aún no tienes una cuenta? </Text>
										<TouchableOpacity onPress={() => navigation.navigate('Register')}>
											<Text style={styles.link}>Regístrate aquí</Text>
										</TouchableOpacity>
									</View>

									<View>
										<TouchableOpacity onPress={() => navigation.navigate('Register')}>
											<Text style={styles.forgotPassword}>¿Olvidaste tu contraseña?</Text>
										</TouchableOpacity>
									</View>
								</View>
							</Animatable.View>
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
		// flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		// backgroundColor: 'gold',
	},
	title: {
		textAlign: 'center',
		marginTop: 50,
		fontSize: 30,
		paddingBottom: 20,
		fontWeight: 'bold',
		color: theme.colors.primary,
	},
	label: {
		color: theme.colors.secondary,
	},
	button: {
		marginTop: 20,
		marginBottom: 30,
		backgroundColor: theme.colors.primary,
	},
	row: {
		flexDirection: 'row',
		marginTop: 4,
	},
	link: {
		fontWeight: 'bold',
		color: theme.colors.primary,
	},
	input: {
		height: 40,
		backgroundColor: 'white',
		borderColor: '#fff',
	},
	forgotPassword: {
		color: theme.colors.secondary,
		fontWeight: 'bold',
		textAlign: 'center',
		marginTop: 11,
		color: theme.colors.primary,
	},
	down: {
		alignItems: 'center',
	},
});
