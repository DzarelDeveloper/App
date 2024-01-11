import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, Dimensions, Text, RefreshControl, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
  
} from "react-native-chart-kit";
import {getTransactions} from '../store/actions/acountActions'
import { theme } from '../core/theme';

 const Grafica  = ({ data })=>{
     return (
                <View >
                
                    <LineChart
                        data={{
                        labels: ["1", "2", "3", "4", "5", "6", "7"],
                        datasets: [
                            {
                            data: data
                            }
                        ]
                        }}
                        width={Dimensions.get("window").width} // from react-native
                        height={300}
                        yAxisLabel="$"
                        xAxisLabel = 'Dia '
                        yAxisSuffix="k"
                        yAxisInterval={3} // optional, defaults to 1
                        chartConfig={{
                        backgroundColor: theme.colors.secondary,
                        backgroundGradientFrom: theme.colors.secondary,
                        backgroundGradientTo: theme.colors.primary,
                        decimalPlaces: 0, // optional, defaults to 2dp
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: {
                            borderRadius: 10,
                        },
                        propsForDots: {
                            r: "6",
                            strokeWidth: "2",
                            stroke: "#ffa726"
                        }
                        }}
                        bezier
                        style={{
                        marginVertical: 15,
                        borderRadius: 16,
                        margin:10,
                        
                        }}
                    />
            </View>
     )
 }

 export default Grafica