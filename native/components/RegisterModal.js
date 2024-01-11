import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { Formik } from 'formik';
import { userUp } from '../store/actions/userUpActions';
import Button from '../components/Button';
import CustomInput from '../components/CustomInput';
import { theme } from '../core/theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import Logo from '../components/Logo';

const RegisterModal = ({ navigation }) => {

	const dispatch = useDispatch();

	return (
		<ScrollView contentContainerStyle={styles.container}>
		 	<View>
				 
				{/* <Logo /> */}
				<Text style={styles.title} >Validación de cuenta</Text>

				<Formik
					initialValues={{
						code: ""
					}}

					onSubmit={(values, action) => {
						const { code } = values
						dispatch(userUp(code, () => navigation.navigate("AltaUser")))
					}}
				>
					{({ handleChange, handleSubmit, values, errors, touched }) => (
						<View style={styles.containerII}>


							<Text style={styles.instruction}>Pega el código que hemos enviado a tu correo</Text>
							<CustomInput
								label='Código'
								name='code'
								returnKeyType='next'
								onChangeText={handleChange('code')}
								value={values.code}
								autoCapitalize='none'
								style={styles.input}
							/>

							<Button mode='contained' secureTextEntry={true} title='Register' style={styles.button} onPress={handleSubmit}>
								Validar
							</Button>

							<View style={styles.row}>
								<Text style={styles.label}> ¿No te ha llegado el código?  </Text>
								<TouchableOpacity onPress={() => navigation.navigate('Login')}>
									<Text style={styles.link}>Reenviar código</Text>
								</TouchableOpacity>
							</View>

						</View>
					)}
				</Formik>
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		backgroundColor: '#fff'
	},
	title: {
		textAlign: 'center',
		paddingTop: 230,
		fontSize: 30,
		paddingBottom: 5,
		fontWeight: 'bold',
		color: theme.colors.primary
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
		fontSize: 11
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
		backgroundColor: 'white'
	},
	containerII: {
		alignItems: 'center',
	}
});

export default RegisterModal;