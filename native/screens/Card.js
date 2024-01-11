import React, { useState } from "react";
import {
  CreditCardInput,
  LiteCreditCardInput,
} from "react-native-credit-card-input";
import { useDispatch, useSelector } from "react-redux";
import { theme } from "../core/theme";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
  Modal,
  ScrollView,
  Picker,
} from "react-native";
import {
  rechargeByCard,
  getTransactions,
} from "../store/actions/acountActions";
import CustomInput from "../components/CustomInput";
import Button from "../components/Button";
import { Value } from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";

import Spinner from "react-native-loading-spinner-overlay";

const { width, height } = Dimensions.get("window");

const Card = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const session = useSelector((state) => state.session.userDetail);
  const accounts = useSelector((state) => state.acoount.account);
  const accountP = accounts[0];
  const accountD = accounts[1];
  const cvuP = accountP && accountP.cvu;
  const cvuD = accountD && accountD.cvu;
  const [selectedValue, setSelectedValue] = useState(cvuP);
  const [show, setShow] = useState(false);

  const [loading, setLoading] = useState(false);

  const startLoading = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 4000);
  };

  const [value, setValue] = useState();
  const [inputText, setInputText] = useState({
    cvu: "",
    amount: "",
  });

  const onChange = (formData) => {
    return;
  };

  const onFocus = (field) => console.log("focus", field);

  const handlerSubmit = () => {
    let obj = {
      cvu: selectedValue,
      amount: inputText.amount,
    };
	dispatch(getTransactions(selectedValue));
	startLoading();
    dispatch(rechargeByCard(obj, cvuD, cvuP));
    return;
  };

  const handleChange = (value) => {
    return setInputText({ ...inputText, amount: value });
  };

  return (
    <ScrollView>
      <Spinner
        //visibility of Overlay Loading Spinner
        visible={loading}
        //Text with the Spinner
        textContent={"Cargando..."}
        //Text style of the Spinner Text
        textStyle={styles.spinnerTextStyle}
      />
      {/* Imagen de fondo */}
      <Image
        source={require("../assets/background2.png")}
        style={{ position: "absolute", backgroundColor: "white" }}
      />
      <View style={styles.containerPrincipal}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 40,
            paddingVertical: 60,
            justifyContent: "center",
          }}
        >
          <Text style={styles.titleStyle}>
            Recarga dinero con una tarjeta de credito o debito
          </Text>
        </View>
        <View>
          <CreditCardInput
            autoFocus
            requiresName
            requiresCVC
            cardScale={1.1}
            allowScroll={true}
            labelStyle={styles.label}
            inputStyle={styles.input}
            validColor={"black"}
            invalidColor={"red"}
            placeholderColor={"darkgray"}
            placeholders={{
              number: "1234 5678 1234 5678",
              name: "NOMBRE COMPLETO",
              expiry: "MM/YY",
              cvc: "CVC",
            }}
            labels={{
              number: "NÚMERO TARJETA",
              expiry: "EXPIRA",
              name: "NOMBRE COMPLETO",
              cvc: "CVC",
            }}
            onFocus={onFocus}
            onChange={onChange}
          />
        </View>
        <View>
          <CustomInput
            label="Cantidad de dinero:"
            name="Cantidad"
            returnKeyType="done"
            onChangeText={(value) => handleChange(value)}
            style={styles.inputCantidadDinero}
            onFocus={() => setValue()}
            value={value}
          />
        </View>
        <View style={styles.textSeleccionarContainer}>
          <Text>Selecciona una cuenta desde la que transferir:</Text>
          <Picker
            selectedValue={selectedValue}
            style={{ height: 50, width: 250 }}
            style={styles.inputSelect}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedValue(itemValue)
            }
          >
            <Picker.Item label="Cuenta Pesos" value={cvuP} />
            <Picker.Item label="Cuenta Dolares" value={cvuD} />
          </Picker>
        </View>
        <View>
          {/* <TouchableOpacity style={styles.buttonStyle} onPress={handlerSubmit}>
					<Text style={styles.buttonTextStyle}>Recargar</Text>
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
            Recargar
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  containerPrincipal: {
    flexDirection: "column",
    // height: height,
    // flex: 1,
    // backgroundColor: 'white',
    justifyContent: "center",
    textAlign: "center",
    // alignItems: 'center',
    // marginVertical: 80,
  },
  label: {
    color: "black",
    fontSize: 16,
  },
  input: {
    fontSize: 18,
    color: "black",
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
  input: {
    height: 40,
    backgroundColor: "white",
    borderColor: "#fff",
  },
  inputCantidadDinero: {
    height: 40,
    backgroundColor: "white",
    borderBottomColor: "black",
    borderBottomWidth: 2,
    width: width * 0.5,
    alignSelf: "center",
    marginTop: 20,
  },
  // Text
  titleStyle: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    paddingLeft: 5,
  },
  textInputStyle: {
    flexDirection: "row",
    height: 40,
    width: "70%",
    margin: "auto",
    justifyContent: "center",
    textAlign: "center",
  },
  modalshut: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 0.3,
    borderRadius: 5,
    borderColor: "#669",
    width: width * 0.5,
    alignSelf: "center",
  },
  modal: {
    flex: 1,
    backgroundColor: "red",
  },
  modalContent: {
    marginLeft: width * 0.05,
    marginRight: width * 0.05,
    marginTop: height * 0.4,
    height: height * 0.2,
    width: width * 0.9,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.3,
    borderRadius: 5,
  },
  itemText: {
    fontSize: 20,
    textAlign: "center",
    color: theme.colors.secondary,
    justifyContent: "center",
  },
  textSeleccionarContainer: {
    // width: width * 0.5,
    alignSelf: "center",
    textAlign: "center",
    marginVertical: 10,
    justifyContent: "center",
  },
  inputSelect: {
    borderBottomColor: "black",
    borderBottomWidth: 6,
    width: 400,
  },
});

export default Card;
