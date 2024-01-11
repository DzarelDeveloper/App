import React, { memo } from 'react';
import { Image, StyleSheet } from 'react-native';

const Logo = () => <Image source={require('../assets/logo.png')} style={styles.image} />;

const styles = StyleSheet.create({
	image: {
		// flex: 1,
		width: 500,
		height: 50,
		resizeMode: 'contain',
	},
});

export default memo(Logo);
