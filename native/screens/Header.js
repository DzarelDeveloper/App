import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Link } from '@react-navigation/native';
import {LayoutAnimation, View, Button, Text, ScrollView, StyleSheet, TouchableHighlight} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Menu from './menu';

function Header({navigation}) {
  const [expanded, setExpanded]= React.useState(false)

  function toggleExpand(){
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    expanded ? setExpanded(false) : setExpanded(true)
  }
  const onPressLogout = () => {console.log('salir')}

return (
  <View style={styles.container}>
    <TouchableHighlight onPress={toggleExpand}>
      <Icon name="bars" color="white" size={25} />
    </TouchableHighlight>
    {expanded? <Menu/> : null }

    <TouchableHighlight>
    <View style={styles.logout}>
    <Link to="/Menu">
    <Icon name="home" color="white" size={25} /></Link>
    </View>
    </TouchableHighlight>
    <TouchableHighlight onPress={onPressLogout}>
      <View style={styles.logout}>
        <Icon name="sign-out" color="orange" size={25} />
      </View>
    </TouchableHighlight>
  </View>
);
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1D3448',
    height:60,
    justifyContent:'space-between',
    padding:30,
    flexDirection:'row'
    },
});

export default Header;