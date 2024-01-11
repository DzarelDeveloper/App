import { GET_ACCOUNT, RECHARGE_QR, RECHARGE_CARD, TRANSFER_MONEY, GET_TRANSACTIONS,
   GET_TRANSACTIONS_DOLAR, GET_TRANSACTIONS_PESOS, GET_TRANSACTIONS_PESOS_GRAP, GET_TRANSACTIONS_DOLLARS,
   BALANCE_PESOS_EGRESOS,
   BALANCE_PESOS_INGRESOS } from "../constans/constans";

const initialState = {
  users: [],
  userDetail: [],
  err: [],
  message: "",
  userUp: {},
  account: [],
  transactions: [],
  transactionsDolar: [],
  transactionsPesos: [],
  dollarTransactions: [],
  pesosTransactions: [],
  ingresoPesos:"",
  egresosPesos:"",

}

const acoountReducers = (state = initialState, action) => {
	// console.log(action);

  switch (action.type) {
    case GET_ACCOUNT:
      return { ...state, account: action.data };
    case RECHARGE_QR:
      let obj = action.data
      let acc = state.account.find(x => x._id == obj._id)
      if (acc === undefined) return { ...state };
      let ind = state.account.indexOf(acc)
      let accountNew = [...state.account]
      accountNew[ind].balance = obj.balance
      return { ...state, account: accountNew };
    case RECHARGE_CARD:
      let objT = action.data
      let accT = state.account.find(x => x._id == objT._id)
      if (accT === undefined) return { ...state };
      let indT = state.account.indexOf(accT)
      let accountNewT = [...state.account]
      accountNewT[indT].balance = objT.balance
      return { ...state, account: accountNewT };
    case TRANSFER_MONEY:
      let objC = action.data
      let accC = state.account.find(x => x._id == objC._id)
      if (accC === undefined) return { ...state };
      let indC = state.account.indexOf(accC)
      let accountNewC = [...state.account]
      accountNewC[indC].balance = objC.fromAccountBalance
      return { ...state, account: accountNewC };
    case GET_TRANSACTIONS:
      return { ...state, transactions: action.data };
    case GET_TRANSACTIONS_DOLAR:
      return { ...state, transactionsDolar: action.data };
    case GET_TRANSACTIONS_PESOS_GRAP:
      return { ...state, transactionsPesos: action.data };
    case GET_TRANSACTIONS_PESOS:
        return { ...state, pesosTransactions: action.data };
    case GET_TRANSACTIONS_DOLLARS:
        return { ...state, dollarTransactions: action.data };
    case GET_TRANSACTIONS_DOLLARS:
        return { ...state, dollarTransactions: action.data };
    case BALANCE_PESOS_EGRESOS:
        return { ...state, ingresoPesos: action.payload };
    case BALANCE_PESOS_INGRESOS:
        return { ...state, egresosPesos: action.payload };
    default:
      return state;
  }
	
};

export default acoountReducers;
