import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, Dimensions, Text, RefreshControl, ScrollView } from 'react-native';
import { DataTable } from 'react-native-paper';
import { color } from "react-native-reanimated";
import { theme } from "../core/theme";;



 const Table  = ({arrayValues, arrayDay})=>{
    let arrayForTable = [
        {
            amiunt:arrayValues[0]*1000,
            day : arrayDay[0]
        },
        {
            amiunt:arrayValues[1]*1000,
            day : arrayDay[1]
        },
        {
            amiunt:arrayValues[2]*1000,
            day : arrayDay[2]
        },
        {
            amiunt:arrayValues[3]*1000,
            day : arrayDay[3]
        },
        {
            amiunt:arrayValues[4]*1000,
            day : arrayDay[4]
        },
        {
            amiunt:arrayValues[5]*1000,
            day : arrayDay[5]
        },
        {
            amiunt:arrayValues[6]*1000,
            day : arrayDay[6]
        },

    ]
     return (
        <View style={styles.container}>
            <DataTable >
                    <DataTable.Header style={styles.row}>
                    <DataTable.Title style={styles.head}>Dia</DataTable.Title>
                    <DataTable.Title numeric style={styles.head}>Valor $</DataTable.Title>
                    </DataTable.Header>
                {
                    arrayForTable.map(x => {
                        return (
                        <DataTable.Row >
                            <DataTable.Cell>{x.day}</DataTable.Cell>
                            <DataTable.Cell numeric>$ {x.amiunt}</DataTable.Cell>
                        </DataTable.Row>
                        )
                    })
                }
            </DataTable>

        </View>
     )
 }

 export default Table

 const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#E6E6E6",
      margin:10,
      padding:10,
      borderRadius:15,
    },
    row:{

        borderBottomWidth:4,
        borderBottomColor: theme.colors.primary,
        
    },
    head:{
        color:"white"
    }

  });