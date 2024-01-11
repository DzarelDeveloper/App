import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Logo from '../components/Logo';
import Background from '../components/Background';
import * as Animatable from 'react-native-animatable';

function Welcome({ navigation }) {
	setTimeout(function () {
		navigation.navigate('Welcome');
	}, 3000);
	return (
		<View style={styles.container}>
			<Background>
				<Animatable.View animation='flipInX'>
					<Animatable.View animation='flipOutX' delay={2400}>
						<Logo />
					</Animatable.View>
				</Animatable.View>
			</Background>
		</View>
	);
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white',
		width: '100%',
	},
	image: {
		flex: 1,
		resizeMode: 'cover',
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
	},
	title: {
		backgroundColor: 'transparent',
		fontSize: 100,
		color: '#fff',
		fontWeight: 'bold',
		marginBottom: 40,
	},
});
export default Welcome;
