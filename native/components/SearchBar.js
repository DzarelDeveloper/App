import React, { useEffect, useState } from 'react';
import { Dimensions, Text, View, TextInput, SafeAreaView, FlatList, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Contacts from 'expo-contacts';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default function SearchBar({navigation}) {
  const [contacts, setContacts] = useState([]);
  const [results, setResults] = useState([]);
  const [contact, setContact] = useState({name : 'Juan',
  lastName: 'Perez',
  phoneNumbers:[{ number: 1122223333}]
});
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers],
        });

        if (data.length > 0) {
          setContacts(data)
        }
      }
    })();
  }, []);

  const onTap = (item) =>{
    setContact(item)
  }

  const onSend = () =>{
    if(contact.phoneNumbers[0]){
      {/*Linking.openURL(
        'http://api.whatsapp.com/send?phone=054' + contact.phoneNumbers[0].number
      );*/}
      setHidden(true)
    }
  }

  const searchContacts = value => {
    if(!value){
      setContacts(contacts);
      setHidden(false);
    }else{
    const filteredContacts = contacts.filter(contact => {
      let contactLowercase = (contact.firstName + ' ' + contact.lastName).toLowerCase();
      let searchTermLowercase = value.toLowerCase();
      return contactLowercase.indexOf(searchTermLowercase) > -1 ; 
    });
    setResults(filteredContacts); }   
  };

  const renderItem = ({ item }) => ( 
    <View style={{ minHeight: 70, padding: 1,}}>
      <TouchableOpacity key={item}
      onPress={() => onTap(item)}>
      <View style={{flexDirection:'row', alignItems:'center', margin:10}}>
          <View style={styles.bigCircle}><Text style={{color:'white'}}>
          {item.firstName && item.firstName.charAt(0).toUpperCase()}
          {item.lastName && item.lastName.charAt(0).toUpperCase()}
          </Text>
        </View>
            <View style={{flexDirection:'column'}}> 
            <Text style={styles.items}>
            {item.firstName && item.firstName + ' '}
            {item.lastName && item.lastName + ' '}
            </Text>
            <Text style={{ color: 'blue', fontWeight: 'bold', fontSize:16 }}>
              {item && item.phoneNumbers[0] && item.phoneNumbers[0].number}
            </Text>
            </View>
      </View>
      </TouchableOpacity>
    </View>);

  return (
    <View style={styles.container}>
      <SafeAreaView style={{marginTop:0}}/>
      <LinearGradient
        start={{ x: 0, y: 0}}
        end={{ x: 1, y: 1 }}
        colors={['indigo', 'indigo', 'white']}    
        style={{flex: 1}} >

                {/*header*/}
                <View style={styles.header}>
                <Link to="/ContactList">
                <Icon name="angle-left" color="white" size={30} /></Link>
                <Text style={{color: 'white', fontSize: 16 }}>Agregar contacto</Text>
                <Icon name="home" color="indigo" size={30} />
                </View>

          {/*input y lista*/}
          <View style={styles.box}>
          <Text style={{color: 'white', fontSize: 16 }}>Buscar un contacto en el telefono</Text>

          <TextInput placeholder="Ingresa un nombre" placeholderTextColor="#F5F5DC"  style={styles.input} onChangeText={value => searchContacts(value)}/>
          
      <View style={styles.flatList}>
      <FlatList data={ results.length === 0 ? contacts : results } renderItem={renderItem} keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={() => (
          <View><Text style={styles.items}>No hay contactos</Text></View>
        )}
        />
        </View>
        </View>


        <View style={styles.card}>
                  {/* circulo */}
                    <View style={styles.circle}>
                      <Text style={{color:'white', fontSize:50}}>
                      {contact.name && contact.name.charAt(0).toUpperCase()}
                      {contact.lastName && contact.lastName.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                   {/* nombre y telefono */}

                <Text style={{color:'grey', fontSize:20}}>Nombre: <Text style={{color:'grey', fontSize:20, fontWeight:'bold'}}>
                  {contact.name+' '}{contact.lastName}</Text></Text>
                    <Text style={{color:'grey', fontSize:20}}>Telefono: <Text style={{color:'grey', fontSize:20, fontWeight:'bold'}}>{contact.phoneNumbers[0] && contact.phoneNumbers[0].number}</Text> </Text>
                  
                   {/* boton*/}
               <TouchableOpacity onPress={onSend}>
                      <View style={{flexDirection:'row', backgroundColor:'indigo', width:width/1.3, height:70, margin:20, padding:10, borderRadius:20, justifyContent:'space-around',
                    alignItems:'center'}}>
                      <Icon name='whatsapp' color='white' size={50} />
                      <Text style={{color:'white', fontSize:20, textAlign:'center'}}>  
                      Invitar con WhatsApp
                      </Text>
                      </View>
                    </TouchableOpacity>
                    
                    { hidden ? <View style={{flexDirection:'row', backgroundColor:'indigo', height:70, margin:20, padding:10, borderRadius:20, justifyContent:'space-around',
                    alignItems:'center'}}>
                      <Text style={{color:'white', fontSize:20, textAlign:'center'}}>✔ Invitacion enviada</Text>
                    </View> : null }
                      
                </View>

        </LinearGradient>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header:{
    flexDirection: 'row', 
    alignItems:'flex-end', 
    height:60,
    justifyContent:'space-between', 
    backgroundColor: 'indigo', 
  },
  box:{
    margin:20,
  },
  input:{
    textAlign:'center',
    height: 50,
    fontSize: 20,
    color: '#F5F5DC', 
    borderRadius: 20,
    borderColor: '#9932CC',
    borderWidth:5,
  },
  items:{
    color: '#0c222f', 
    fontWeight: 'bold',
    fontSize: 24,
  },
  flatList:{
    marginTop:20,
    backgroundColor: 'white', 
    opacity: 0.5,  
    borderRadius: 20,
    height:height/3,
  },
  bigCircle:{
    alignItems:'center',
    alignContent:'center',
    justifyContent:'center',
    marginRight:10,
    width: 44, 
    height: 44, 
    borderRadius: 44/2,
    backgroundColor:'blue'
  },
  circle:{
    alignItems:'center',
    alignContent:'center',
    justifyContent:'center',
    marginRight:10,
    width:100,
    height:100,
    borderRadius:100/2,
    backgroundColor:'indigo'
  },
  card:{
    backgroundColor: "white",
    height:height/3,
    borderRadius: 20,
    margin:20,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
});