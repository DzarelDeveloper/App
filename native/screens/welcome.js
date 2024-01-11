import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Dimensions, Image } from 'react-native';
import { theme } from '../core/theme';
import Button from '../components/Button';
import * as Animatable from 'react-native-animatable';

const background = require('../assets/WelcomeBackground.png');
const logo = require('../assets/logo.png');
const { width, height } = Dimensions.get('window');

function Welcome({ navigation }) {
	const onPressLogin = () => {
		navigation.navigate('Login');
	};
	const onPressRegister = () => {
		navigation.navigate('Register');
	};
	const onPressFAQ = () => {
		navigation.navigate('FAQ');
	};

	return (
		<ImageBackground source={background} style={styles.image}>
			<View style={styles.container}>
				<View
					style={{
						marginBottom: 20,
						// backgroundColor: 'gold',
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
				</View>
				<Animatable.View animation='bounceInDown' duration={1500}>
					<View style={styles.buttonContainer}>
						{/* Iniciar sesion */}
						<Button mode='contained' secureTextEntry={true} style={styles.button} onPress={onPressLogin}>
							Iniciar Sesión
						</Button>

						{/* Registrarse */}
						<Button mode='contained' secureTextEntry={true} style={styles.button} onPress={onPressRegister}>
							Registrarse
						</Button>
					</View>
					<View style={styles.helpButtonContainer}>
						<TouchableOpacity onPress={onPressFAQ}>
							<View>
								<Text style={styles.help}>¿Necesitas ayuda?</Text>
							</View>
						</TouchableOpacity>
					</View>
				</Animatable.View>
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
	},
	container: {
		// flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		// borderColor: 'red',
		// borderWidth: 1,
		marginBottom: 90,
		// minHeight: 0.5 * height,
	},
	buttonContainer: {
		// backgroundColor: 'green',
		fontSize: 30,
		color: '#fff',
		marginTop: 60,
		justifyContent: 'center',
		alignItems: 'center',
	},
	helpButtonContainer: {
		// backgroundColor: 'green',
		fontSize: 30,
		color: '#fff',
		marginTop: 60,
		justifyContent: 'center',
		alignItems: 'center',
	},
	button: {
		backgroundColor: 'indigo',
	},
	signInButton: {
		marginTop: 20,
		marginBottom: 30,
		borderWidth: 1,
		borderColor: theme.colors.primary,
		backgroundColor: theme.colors.primary,
		width: width * 0.5,
	},
	signUpButton: {
		marginTop: 20,
		marginBottom: 30,
		borderWidth: 1,
		borderColor: theme.colors.primary,
		backgroundColor: theme.colors.primary,
		width: width * 0.5,
	},
	help: {
		backgroundColor: 'transparent',
		// fontSize: 20,
		// marginTop: 50,
		color: 'grey',
	},
});
export default Welcome;
