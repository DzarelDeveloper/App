import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import { theme } from '../core/theme';
import { useDispatch, useSelector } from 'react-redux';
import { getTransactions } from '../store/actions/acountActions';

const { width, height } = Dimensions.get('window');
const tabWidth = width / 4;

/* * * * * * * * * * * * * * * * *
 * Renderiza todas las tabs      *
 * * * * * * * * * * * * * * * * */
const Tabs = ({ children }) => {
    return <View style={styles.tabs}>{children}</View>;
};

/* * * * * * * * * * * * * * * * *
 * Renderiza una sola tab        *
 * * * * * * * * * * * * * * * * */
const Tab = ({ title, active }) => {
    return (
        <View style={[styles.tab, active ? styles.activeTab : {}]}>
            <Text style={styles.tabText}>{title}</Text>
        </View>
    );
};

export default function Transactions({ navigation }) {

    const dispatch = useDispatch();
    const session = useSelector((state) => state.session.userDetail);
    const transactions = useSelector((state) => state.acoount.transactions) || ['jaja'];

    const today = new Date();
    const milisecondsOneDay = 1000 * 60 * 60 * today.getHours();
    const milisecondsWeek = 1000 * 60 * 60 * 24 * 7;
    const milisecondsTwoWeek = 1000 * 60 * 60 * 24 * 15;
    const aDayAgo = today.getTime() - milisecondsOneDay;
    const aWeekAgo = today.getTime() - milisecondsWeek;
    const fifteenDaysAgo = today.getTime() - milisecondsTwoWeek;

    const oneDayTransactions = transactions.filter(transact => new Date(transact.date) > new Date(aDayAgo));
    const weeklyTransactions = transactions.filter(transact => new Date(transact.date) > new Date(aWeekAgo));
    const FifteenTransactions = transactions.filter(transact => new Date(transact.date) > new Date(fifteenDaysAgo));

    console.log('HOY', today.getHours());

    const [tabState, setTabState] = useState({
        all: true,
        first: false,
        second: false,
        custom: false,
    });

    const [show, setShow] = useState(transactions);

    const pressedTab = (key) => {
        if (key === 'A') {
            setTabState({ all: true, first: false, second: false, custom: false });
            setFlag(true);
        } else if (key === 'B') {
            setTabState({ all: false, first: true, second: false, custom: false });
            setFlag(true);
        } else if (key === 'C') {
            setTabState({ all: false, first: false, second: true, custom: false });
            setFlag(true);
        }
        else {
            setTabState({ all: false, first: false, second: false, custom: true });
            setFlag(true);
        }
    };

    useEffect(() => {
        let x = session.accounts[0].cvu
        dispatch(getTransactions(x));
        //dispatch(getTransactions(cvuDollars));
        setShow(transactions);
    }, [transactions.length]);

    const [flag, setFlag] = useState(true)

    if (tabState.all && flag) {
        setShow(transactions);
        setFlag(false);
    } else if (tabState.first && flag) {
        setShow(oneDayTransactions);
        setFlag(false);
    } else if (tabState.second && flag) {
        setShow(weeklyTransactions);
        setFlag(false);
    } else if (tabState.custom && flag) {
        setShow(FifteenTransactions);
        setFlag(false);
    }

    return (

        <View>

            <View style={styles.header}>
                <Image source={require('../assets/background2.png')} style={{ position: 'absolute' }} />

                <View style={styles.rowI}>
                    <Icon name="exchange" color={'white'} size={30} />
                    <Text style={styles.title}> Transacciones realizadas</Text>
                </View>

                <Text style={styles.instruction}> Elige el periodo que deseas consultar </Text>
            </View>

            <Tabs>
                <TouchableOpacity style={styles.rowII} onPress={() => pressedTab('A')}>
                    <Tab title='Todas' active={tabState.all} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.rowII} onPress={() => pressedTab('B')}>
                    <Tab title='Hoy' active={tabState.first} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.rowII} onPress={() => pressedTab('C')}>
                    <Tab title='7 días' active={tabState.second} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.rowII} onPress={() => pressedTab('D')}>
                    <Tab title='15 días' active={tabState.custom} />
                </TouchableOpacity>
            </Tabs>

            <ScrollView>
                <View style={{ marginBottom: 250 }}>
                    {
                        show.length > 0 ? show.map((transaction, i) => (
                            <TouchableOpacity
                                key={i}
                                onPress={() => navigation.navigate('TransactionDetails', transaction)}>

                                <View style={styles.itemContainer}>

                                    <View style={styles.firstItem}>
                                        {
                                            transaction.by === 'QR' ?
                                                <Icon name={'qrcode'} color={theme.colors.secondary} size={20} /> :
                                                transaction.by === 'Credit Card' || transaction.by === 'Debit Card' ?
                                                    <Icon name={'credit-card'} color={theme.colors.secondary} size={15} /> :
                                                    <Icon name={'location-arrow'} color={theme.colors.secondary} size={20} />
                                        }

                                        <View>
                                            {
                                                transaction.by === 'QR' ?
                                                    <Text style={styles.firstItemData}>QR</Text> :
                                                    transaction.by === 'Credit Card' || transaction.by === 'Debit Card' ?
                                                        <Text style={styles.firstItemData}>Tarjeta</Text> :
                                                        <Text style={styles.firstItemData}>Transferencia</Text>

                                            }
                                            <Text style={styles.date}>{(new Date(transaction.date)).toDateString().substring(4, 15) + ' - ' + (new Date(transaction.date)).toLocaleTimeString()}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.secondItem}>
                                        {
                                            transaction.type == 'In' ?
                                                <Text style={styles.secondItemIn}>{transaction.amount}</Text> :
                                                <Text style={styles.secondItemOut}>{transaction.amount}</Text>
                                        }
                                    </View>

                                    <View style={styles.thirdItem}>
                                        <Icon name={'angle-right'} color={theme.colors.primary} size={15} />
                                    </View>

                                </View>


                            </TouchableOpacity>
                        )) :

                            <View style={styles.loading}>
                                <Icon name={'download'} color={theme.colors.secondary} size={55} />
                                <Text style={{ color: theme.colors.secondary, paddingTop: 20 }}>Descargando...</Text>
                            </View>
                    }
                </View>
            </ScrollView>

        </View>

    )
}

