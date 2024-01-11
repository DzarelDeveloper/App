import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Dimensions,
} from "react-native";
import { verifySession, logoutUser } from "../store/actions/jwtUsersActions";
import { vw, vh, vmin, vmax } from "react-native-expo-viewport-units";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as Animatable from "react-native-animatable";
import { getAccount } from "../store/actions/acountActions";
import { getContacts } from "../store/actions/contactsAction";
// Dimensions
const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

var arrayDePrueba = [1, 2];
var arrayDePruebaMovimientos = [1, 2, 3, 4, 5];

export default function Cuentas({ navigation }) {
  const dispatch = useDispatch();
  const session = useSelector((state) => state.session.userDetail);
  const accounts = useSelector((state) => state.acoount.account);
  const transactions = useSelector((state) => state.acoount.account);
  const bal = session.balance;
  const id = session._id;
  // const bal1 = accounts ? accounts[0].balance : 0
  // const bal2 = accounts ? accounts[1].balance : 0
  useEffect(() => {
    dispatch(getAccount(id ? id : null));
    dispatch(verifySession());
  }, []);
  // console.log('****Cuentas****');
  const accountPesos = accounts[0];
  const accountDolares = accounts[1];
  const balancePesos = accountPesos && accountPesos.balance;
  const balanceDolares = accountDolares && accountDolares.balance;
  console.log(accounts);
  

  const logoutHandler = () => {
    dispatch(logoutUser());
    navigation.navigate("welcome");
    return;
  };

  useEffect(() => {
    dispatch(getContacts(id ? id : null));
    dispatch(getAccount(id ? id : null));
    dispatch(verifySession());
  }, []);
  console.log(accounts);
  // console.log('these are the accounts: ' + accounts[0].transactions[0]);

  // estado de indice de la cuenta a renderizar
  const [currentAccountIndex, setCurrentAccountIndex] = useState(0);
  // estado de indice de la cuenta a renderizar
  return (
    <View style={styles.containerPrin}>
      {/* Imagen de fondo */}
      <Image
        source={require("../assets/background2.png")}
        style={{ position: "absolute" }}
      />
      
      <View >
        {accounts.map((cuenta, key) => {
          return (
            <View key={key}>
              {/* Container de BALANCE de la cuenta */}
              <View style={styles.balanceContainer}>
                <Text style={styles.textTitle}>
                  Saldo en {cuenta.type}
                </Text>
                {/* <Text>currentAccountIndex es {currentAccountIndex}</Text> */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                >
                  <Text style={styles.text_saldoCuenta2}>
                    {" "}
                    {cuenta.type == "Pesos"
                      ? "$ " + cuenta.balance || 0
                      : "u$d " + cuenta.balance || 0}
                  </Text>
                </View>
                {/* Separador Vertical */}
                <View
                  style={{
                    borderBottomColor: "grey",
                    borderBottomWidth: 1,
                    marginVertical: 5,
                  }}
                />
                <Text style={styles.textTitle}>
                  Datos de la Cuenta 
                </Text>
                <Text style={styles.textTitle}>
                  CVU: {cuenta.cvu}
                </Text>
                <Text style={styles.textTitle}>
                  Titular:
                </Text>
                <Text style={styles.textTitle}>
                  Nombre: {session.name} {session.lastname}
                </Text>
                <Text style={styles.textTitle}>
                  DNI: {session.dni}
                </Text>
                <TouchableOpacity
                  style={{ alignItems: "flex-end", marginTop: 0 }}
                  onPress={() => {
                    alert("Ver el detalle");
                  }}
                >
                 
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}
// <---------------------------- ESTILOS ---------------------------->

const styles = StyleSheet.create({
  containerPrin: {
    backgroundColor: "white",
    flex: 1,
    resizeMode: "cover",
    justifyContent: "flex-start",
    height: vh(100),
    width: deviceWidth,
    alignItems: "center",
    paddingTop: 2,
  },
  saldoContainer: {
    width: 0.9 * deviceWidth,
    // backgroundColor: 'cyan',
    borderRadius: 20,
    // minHeight: 100,
    padding: 0,
    marginBottom: 10,
  },
  balance_horizontalScrollview: {
    paddingVertical: 0,
    // alignItems: 'center',
    // backgroundColor: 'gold',
  },
  balanceContainer: {
    width: deviceWidth * 0.9,
    // height: '90%',
    backgroundColor: "white",
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginVertical: 10,
    marginHorizontal: deviceWidth * 0.05,
    shadowColor: "#000", // iOS
    shadowOffset: { width: 0, height: 5 }, // iOS
    shadowOpacity: 0.36, // iOS
    shadowRadius: 6.68, // iOS
    elevation: 11, // Android
  },
  accionesContainer: {
    width: deviceWidth * 0.9,
    marginHorizontal: deviceWidth * 0.05,
  },
  mainActionIconContainer: {
    width: vw(15),
    aspectRatio: 1,
    borderRadius: 15,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
    shadowColor: "#000", // iOS
    shadowOffset: { width: 0, height: 5 }, // iOS
    shadowOpacity: 0.36, // iOS
    shadowRadius: 6.68, // iOS
    elevation: 11, // Android
  },
  ultimosMovimientosContainer: {
    width: deviceWidth * 0.9,
    marginHorizontal: deviceWidth * 0.05,
    height: "auto",
    backgroundColor: "white",
    borderRadius: 15,
    minHeight: 100,
    padding: 15,
    shadowColor: "#000", // iOS
    shadowOffset: { width: 0, height: 5 }, // iOS
    shadowOpacity: 0.36, // iOS
    shadowRadius: 6.68, // iOS
    elevation: 11, // Android
  },
  shopBrandLogosContainer: {
    height: 30,
    width: 30,
    // backgroundColor: 'indigo',
    borderColor: "indigo",
    borderWidth: 1,
    borderRadius: 10,
    overflow: "hidden",
  },

  // <-------> Avatar <------->
  avatar: {
    marginRight: vh(7),
  },
  // <-------> Avatar <------->
  // <-------> Text <------->
  text_saldoCuentaTitle: {
    color: "white",
    fontSize: 16,
    // fontWeight: 'bold',
  },
  text_saldoCuenta: {
    color: "white",
    fontSize: 36,
    // fontWeight: 'bold',
  },
  text_saldoCuenta2: {
    color: "rgb(30,30,30)",
    fontSize: 36,
    // fontWeight: 'bold',
  },
  textTitle: {
    color: "rgb(30,30,30)",
    fontSize: 18,
    marginBottom: 5,
  },
  text_ingresosEgresos: {
    color: "black",
    fontSize: 16,
  },
  text_ingresos: {
    color: "darkgreen",
    fontSize: 24,
  },
  text_egresos: {
    color: "firebrick",
    fontSize: 24,
  },
  text_body: {
    color: "rgb(30,30,30)", // Negro
    fontSize: 14,
    lineHeight: 22,
  },
  text_acciones: {
    color: "rgb(30,30,30)", // Negro
    fontSize: 14,
    // lineHeight: 22,
    textAlign: "center",
  },
  text_link: {
    color: "steelblue",
    fontSize: 14,
  },
  textTitle_ultimosMovimientos: {
    color: "rgb(30,30,30)",
    fontSize: 18,
    marginBottom: 12,
  },
  text_shopUltimosMovimientos: {
    fontSize: 14,
    color: "black",
  },
  text_detailUltimosMovimientos: {
    fontSize: 12,
    color: "darkgrey",
  },
  text_ingresosUltimosMovimientos: {
    color: "darkgreen",
    fontSize: 14,
  },
  text_egresosUltimosMovimientos: {
    color: "firebrick",
    fontSize: 14,
  },
  // <-------> Text <------->
});
// <---------------------------- ESTILOS ---------------------------->