import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  ScrollView,
  ActivityIndicator,
  Image,
  Alert,
  Dimensions,
} from "react-native";
import { theme } from "../../core/theme";
import Button from "../../components/Button";
import { deleteContact } from "../../store/actions/contactsAction";
import Spinner from "react-native-loading-spinner-overlay";
// Dimensions
const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

export default function ContactCard({ props, route, navigation }) {
  const dispatch = useDispatch();
  const session = useSelector((state) => state.session.userDetail);
  const [loading, setLoading] = useState(false);

  const startLoading = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  };

  if (route.params) {
    console.log("dame los params wacho");
    var user = route.params.item;
  }
  console.log("dame los params wacho");
  useEffect(() => {
    /* getUserById(props.route.params.userId) */
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require("../../assets/background2.png")}
        style={{ position: "absolute" }}
      />
      <Spinner
        //visibility of Overlay Loading Spinner
        visible={loading}
        //Text with the Spinner
        textContent={"Cargando..."}
        //Text style of the Spinner Text
        textStyle={styles.spinnerTextStyle}
      />
      <View
        style={
          {
            // backgroundColor: 'gold',
          }
        }
      >
        <View
          style={{
            paddingBottom: 40,
          }}
        >
          <Text style={styles.title}>Nombre de usuario:</Text>
          <Text style={styles.body}>{user.name}</Text>
          <Text style={styles.title}>E-mail:</Text>
          <Text style={styles.body}>{user.email}</Text>
        </View>

        <View style={{ marginTop: 4 }}>
          <View style={{ marginTop: 10 }}>
            <Button
              title="Borrar contacto"
              mode="contained"
              secureTextEntry={true}
              style={styles.button}
              onPress={() => {
                startLoading();
                dispatch(
                  deleteContact(user.email, session._id, () =>
                    navigation.reset({
                      index: 0,
                      routes: [{ name: "Contactos" }],
                    })
                  )
                );
              }}
            >
              Borrar contacto
            </Button>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    textAlign: "center",
    paddingTop: 20,
    fontSize: 22,
    // paddingBottom: 20,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  body: {
    textAlign: "center",
    paddingTop: 20,
    fontSize: 20,
    // paddingBottom: 20,
    fontWeight: "bold",
    color: "grey",
  },
  label: {
    color: theme.colors.secondary,
  },
  button: {
    backgroundColor: "indigo",
    // height: 50,
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
