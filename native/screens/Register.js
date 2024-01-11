import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, Dimensions, Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Formik } from 'formik';
import { useDispatch } from 'react-redux';
import { createUser } from '../store/actions/userActions';
import Button from '../components/Button';
import CustomInput from '../components/CustomInput';
import { theme } from '../core/theme';
import * as Yup from 'yup';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Animatable from 'react-native-animatable';
import Spinner from 'react-native-loading-spinner-overlay';

const background = require('../assets/WelcomeBackground.png');
const logo = require('../assets/logo.png');
const { width, height } = Dimensions.get('window');

const Register = ({ id, username, email, password, passwordConfirmation, isValid, navigation }) => {
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(false);

	const startLoading = () => {
		setLoading(true);
		setTimeout(() => {
			setLoading(false);
		}, 1500);
	};

	return (
		<ImageBackground source={background} style={styles.image}>
			<View style={styles.container}>
				{/* <Logo /> */}
				<Image
					source={logo}
					style={{
						// flex: 1,
						width: 500,
						height: 50,
						resizeMode: 'contain',
					}}
				></Image>

				<Text style={styles.title}>Crear cuenta</Text>

				<Formik
					initialValues={{
						username: '',
						email: '',
						dni: '',
						password: '',
						passwordConfirmation: '',
					}}
					validationSchema={Yup.object({
						username: Yup.string().min(4, 'Debe tener al menos 4 caracteres').max(50, 'Debe tener 50 caracteres o menos').required('Debes completar este campo'),
						email: Yup.string().email('Introduzca un correo válido por favor').required('Debes completar este campo'),
						dni: Yup.number('Sólo números').required('Debes completar este campo').positive('Verifica el número ingresado').integer('Verifica el número ingresado'),
						password: Yup.string()
							.required('Ingresa tu contraseña')
							.matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, 'No cumple con los requisitos'),
						passwordConfirmation: Yup.string()
							.oneOf([Yup.ref('password'), null], 'La contraseña no coincide')
							.required('Confirma tu contraseña'),
					})}
					onSubmit={(values, action) => {
						action.resetForm();
						startLoading();
						dispatch(createUser(values, () => navigation.navigate('CodeVerification')));
					}}
				>
					{({ handleChange, handleSubmit, values, errors, touched }) => (
						<View style={styles.form_container}>
							<Spinner
								//visibility of Overlay Loading Spinner
								visible={loading}
								//Text with the Spinner
								textContent={'Loading...'}
								//Text style of the Spinner Text
								textStyle={styles.spinnerTextStyle}
							/>
							<Animatable.View animation='bounceInUp' delay={500}>
								<CustomInput label='Username' name='username' onChangeText={handleChange('username')} value={values.username} style={styles.input} />

								{errors.username ? <Text style={styles.error}>{errors.username}</Text> : values.username.length >= 4 ? <Text style={{ fontSize: 10, color: 'green' }}>Correcto</Text> : <Text style={{ fontSize: 10 }}></Text>}

								<CustomInput label='CC/DNI' name='dni' onChangeText={handleChange('dni')} value={values.dni} style={styles.input} keyboardType={'phone-pad'} />

								{errors.dni ? <Text style={styles.error}>{errors.dni}</Text> : values.dni.length >= 7 ? <Text style={{ fontSize: 10, color: 'green' }}>Correcto</Text> : <Text style={{ fontSize: 10 }}></Text>}

								<CustomInput label='Correo' name='email' returnKeyType='next' onChangeText={handleChange('email')} value={values.email} autoCapitalize='none' autoCompleteType='email' textContentType='emailAddress' keyboardType='email-address' style={styles.input} />

								{errors.email ? <Text style={styles.error}>{errors.email}</Text> : values.email.length >= 4 && !errors.email ? <Text style={{ fontSize: 10, color: 'green' }}>Correcto</Text> : <Text style={{ fontSize: 10 }}></Text>}

								<CustomInput label='Contraseña' name='password' returnKeyType='done' onChangeText={handleChange('password')} value={values.password} secureTextEntry={true} style={styles.input} />

								{errors.password ? <Text style={styles.error}>{errors.password}</Text> : values.password.length >= 8 && !errors.password ? <Text style={{ fontSize: 10, color: 'green' }}>Correcto</Text> : <Text style={{ fontSize: 10 }}></Text>}

								<CustomInput label='Confirmar contraseña' name='passwordConfirmation' onChangeText={handleChange('passwordConfirmation')} value={values.passwordConfirmation} secureTextEntry={true} style={styles.input} />

								{errors.passwordConfirmation ? <Text style={styles.error}>{errors.passwordConfirmation}</Text> : values.passwordConfirmation.length >= 8 && !errors.passwordConfirmation ? <Text style={{ fontSize: 10, color: 'green' }}>Correcto</Text> : <Text style={{ fontSize: 10 }}></Text>}

								<Button mode='contained' secureTextEntry={true} title='Register' style={styles.button} onPress={handleSubmit}>
									Crear
								</Button>

								<View style={styles.row}>
									<Text style={styles.label}> ¿Ya tienes una cuenta? </Text>
									<TouchableOpacity onPress={() => navigation.navigate('Login')}>
										<Text style={styles.link}>Ingresa aquí</Text>
									</TouchableOpacity>
								</View>
							</Animatable.View>
						</View>
					)}
				</Formik>
			</View>
		</ImageBackground>
	);
};

const styles = StyleSheet.create({
	container: {
		// flex: 1,
		alignItems: 'center',
		// backgroundColor: 'gold',
	},
	image: {
		flex: 1,
		resizeMode: 'cover',
		justifyContent: 'center',
		alignItems: 'center',
	},
	title: {
		textAlign: 'center',
		marginTop: 20,
		fontSize: 30,
		paddingBottom: 20,
		fontWeight: 'bold',
		color: theme.colors.primary,
	},
	label: {
		color: theme.colors.secondary,
	},
	form_container: {
		width: '70%',
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
	},
	error: {
		fontSize: 10,
		color: 'red',
	},
});

export default Register;
