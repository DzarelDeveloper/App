// Generation of QR Code in React Native
// https://aboutreact.com/generation-of-qr-code-in-react-native/

// import React in our code
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { rechargeByQr, getTransactions } from "../store/actions/acountActions";
// import all the components we are going to use
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Picker,
  Dimensions,
  Image,
} from "react-native";
import { theme } from "../core/theme";
import QRCode from "react-native-qrcode-svg";
import { set } from "react-native-reanimated";
import Button from "../components/Button";
import CustomInput from "../components/CustomInput";
import Spinner from "react-native-loading-spinner-overlay";
const { width, height } = Dimensions.get("window");

const Qrnative = () => {
  const dispatch = useDispatch();
  const session = useSelector((state) => state.session.userDetail);
  const accounts = useSelector((state) => state.acoount.account);
  const accountP = accounts[0];
  const accountD = accounts[1];
  const cvuP = accountP && accountP.cvu;
  const cvuD = accountD && accountD.cvu;
  const [inputText, setInputText] = useState({
    cvu: "",
    amount: "",
  });
  const [qrvalue, setQrvalue] = useState("");
  const [selectedValue, setSelectedValue] = useState(cvuP);
  const [value, setValue] = useState();
  const [loading, setLoading] = useState(false);

  const startLoading = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 4000);
  };

  const handlerSubmit = () => {
    let obj = {
      cvu: selectedValue,
      amount: inputText.amount,
    };
    console.log("****Vlires con piker****");
    console.log(obj);
    dispatch(getTransactions(selectedValue));
    startLoading();
    dispatch(rechargeByQr(obj, cvuD, cvuP));
    setQrvalue(obj);
    return;
  };

  console.log("***CVU CUENTAS*****");
  console.log(cvuP);
  console.log(cvuD);

  return (
    <ScrollView style={{ flex: 1 }}>
      {/* Imagen de fondo */}
      <Spinner
        //visibility of Overlay Loading Spinner
        visible={loading}
        //Text with the Spinner
        textContent={"Cargando..."}
        //Text style of the Spinner Text
        textStyle={styles.spinnerTextStyle}
      />
      <Image
        source={require("../assets/background1.png")}
        style={{ position: "absolute", backgroundColor: "white" }}
      />
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: -40,
            padding: 40,
            justifyContent: "center",
          }}
        >
          <Text style={styles.titleStyle}>
            Recarga dinero a tu cuenta desde cualquier punto de todo pago,
            presentando el codigo.
          </Text>
        </View>
        <View style={styles.QRcontainer}>
          <QRCode
            //QR code value
            value={qrvalue ? JSON.stringify(qrvalue) : "NA"}
            //size of QR Code
            size={250}
            //Color of the QR Code (Optional)
            color="black"
            //Background Color of the QR Code (Optional)
            backgroundColor="white"
            //Logo of in the center of QR Code (Optional)
            // logo={{
            //   url:
            //     '',
            // }}
            //Center Logo size  (Optional)
            logoSize={30}
            //Center Logo margin (Optional)
            logoMargin={2}
            //Center Logo radius (Optional)
            logoBorderRadius={15}
            //Center Logo background (Optional)
            logoBackgroundColor="yellow"
          />
        </View>

        <Text style={styles.textStyle}>
          Por favor inserta el monto a recargar
        </Text>
        {/* <TextInput style={styles.textInputStyle} onChangeText={(text) => setInputText({ ...inputText, amount: text })} placeholder='Enter Any Value' value={inputText.monto} /> */}
        <CustomInput
          label="Cantidad de dinero:"
          name="Cantidad"
          returnKeyType="done"
          onChangeText={(text) => setInputText({ ...inputText, amount: text })}
          style={styles.inputCantidadDinero}
          onFocus={() => setValue()}
          value={value}
        />
        <Text style={styles.textStyle}>Cuenta a recargar</Text>
        <Picker
          selectedValue={selectedValue}
          style={{ height: 50, width: 250 }}
          style={styles.inputSelect}
          onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
        >
          <Picker.Item label="Cuenta Pesos" value={cvuP} />
          <Picker.Item label="Cuenta Dolares" value={cvuD} />
        </Picker>
        {/* <TouchableOpacity style={styles.buttonStyle} onPress={handlerSubmit}>
					<Text style={styles.buttonTextStyle}>Generar codigo!</Text>
				</TouchableOpacity> */}
        <Button
          mode="contained"
          secureTextEntry={true}
          style={styles.buttonStyle}
          onPress={() => {
            handlerSubmit();
            setValue("");
          }}
        >
          Generar codigo
        </Button>
      </View>
    </ScrollView>
  );
};
export default Qrnative;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'white',
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    // padding: 50,
  },
  titleStyle: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    paddingLeft: 5,
  },
  textStyle: {
    textAlign: "center",
    margin: 10,
  },
  textInputStyle: {
    flexDirection: "row",
    height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  buttonStyle: {
    marginTop: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary,
    width: width * 0.5,
    alignSelf: "center",
  },
  buttonTextStyle: {
    color: "#FFFFFF",
    paddingVertical: 10,
    fontSize: 16,
  },
  inputCantidadDinero: {
    height: 40,
    borderBottomColor: "black",
    borderBottomWidth: 2,
    width: width * 0.5,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  QRcontainer: {
    marginTop: 50,
    marginBottom: 10,
  },
  inputSelect: {
    borderBottomColor: "black",
    borderBottomWidth: 6,
    width: width * 0.5,
  },
});
