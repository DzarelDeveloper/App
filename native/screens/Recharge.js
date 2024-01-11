import * as React from 'react';
import { View, StyleSheet, Dimensions, Image, Text } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Qrnative from './QrCreate';
import Card from './Card';

const { width, height } = Dimensions.get('window');

const FirstRoute = () => <View style={[styles.scene, { backgroundColor: '#ff4081' }]} />;

const SecondRoute = () => <View style={[styles.scene, { backgroundColor: '#673ab7' }]} />;

const initialLayout = { width: Dimensions.get('window').width };

function Recharge() {
	const [index, setIndex] = React.useState(0);
	const [routes] = React.useState([
		{ key: 'first', title: 'Tarjeta' },
		{ key: 'second', title: 'Codigo QR' },
	]);

	const renderTabBar = (props) => <TabBar {...props} indicatorStyle={{ backgroundColor: 'white' }} style={{ backgroundColor: 'indigo' }} />;

	const renderScene = SceneMap({
		first: Card,
		second: Qrnative,
	});

	return <TabView navigationState={{ index, routes }} renderTabBar={renderTabBar} renderScene={renderScene} onIndexChange={setIndex} initialLayout={initialLayout} />;
}

const styles = StyleSheet.create({
	scene: {
		height: height,
		// backgroundColor: 'red',
	},
});

export default Recharge;
