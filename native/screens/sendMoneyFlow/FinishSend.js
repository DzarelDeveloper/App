import React, { useEffect, useState,useCallback } from "react";

import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Modal, Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { theme } from "../../core/theme";
import Icon from 'react-native-vector-icons/FontAwesome';
import Button from "../../components/Button";
import { Formik } from 'formik';
import CustomInput from '../../components/CustomInput';
import { useDispatch, useSelector } from 'react-redux';
import { transferMoney, getTransactions } from '../../store/actions/acountActions'
import Toast from "react-native-toast-message";
import Spinner from "react-native-loading-spinner-overlay";
import {
    getAccount,
    getDollarsTransactions,
    getPesosTransactions,
  } from "../../store/actions/acountActions";
const { width, height } = Dimensions.get('window');

const ModalSelector = ({ show, control, setter }) => {
    return (

        <View>
            <Modal
                visible={show}
                animated
                animationType='fade'
                transparent={true}
            >
                <View style={styles.modalContent}>
                    <TouchableOpacity onPress={() => { setter({ title: 'pesos', type: 'pesos', pos: 0 }); control(false) }}>
                        <View style={styles.item}>
                            <Text style={styles.itemText}>Cuenta en pesos</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { setter({ title: 'dólares', type: 'dollars', pos: 1 }); control(false) }}>
                        <View style={styles.item}>
                            <Text style={styles.itemText}>Cuenta en dólares</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    )
}

