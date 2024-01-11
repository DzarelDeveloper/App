
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Link } from '@react-navigation/native';
import {Dimensions, View, Text, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const {width, height} = Dimensions.get('window')

function Menu({navigation}) {

return (
  <View style={styles.menu}>
    <ScrollView>
      <Link to="/RechargeScreen">
        <View style={styles.row}>
          <Text  style={{color: '#fff'}}>Recargar saldo </Text>
          <Icon name="caret-right" color="orange" size={25} />
        </View>
      </Link>
      <Link to="/SendMonyScreen">
        <View style={styles.row}>
          <Text  style={{color: '#fff'}}>Enviar dinero </Text>
          <Icon name="caret-right" color="orange" size={25} />
        </View>
      </Link>
      <Link to="/Transactions">
        <View style={styles.row}>
          <Text  style={{color: '#fff'}}>Transacciones </Text>
          <Icon name="caret-right" color="orange" size={25} />
        </View>
      </Link>

    </ScrollView>
  </View>
);
}

const styles = StyleSheet.create({
  menu: {
    backgroundColor: '#1D3448',
    flex: 1,
    width:width/2,
    height:height/4,
    padding:10,
    justifyContent:'space-between'
  },
  row:{
    flexDirection:'row'
  }
});

export default Menu;
