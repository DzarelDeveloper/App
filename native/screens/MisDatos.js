import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { StyleSheet, ScrollView, Text, View, Image, Platform, Button } from 'react-native'
import { Avatar } from 'react-native-image-avatars'
import { color, set } from 'react-native-reanimated';
import * as Animatable from 'react-native-animatable';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import axios from "axios"
import {updateUserAvatar} from "../store/actions/userActions.js"
import {verifySession} from "../store/actions/jwtUsersActions.js"

export default function MisDatos(props) {

	const dispatch = useDispatch();
    const session = useSelector((state) => state.session.userDetail);
    const [image, setImage] = useState(null);
    const [avatar,setAvatar] =useState(session.avatar)
    const {name,lastname,username,province,city,phone,address,dni} = (session)?(session):"placeholder"


    const updateAvatar = (avatar)=>{
        return axios.post("https://api.imgur.com/3/image",
        { image: avatar, type: "base64" },
        {
          headers: {
            Authorization: `Client-ID c7be4ab540be728`,
          },
        }
        ).then((response)=>{
            console.log("data imagen upload",response.data)
            const avatarUpload = (response.data.data.link).toString()
            dispatch(verifySession())
            setImage(avatarUpload)
            setAvatar(avatarUpload)
            const userData ={_id:session._id, avatar: avatarUpload}
            dispatch(updateUserAvatar(userData))
            return response.data
        }).catch((err)=> console.log("FALLO TODO"))
    }

    useEffect(() => {
        
      (async () => {
        setImage((avatar.toString()))
        if (Platform.OS !== 'web') {
          const {status}= await ImagePicker.requestCameraPermissionsAsync(Permissions.CAMERA);
          //const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
          if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
          }
        }
      })();
    }, []);
    

    //console.log("SESSION avatar",session.avatar)

    const pickImage = async () => {
        /* let result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        }); */
    
         let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
          base64: true,
        });

        //console.log("IMAGEN EN BASE 64",result.base64)
    
    
    
        //console.log(result);
    
        if (!result.cancelled) {
          updateAvatar(result.base64);
        }
        
      };
    return (
        <ScrollView> 
        <View style={styles.avatar}>
        {/* Imagen de fondo */}
        {console.log("imagen",image)}
			<Image source={require('../assets/background2.png')} style={{ position: 'absolute' }} />
            {avatar ? <Ionicons color='indigo'  style={{ left:10 }}><Avatar imageUrl = { avatar } size="medium"
						borderColor = "#f2f2f2"
                        shadow
                        /></Ionicons>:<Ionicons color='indigo'  style={{ left:10 }}><Avatar
                        imageUrl = { image }
                        size="medium"
						borderColor = "#f2f2f2"
						shadow
						/></Ionicons>}
                        <View style={styles.upload}>
                            <Text style={styles.plus}><Ionicons name="ios-camera" size={40} onPress={pickImage}></Ionicons></Text>
                        </View> 
                <View style={styles.text}>
                    <Text style={styles.nombre}>{(name)?(name.replace(/\b\w/g, l => l.toUpperCase())):"Name Placeholder"} {(lastname)?(lastname.replace(/\b\w/g, l => l.toUpperCase())):"LastName Placeholder"}</Text>
                    <Text style={styles.usuario}>@{username}</Text>

                </View>  
            <View style={styles.divider}>                 
                    <View style={styles.left}>
                        <Text style={styles.datosEntry1}>Provincia:</Text>
                    </View>
                    <View style={styles.right}>
                        <Text style={styles.datosEntry}>{(province)?(province.replace(/\b\w/g, l => l.toUpperCase())):"Province Placeholder"}</Text>  
                    </View>                          
            </View>
            <View style={styles.divider}>
                <View style={styles.left}>
                    <Text style={styles.datosEntry1}>Ciudad:</Text>
                </View>
                <View style={styles.right}>
                    <Text style={styles.datosEntry}>{(city)?(city.replace(/\b\w/g, l => l.toUpperCase())):"Ciudad Placeholder"}</Text>
                </View>
            </View>
            <View style={styles.divider}>
                <View style={styles.left}>
                    <Text style={styles.datosEntry1}>Direccion:</Text>
                </View>
                <View style={styles.right}>
                    <Text style={styles.datosEntry}>{(address)?(address.replace(/\b\w/g, l => l.toUpperCase())):"Direccion Placeholder"}</Text>
                </View>
            </View>
            <View style={styles.divider}> 
                <View style={styles.left}>
                    <Text style={styles.datosEntry1}>Telefono:</Text>             
                </View>
                <View style={styles.right}>
                    <Text style={styles.datosEntry}>{phone}</Text>
                </View> 
            </View>
            <View style={styles.divider}> 
                <View style={styles.left}>
                    <Text style={styles.datosEntry1}>DNI:</Text>               
                </View>
                <View style={styles.right}>
                   <Text style={styles.datosEntry}>{dni}</Text> 
                </View> 
            </View> 
           
               
        </View>
    </ScrollView>
    )
}

const styles = StyleSheet.create({
    left: {
     width: 80,
     left: -180
    },
    right: {
        width: 100,
        right: -10,
        top: -20
       },
    avatar: {              
        top: 0,        
        alignItems:'center'
    },
    upload: {   
        marginTop: -50,
        borderRadius: 30,
        width:50,
        height:50,
        color: 'red',
        left: 65,
        marginBottom: 3,
        backgroundColor: 'black',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
    },
    plus: {               
        marginTop: 2,
        color: 'white',
        left: 11,
        marginBottom: -10,

    },
    nombre: {   
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        fontStyle: 'italic'
    },

    usuario: {
        color: 'white',
        fontSize: 17,
        fontStyle: 'italic',
        marginBottom:50      
    },

    datosEntry: {  
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold',
        fontStyle: 'italic'  
    },
    datosEntry1: {  
        color: 'black',
        fontSize: 18,
        fontWeight: 'bold',
        fontStyle: 'italic'
    },
    divider: {
        height:50,
        width:"50%",
        backgroundColor:"white",
        borderRadius:15,
        left: 80,
        padding:10,
        elevation:15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 5, 
        marginBottom: 10,
        alignItems:'center',
        backgroundColor: 'indigo',
        opacity: 0.8
    }
})