const styles = StyleSheet.create({
    header: {
        width: '100%',
        //backgroundColor: theme.colors.primary,
        paddingLeft: 15
    },
    rowI: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 25,
        justifyContent: 'center',
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
        paddingBottom: 20,
    },
    tabs: {
        height: 50,
        width: width,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row',
    },
    tab: {
        height: 50,
        width: tabWidth,
        justifyContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    tabText: {
        fontWeight: 'bold',
        color: theme.colors.secondary,
        padding: 1,
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: theme.colors.primary,
    },
    itemContainer: {
        flexDirection: 'row',
        padding: 12,
        alignItems: 'center',
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#f2f2f2',
    },
    firstItem: {
        flexDirection: 'row',
        alignItems: 'center',
        width: width / 2
    },
    firstItemData: {
        fontSize: 11,
        paddingLeft: 15,
    },
    secondItem: {
        width: width / 4,
        alignItems: 'center'
    },
    secondItemIn: {
        color: 'green',
        fontSize: 12,
        fontWeight: 'bold'
    },
    secondItemOut: {
        color: 'red',
        fontSize: 12,
        fontWeight: 'bold'
    },
    thirdItem: {
        width: width / 4,
        alignItems: 'center',
    },
    date: {
        fontSize: 11,
        paddingLeft: 15,
        color: theme.colors.secondary,
    },
    loading: {
        height: height,
        width: width,
        backgroundColor: 'white',
        flex: 1,
        paddingTop: 100,
        alignItems: 'center'
    }
})