export default function SelectContact({ navigation, route }) {

    const accounts = useSelector((state) => state.acoount.account);
    const pesosAccount = accounts[0];
    const dollarsAccount = accounts[1];
    const pesosBalance = pesosAccount && pesosAccount.balance;
    const dollarsBalance = dollarsAccount && dollarsAccount.balance;
    const loggedUser = useSelector((state) => state.session.userDetail);
    const dispatch = useDispatch();
    const cvuP = pesosAccount && pesosAccount.cvu;
	const cvuD = dollarsAccount && dollarsAccount.cvu;
    const [showModalFrom, setShowModalFrom] = React.useState(false);
    const [showModalTo, setShowModalTo] = React.useState(false);
    const [fromAcc, setFromAcc] = React.useState({
        title: 'pesos',
        type: 'pesos',
        pos: 0
    })

    const [loading, setLoading] = useState(false);

    const startLoading = () => {
      setLoading(true);
      setTimeout(() => {

        dispatch(getDollarsTransactions(cvuD));
        dispatch(getPesosTransactions(cvuP));

        setLoading(false);
      }, 4000);
    };

    useEffect(() => {

        dispatch(getDollarsTransactions(cvuD));
        dispatch(getPesosTransactions(cvuP));

      }, []);

    const [toAcc, setToAcc] = React.useState({
        title: 'dólares',
        type: 'pesos',
        pos: 0
    })

    const [values, setValues] = React.useState({
        amount: '',
        description: ''
    })

    const handleInput = (name, text) => {
        setValues({ ...values, [name]: text });
    }

    const handleFinish = (data) => {

        const send = {
            from: loggedUser.accounts[fromAcc.pos].cvu,
            to: data.accounts[toAcc.type],
            amount: values.amount,
            description: values.description,
        }

        dispatch(transferMoney(send,cvuP,cvuD));

        Toast.show({
            type: "success",
            position: "top",
            text1: "Cargando...",
            text2: "Ejecutando la transacción",
            visibilityTime: 3000,
            autoHide: true,
            topOffset: 30,
            bottomOffset: 40,
        });
        // startLoading();
        setTimeout(function () {

            dispatch(getTransactions(loggedUser.accounts[fromAcc.pos].cvu));
            
            Toast.show({
                type: "success",
                position: "top",
                text1: "Transacción exitosa",
                text2: "Se envió el dinero correctamente",
                visibilityTime: 3000,
                autoHide: true,
                topOffset: 30,
                bottomOffset: 40,
            });
            startLoading()
        }, 3000);
        
    }

    return (
        <ScrollView backgroundColor={'white'}>
            <View>
        <Spinner
                //visibility of Overlay Loading Spinner
                visible={loading}
                //Text with the Spinner
                textContent={"Cargando..."}
                //Text style of the Spinner Text
                textStyle={styles.spinnerTextStyle}
              />
                <View style={styles.header}>
                    <Image source={require('../../assets/background2.png')} style={{ position: 'absolute' }} />
                    <View style={styles.rowII}>
                        <Icon name="money" color={'white'} size={30} />
                        <Text style={styles.title}> Transferir dinero </Text>
                    </View>
                    <Text style={styles.instruction}> Por último completa esta información </Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.balaceTitle}> Tu balance actual </Text>
                    <View style={styles.totalContainer}>
                        <View style={styles.balance}>
                            <Text style={styles.pesosTitle}> Pesos </Text>
                            <Text style={styles.pesosValue}>$ {pesosBalance}</Text>
                        </View>
                        <View style={styles.balance}>
                            <Text style={styles.dollarsTitle}> Dólares </Text>
                            <Text style={styles.dollarsValue}>USD {dollarsBalance}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.main}>
                    <Text style={styles.from}> Selecciona cómo se realizará la transacción</Text>
                    <View>
                        <Formik>
                            <View style={styles.main}>

                                <View style={styles.summary}>

                                    <View style={styles.selector}>
                                        <TouchableOpacity onPress={() => setShowModalFrom(true)}>
                                            <View style={styles.modalshut}>
                                                <Text style={{ textAlign: 'center', fontSize: 12 }}>Mi cuenta en {fromAcc.title}</Text>
                                            </View>
                                        </TouchableOpacity>

                                        <Icon name="arrow-right" color={theme.colors.primary} size={15} style={{marginTop:5}}/>

                                        <TouchableOpacity onPress={() => setShowModalTo(true)}>
                                            <View style={styles.modalshut}>
                                                <Text style={{ textAlign: 'center', fontSize: 12 }}>Una cuenta en {toAcc.title}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>

                                    <CustomInput
                                        label='Valor'
                                        name='amount'
                                        keyboardType={'phone-pad'}
                                        style={styles.input}
                                        onChangeText={(value) => handleInput('amount', value)}
                                    />

                                    <CustomInput
                                        label='Descripción'
                                        name='description'
                                        style={styles.input}
                                        onChangeText={(value) => handleInput('description', value)}
                                    />

                                    { route.params && <Text style={styles.description}>Se trasferirán {values.amount.length > 0 ? (values.amount) : (0)} {fromAcc.title} a tu contacto {route.params.name[0].toUpperCase() + route.params.name.slice(1) }</Text>}
                                    <Text style={styles.foot}>Presiona enviar para finalizar la transacción</Text>
                                </View>
                                <Button
                                    mode="contained"
                                    disabled={ parseInt(values.amount ) > 0 ? false : true}
                                    secureTextEntry={true}
                                    style={ parseInt(values.amount ) > 0 ? styles.button : {...styles.button, backgroundColor: '#ddd'} }
                                    onPress={() => handleFinish(route.params)}
                                > Enviar
                                </Button>

                            </View>
                        </Formik>

                        <ModalSelector show={showModalFrom} control={setShowModalFrom} setter={setFromAcc} />
                        <ModalSelector show={showModalTo} control={setShowModalTo} setter={setToAcc} />

                    </View>
                </View>

            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    header: {
        width: '100%',
        paddingLeft: 15
    },
    rowI: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rowII: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 35,
        justifyContent: 'center',
    },
    back: {
        color: 'white',
        alignItems: 'center',
        marginLeft: 5,
    },
    title: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        paddingLeft: 5
    },
    instruction: {
        textAlign: 'center',
        fontSize: 12,
        color: 'white',
        paddingBottom: 15,
    },
    input: {
        height: 40,
        backgroundColor: 'white',
    },
    card: {
        margin: 10,
        backgroundColor: '#fff',
        borderColor: theme.colors.secondary,
        borderRadius: 5,
        elevation: 1
    },
    balaceTitle: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.secondary,
        padding: 14,
    },
    totalContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    pesosTitle: {
        textAlign: 'center',
        color: theme.colors.secondary,
        fontWeight: 'bold',
        fontSize: 16,
    },
    pesosValue: {
        textAlign: 'center',
        color: 'green',
        fontWeight: 'bold',
        fontSize: 15,
    },
    dollarsTitle: {
        textAlign: 'center',
        color: theme.colors.secondary,
        fontWeight: 'bold',
        fontSize: 16,
    },
    dollarsValue: {
        textAlign: 'center',
        color: 'green',
        fontWeight: 'bold',
        fontSize: 15,
    },
    balance: {
        paddingBottom: 20
    },
    from: {
        color: theme.colors.secondary,
        textAlign: 'center',
        fontWeight: 'bold',
        padding: 7
    },
    button: {
        marginTop: 20,
        marginBottom: 30,
        borderWidth: 1,
        backgroundColor: theme.colors.primary,
        width: width * .5,
    },
    main: {
        flex: 1,
        alignItems: 'center',
    },
    modal: {
        flex: 1,
        backgroundColor: 'red'
    },
    modalContent: {
        marginLeft: width * .05,
        marginRight: width * .05,
        marginTop: height * .40,
        height: height * .2,
        width: width * .9,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: .3,
        borderRadius: 5
    },
    amountSelect: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '90%',
    },
    inputAmount: {
        width: width * .7,
        height: 40,
        backgroundColor: 'white',
    },
    modalshut: {
        marginTop: 5,
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 12,
        paddingRight: 12,
        borderWidth: .5,
        borderRadius: 20,
        borderColor: theme.colors.secondary,
    },
    summary: {
        marginTop: 5,
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 12,
        paddingRight: 12,
        borderWidth: .3,
        borderRadius: 5,
        borderColor: '#fff',
        width: width * .95,
        height: height * .32
    },
    item: {
        backgroundColor: 'transparent',
        width: width * .9,
        marginTop: 10,
    },
    itemText: {
        fontSize: 20,
        textAlign: 'center',
        color: theme.colors.secondary,
    },
    description: {
        paddingTop: 20,
        color: theme.colors.secondary,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    foot: {
        color: theme.colors.secondary,
        textAlign: 'center',

    },
    selector: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    }

})




