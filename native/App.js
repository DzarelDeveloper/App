import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'; //instalar
import { createStackNavigator } from '@react-navigation/stack'; //instalar
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import CustomDrawerContent from './screens/MenuLateral/CustomDrawerContent';
import Register from './screens/Register';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { st } from './store/store';
import Estadictics from './screens/Estadisticas/main';
import Login from './screens/Login';
import PosConsolidada from './screens/PosConsolidada';
import Welcome from './screens/Welcome';
import WelcomeRecharge from './screens/WelcomeRecharge';
import SendMonyScreen from './screens/SendMonyScreen';
import Transactions from './screens/Transactions';
import CodeVerification from './screens/CodeVerification';
import AltaUser from './screens/AltaUser';
import FAQ from './screens/FAQ';
import Toast from 'react-native-toast-message';
import Recharge from './screens/Recharge';
import ContactCard from './screens/Contactos/ContactCard';
import ContactList from './screens/Contactos/ContactList';
import { verifySession, logoutUser } from './store/actions/jwtUsersActions';
import SelectContact from './screens/sendMoneyFlow/SelectContact';
import FinishSend from './screens/sendMoneyFlow/FinishSend';
import Card from './screens/Card';
import MisDatos from './screens/MisDatos';
import TransactionDetails from './screens/TransactionDetails';
import ResetPass from './screens/ResetPass';
import Cuentas from './screens/Cuentas';
// Icons
import Ionicons from 'react-native-vector-icons/Ionicons';

const Stack = createStackNavigator(); //contiene la navegacion
const Drawer = createDrawerNavigator(); // Menu lateral

// <--------------- ROOT Stack (contiene a LoginStack y MainStack ) --------------->
function RootStack() {
	return (
		<Stack.Navigator initialRouteName='Login'>
			<Stack.Screen name='Login' component={LoginStack} options={{ headerShown: false }} />
			<Stack.Screen name='Main' component={MainStack} options={{ headerShown: false }} />
		</Stack.Navigator>
	);
}
// <--------------- ROOT Stack (contiene a LoginStack y MainStack ) --------------->

// <--------------------- LOGIN Stack --------------------->
function LoginStack() {
	return (
		<Stack.Navigator
			initialRouteName='WelcomeRecharge'
			screenOptions={{
				headerShown: false,
			}}
		>
			
			<Stack.Screen name='Welcome' component={Welcome} options={{ headerShown: false }} />
			<Stack.Screen name='WelcomeRecharge' component={WelcomeRecharge} options={{ headerShown: false }} />
			<Stack.Screen name='Login' component={Login} options={{ title: 'Iniciar sesión' }} options={{ headerShown: false }} />
			<Stack.Screen name='CodeVerification' component={CodeVerification} options={{ headerShown: false }} />
			<Stack.Screen name='Register' component={Register} options={{ title: 'Registrarse' }} options={{ headerShown: false }} />
			<Stack.Screen name='AltaUser' component={AltaUser} />
			<Stack.Screen name='FAQ' component={FAQ} options={{ headerShown: true, headerStyle: { backgroundColor: 'indigo', shadowColor: 'indigo', elevation: 0 }, headerTitleStyle: { color: 'white', fontSize: 16 } }} />
			<Stack.Screen name='ResetPass' component={ResetPass} />
		</Stack.Navigator>
	);
}
// <--------------------- LOGIN Stack --------------------->

// <--------------------- MAIN Stack --------------------->
function MainStack() {
	return (
		<Drawer.Navigator
			initialRouteName='Inicio'
			drawerContent={(props) => <CustomDrawerContent {...props} />}
			screenOptions={{
				headerShown: true,
				headerTitleAlign: 'center',
				headerStyle: { backgroundColor: 'indigo', shadowColor: 'indigo', elevation: 0 },
				headerTitleStyle: { color: 'white', fontSize: 16 },
				// headerRight: () => <Ionicons name='ios-log-out' color='white' size={30} style={{ marginHorizontal: 15 }}></Ionicons>,
				// headerLeft: () => <Ionicons name='ios-menu' color='white' size={30} style={{ marginHorizontal: 15 }} onPress={() => props.navigation.openDrawer()}></Ionicons>,
			}}
			lazy={true}
		>
			<Drawer.Screen name='Inicio' component={PosConsolidada} />
			<Drawer.Screen name='Estadisticas' component={Estadictics} />
			<Drawer.Screen name='SendMonyScreen' component={SendMonyScreen} />
			<Drawer.Screen name='Ultimos Movimientos' component={Transactions} options={{ title: '' }} />
			<Drawer.Screen name='FAQ' component={FAQ} />
			<Drawer.Screen name='Recargar Dinero' component={Recharge} />
			<Drawer.Screen name='Mis Datos' component={MisDatos} />
			{/* <Drawer.Screen name='Card' component={Card} /> */}

			<Stack.Screen name='SelectContact' component={SelectContact} options={{ title: '' }} />
			<Stack.Screen name='FinishSend' component={FinishSend} options={{ title: '' }} />
			<Stack.Screen name='ContactCard' component={ContactCard} />
			<Stack.Screen name='Contactos' component={ContactList} />
			<Stack.Screen name='Card' component={Card} />
			<Stack.Screen name='TransactionDetails' component={TransactionDetails} options={{ title: '' }}/>
			<Stack.Screen name='Cuentas' component={Cuentas}/>
		</Drawer.Navigator>
	);
}
// <--------------------- MAIN Stack --------------------->

// <--------------------- APP --------------------->
export default function App() {
	return (
		<Provider store={st}>
			<NavigationContainer style={styles.container}>
				<RootStack />
				<Toast ref={(ref) => Toast.setRef(ref)} />
			</NavigationContainer>
		</Provider>
	);
}
// <--------------------- APP --------------------->

// <--------------------- ESTILOS --------------------->
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white',
		alignItems: 'center',
		justifyContent: 'center',
	},
});
