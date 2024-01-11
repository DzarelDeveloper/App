import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, Picker, View, ScrollView, ImageBackground, Image, Dimensions } from 'react-native';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Link } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';

import { useDispatch, useSelector } from 'react-redux';

import { completeUserRegister } from '../store/actions/userActions';

import Background from '../components/Background';
import Logo from '../components/Logo';
import Button from '../components/Button';
import Header from '../components/Header';
import CustomInput from '../components/CustomInput';
import { theme } from '../core/theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';

const { width, height } = Dimensions.get('window');
const background = require('../assets/WelcomeBackground.png');
const logo = require('../assets/logo.png');

import Spinner from 'react-native-loading-spinner-overlay';
const AltaUser = ({ id, name, lastname, dni, phone, address, dob, navigation }) => {
  const dispatch = useDispatch();
  const stateUser = useSelector((state) => state.userUp);
  console.log("*************userUp***************");
  console.log(stateUser.userUp);
  const userUp = stateUser.userUp;
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity,setSelectedCity] =useState("");
  const [loading, setLoading] = useState(false);

  const startLoading = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  var normalize = (function() {
    var from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç", 
        to   = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc",
        mapping = {};
   
    for(var i = 0, j = from.length; i < j; i++ )
        mapping[ from.charAt( i ) ] = to.charAt( i );
   
    return function( str ) {
        var ret = [];
        for( var i = 0, j = str.length; i < j; i++ ) {
            var c = str.charAt( i );
            if( mapping.hasOwnProperty( str.charAt( i ) ) )
                ret.push( mapping[ c ] );
            else
                ret.push( c );
        }      
        return ret.join( '' );
    }
   
  })();


 async function handleProvince  (province){
    var result = await axios
      .get(
        `https://apis.datos.gob.ar/georef/api/provincias?nombre=${province}`
      )
      .then((res) => {
        //console.log("provincias", res.data.provincias)
        for(let i=0;i<res.data.provincias.length;i++){
          var provinceLowCase=res.data.provincias[i].nombre.toLowerCase();
          //console.log("Provincia en array",res.data.provincias[i].nombre)
          //console.log("PROVINCIAS includes",provinceLowCase.includes(province.toLowerCase()))
          if(normalize(provinceLowCase) === normalize(province.toLowerCase()) ){
            return true;
          }
        }

        return false;
        
      });

      if(result) setSelectedProvince(province);

      return result
  };

  async function handleCity (city,province){

    //console.log("PROVINCIA",province,"CIUDAD",city)
    var result;
    if(!province){
      return false
    }else{
     result = await axios
      .get(
        `https://apis.datos.gob.ar/georef/api/localidades?provincia=${province}&nombre=${city}`
      )
      .then((res) => {
        //console.log("CIUDADES",res.data.localidades)
        for(let i=0;i<res.data.localidades.length;i++){
          var cityLowCase=res.data.localidades[i].nombre.toLowerCase();
          //console.log("Ciudades en array",res.data.localidades[i].nombre)
          //console.log("Ciudades includes",cityLowCase.includes(city.toLowerCase()))
          if(normalize(cityLowCase) === normalize(city.toLowerCase()) ){
            return true;
          }
        }

        return false;
      });
    }

    if(result) setSelectedCity(city);

      return result
  };

  async function handleAddress(address) {
   
    var result;
    if(!address){
      return false
    }else{
      var addressWithNoDigits = address.replace(/[0-9]/g, '');
      result = await axios
      .get(
        `https://apis.datos.gob.ar/georef/api/calles?provincia=${selectedProvince}&localidad_censal=${selectedCity}&nombre=${addressWithNoDigits} `
      )
      .then((res) => {
        //console.log('res',res.data.calles)
        if (res.data.calles.length === 1) {
          return true
        } else {
          return false;
        }
      });
    }

    return result;
  }

  return (

	<ImageBackground source={background} style={styles.image}>
    

        <View style={styles.container}>
          <Text style={styles.title}>Darse de alta</Text>
          <Formik
            initialValues={{
              name: "",
              lastname: "",
              phone: "",
              address: "",
              province:"",
              city:"",
              // dob: "",
              _id: userUp._id,
            }}
            validationSchema={Yup.object({
              name: Yup.string()
                .min(4, "Debe tener al menos 4 caracteres")
                .max(50, "Debe tener 50 caracteres o menos")
                .required("Debes completar este campo"),
              lastname: Yup.string()
                .min(4, "Debe tener al menos 4 caracteres")
                .max(50, "Debe tener 50 caracteres o menos")
                .required("Debes completar este campo"),
              phone: Yup.string()
                .required("Please Enter your Phone Number")
                .matches(
                  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
                  "Phone number is not valid"
                ),
              address: Yup.string()
                .min(6, "Debe tener al menos 6 caracteres")
                .max(50, "Debe tener 50 caracteres o menos")
                .required("Debes completar este campo")
                .test(
                  "verifyAddress",
                  "Domicilio inexistente en esa Localidad",
                  (address) => {
                    return handleAddress(address);
                  }
                ),
                province: Yup.string()
                .min(4, "Debe tener al menos 4 caracteres")
                .max(50, "Debe tener 50 caracteres o menos")
                .required("Debes completar este campo")
                .test(
                  "verifyProvince",
                  "Provincia inexistente en el pais",
                  (province) => {
                    return handleProvince(province);
                  }
                ),
                city: Yup.string()
                .min(4, "Debe tener al menos 4 caracteres")
                .max(50, "Debe tener 50 caracteres o menos")
                .required("Debes completar este campo")
                .test(
                  "verifyCity",
                  "Ciudad inexistente en esa Provincia",
                  (city) => {
                    return handleCity(city,selectedProvince);
                  }
                ),
              // dob: Yup.string()
              //   .min(4, "Debe tener al menos 4 caracteres")
              //   .max(50, "Debe tener 50 caracteres o menos")
              //   .required("Debes completar este campo"),
            })}
            onSubmit={async (values, action) => {
              action.resetForm();
              //console.log('VALORES SUBMIT',values)
              startLoading();
              dispatch(
                completeUserRegister(values, () => navigation.navigate("Login"))
              );
            }}
          >
            {({ handleChange, handleSubmit, values, errors }) => (
              <View style={styles.form_container}>
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
                    label="Nombre"
                    name="name"
                    onChangeText={handleChange("name")}
                    value={values.name}
                    style={styles.input}
                  />
                  {errors.name ? (
                    <Text style={styles.error}>{errors.name}</Text>
                  ) : values.name.length >= 4 ? (
                    <Text style={{ fontSize: 10, color: "green" }}>
                      Correcto
                    </Text>
                  ) : (
                    <Text style={{ fontSize: 10 }}></Text>
                  )}

                  {/*  */}
                  <CustomInput
                    label="Apellido"
                    name="lastname"
                    onChangeText={handleChange("lastname")}
                    value={values.lastname}
                    style={styles.input}
                  />

                  {errors.lastname ? (
                    <Text style={styles.error}>{errors.lastname}</Text>
                  ) : values.lastname.length >= 4 ? (
                    <Text style={{ fontSize: 10, color: "green" }}>
                      Correcto
                    </Text>
                  ) : (
                    <Text style={{ fontSize: 10 }}></Text>
                  )}

                  {/*  */}

                  <CustomInput
                    placeholder="Teléfono"
                    name="phone"
                    onChangeText={handleChange("phone")}
                    value={values.phone}
                    style={styles.input}
                    keyboardType={"phone-pad"}
                  />

                  {errors.phone ? (
                    <Text style={styles.error}>{errors.phone}</Text>
                  ) : values.phone.length >= 4 ? (
                    <Text style={{ fontSize: 10, color: "green" }}>
                      Correcto
                    </Text>
                  ) : (
                    <Text style={{ fontSize: 10 }}></Text>
                  )}
                  {/*  */}


                  <CustomInput
                    placeholder="Provincia"
                    name="province"
                    onChangeText={handleChange("province")}
                    value={values.province}
                    style={styles.input}
                  />

                {errors.province ? (
                  <Text style={styles.error}>{errors.province}</Text>
                ) : values.province.length >= 4 ? (
                  <Text style={{ fontSize: 10, color: "green" }}>
                    Correcto
                  </Text>
                ) : (
                      <Text style={{ fontSize: 10 }}></Text>
                    )}

                    {/*  */}

                <CustomInput
                  placeholder="Ciudad"
                  name="city"
                  onChangeText={handleChange("city")}
                  value={values.city}
                  style={styles.input}
                />

                {errors.city ? (
                  <Text style={styles.error}>{errors.city}</Text>
                ) : values.city.length >= 4 ? (
                  <Text style={{ fontSize: 10, color: "green" }}>
                    Correcto
                  </Text>
                ) : (
                      <Text style={{ fontSize: 10 }}></Text>
                    )}


                    {/*  */}

                 
                  {/* <CustomInput
                  placeholder="Fecha de nacimiento"
                  name="dob"
                  onChangeText={handleChange("dob")}
                  value={values.dob}
                  style={styles.input}
                />
                {values.dob.length >= 4 && !errors.phone && (
                  <Icon name="check" size={40} color="green" />
                )}
                {errors.dob && (
                  <Text style={{ fontSize: 10, color: "red" }}>
                    {errors.dob}
                  </Text>
                )} */}
                  {/*  */}

                  <CustomInput
                    label="Dirección"
                    name="address"
                    onChangeText={handleChange("address")}
                    value={values.address}
                    style={styles.input}
                  />

                  {errors.address ? (
                    <Text style={styles.error}>{errors.address}</Text>
                  ) : values.address.length >= 4 ? (
                    <Text style={{ fontSize: 10, color: "green" }}>
                      Correcto
                    </Text>
                  ) : (
                    <Text style={{ fontSize: 10 }}></Text>
                  )}
                  {/*  */}

                  <Button mode='contained' secureTextEntry={true} title='Register' style={styles.button} onPress={handleSubmit}>
									Enviar
								</Button>
                </Animatable.View>
              </View>
            )}
          </Formik>
        </View>
    
	</ImageBackground>
  );
};

const styles = StyleSheet.create({
	image: {
		flex: 1,
		resizeMode: 'cover',
		justifyContent: 'center',
		alignItems: 'center',
		// backgroundColor: 'blue',
	},
	container: {
		alignItems: 'center',
		// backgroundColor: 'blue',
		width: 0.8 * width,
	},
	title: {
		textAlign: 'center',
		// paddingTop: 120,
		fontSize: 30,
		paddingBottom: 5,
		fontWeight: 'bold',
		color: theme.colors.primary,
	},
	label: {
		color: theme.colors.secondary,
	},
	form_container: {
		width: '70%',
	},
	button: {
		marginTop: 10,
		// marginBottom: 10,
		backgroundColor: theme.colors.primary,
	},
	row: {
		flexDirection: 'row',
		marginTop: 4,
	},
	link: {
		fontWeight: 'bold',
		color: theme.colors.primary,
	},
	input: {
		height: 40,
		backgroundColor: 'white',
	},
	error: {
		fontSize: 10,
		color: 'red',
	},
	picker: {
		color: 'grey',
		height: 40,
	},
});

export default AltaUser;