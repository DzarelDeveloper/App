import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";
import { loguinUser } from "../store/actions/jwtUsersActions";
import Button from "../components/Button";
import Header from "../components/Header";
import CustomInput from "../components/CustomInput";
import { theme } from "../core/theme";
import Logo from "../components/Logo";
import * as Animatable from "react-native-animatable";
import Spinner from "react-native-loading-spinner-overlay";

export default function ResetPass({ id, email, password, isValid, navigation }) {
 
  const dispatch = useDispatch();
  const session = useSelector((state) => state.session.userDetail);
  const [loading, setLoading] = useState(false);

  const startLoading = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      <View>
        {/* <Logo style={styles.down}/> */}
        <Text style={styles.title}>Ingresa Tu mail</Text>
        

        <Formik
          initialValues={{
            email: "",
            
          }}
          
          onSubmit={(values, action) => {
            let user = { ...values };
            action.resetForm();

            //To lower case (wtf?)
            user.email = user.email.toLowerCase();
            startLoading();
            dispatch(
              
            );

            // navigation.navigate("RegisterModal");
          }}
        >
          {({ handleChange, handleSubmit, values, errors, touched }) => (
            <View>
              <Spinner
                //visibility of Overlay Loading Spinner
                visible={loading}
                //Text with the Spinner
                textContent={"Loading..."}
                //Text style of the Spinner Text
                textStyle={styles.spinnerTextStyle}
              />
              <Animatable.View animation="bounceInUp" delay={500}>
                <CustomInput
                  label="Correo"
                  name="email"
                  returnKeyType="next"
                  onChangeText={handleChange("email")}
                  value={values.email}
                  autoCapitalize="none"
                  autoCompleteType="email"
                  textContentType="emailAddress"
                  keyboardType="email-address"
                  style={styles.input}
                />

                {errors.email ? (
                  <Text style={{ fontSize: 10, color: "red" }}>
                    {errors.email}
                  </Text>
                ) : (
                  <Text style={{ fontSize: 10 }}></Text>
                )}

               
                <Button
                  mode="contained"
                  secureTextEntry={true}
                  title="Register"
                  style={styles.button}
                  onPress={handleSubmit}
                >
                  Cambiar Contraseña
                </Button>

               
              </Animatable.View>
            </View>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    textAlign: "center",
    paddingTop: 200,
    fontSize: 30,
    paddingBottom: 20,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  label: {
    color: theme.colors.secondary,
  },
  button: {
    marginTop: 20,
    marginBottom: 30,
    backgroundColor: theme.colors.primary,
  },
  row: {
    flexDirection: "row",
    marginTop: 4,
  },
  link: {
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  input: {
    height: 40,
    backgroundColor: "white",
    borderColor: "#fff",
  },
  forgotPassword: {
    color: theme.colors.secondary,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 11,
    color: theme.colors.primary,
  },
  down: {
    alignItems: "center",
  },
});
