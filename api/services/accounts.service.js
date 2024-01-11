'use strict'

const axios = require('axios');

//Imports from moleculer
const { MoleculerClientError } = require('moleculer').Errors;

//DbServices and Mongo
const DbService = require('moleculer-db');
const Account = require('../models/account.model');
const Transaction = require('../models/transaction.model');
const User = require('../models/user.model');
const MongooseAdapter = require('moleculer-db-adapter-mongoose');
const mongoose = require('mongoose');

module.exports = {

    name: 'accounts',

    mixin: [DbService],

    adapter: new MongooseAdapter(
        'mongodb://localhost/henrybank', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    ),

    model: Account,

    settings: {
        rest: '/accounts',
        fields: [

            ]
            //Validators
    },

    actions: {
        //Acount Actions
        createdAccounts: {
            rest: 'POST /',
            async handler(ctx) {

                const { _id } = ctx.params; //user id
                console.log("id cuenta: ", _id)
                const user = await User.findById(_id)

                //handler Error
                if (!user) {
                    throw new MoleculerClientError(
                        'the user was not found!',
                        422,
                        '', [{ message: 'the user was not found!' }]
                    )
                }

                //Create 2 account for this user. The first in "Pesos a.k.a. accountOne" , 
                //and the second in 'Dolares a.k.a. accountTwo'
                //In my userSeeds i dont have dni, and i go to change it for phone
                const pesosCVU = await this.generateCVU(user.dni)
                const dolaresCVU = await this.generateCVU(user.dni)
                const accountOne = await this.generateAccount(pesosCVU, 'Pesos', user._id)
                const accountTwo = await this.generateAccount(dolaresCVU, 'Dolares', user._id);

                await accountOne.save();
                await accountTwo.save();
                user.accounts.push(accountOne, accountTwo)
                await user.save()

                return ({ 'CuentaEnPesos': accountOne, 'CuentaEnDolares': accountTwo })

            }
        },
        getAccounts: {
            rest: 'GET /',
            async handler(ctx) {
                const { _id } = ctx.params; //user id
                const accounts = await Account.find({ _userId: _id })

                if (!accounts) {
                    throw new MoleculerClientError(
                        'there are not accounts for this user!',
                        422,
                        '', [{ message: 'there are not accounts for this user!' }]
                    )
                }

                return accounts;
            }
        },
        deleteAccount: {
            rest: 'DELETE /',
            async handler(ctx) {

            }
        },
        getDollarRealPrice: {
            rest: 'GET /dollar',
            async handler(ctx) {
                const dollar = await this.getDollarPrice();
                return dollar
            }
        },
        //Transaction Actions
        getTransactions: {
            rest: 'GET /transactions',
            async handler(ctx) {
                const { cvu } = ctx.params; //account id
                const account = await Account.findOne({ cvu })

                if (!account) {
                    throw new MoleculerClientError(
                        'there are not accounts for this user!',
                        422,
                        '', [{ message: 'there are not accounts for this user!' }]
                    )
                }


                let auxArray = [];
                let auxObj = {};
                let auxType = '';

                const transactions = await Transaction.find({
                    $or: [
                        { fromAccount: account._id },
                        { toAccount: account._id }
                    ]
                }).populate('fromAccount').populate('toAccount')

                for (var i = 0; i < transactions.length; i++) {
                    if (cvu === transactions[i].toAccount[0].cvu) {
                        auxType = 'In'
                    } else {
                        auxType = 'Out'
                    }
                    auxObj = {
                        _id: transactions[i]._id,
                        fromAccount: transactions[i].fromAccount[0].cvu,
                        toAccount: transactions[i].toAccount[0].cvu,
                        amount: transactions[i].amount,
                        by: transactions[i].by,
                        date: transactions[i].createdAt,
                        description: transactions[i].description,
                        type: auxType
                    }
                    auxArray.push(auxObj)
                }

                return auxArray;
            }
        },
        getTransactionsById: {
            rest: 'GET /transactionbyid',
            async handler(ctx) {
                const { _id } = ctx.params; //transaction id

                //Search Methods
                const transaction = await Transaction.findOne({ _id }).populate('fromAccount').populate('toAccount')
                const fromAccount = await Account.findOne({ cvu: transaction.fromAccount[0].cvu }).populate('_userId')
                const toAccount = await Account.findOne({ cvu: transaction.toAccount[0].cvu }).populate('_userId')

                //handle error
                if (!transaction) {
                    throw new MoleculerClientError(
                        'there are not transactions for this accounts!',
                        422,
                        '', [{ message: 'there are not transactions for this accounts!' }]
                    )
                }

                //this is to understad the type of the transaction
                let by = '';
                if (transaction.by === 'QR' || transaction.by === 'Credit Card' || transaction.by === 'Debit Card') {
                    by = 'Recharge'
                } else {
                    by = 'Transfer'
                }

                //These 3 objects are created to order in a readable way the answer of this route
                const fromUserObj = {
                    name: fromAccount._userId[0].name,
                    email: fromAccount._userId[0].email
                }
                const toUserObj = {
                    name: toAccount._userId[0].name,
                    email: toAccount._userId[0].email
                }
                const transObj = {
                    id: transaction._id,
                    from: {
                        account: transaction.fromAccount[0].cvu,
                        user: fromUserObj
                    },
                    to: {
                        account: transaction.toAccount[0].cvu,
                        user: toUserObj
                    },
                    date: transaction.createdAt,
                    description: transaction.description,
                    amount: transaction.amount,
                    by: transaction.by,
                    type: by
                }

                return transObj;
            }
        },
        rechargeByQR: {
            rest: 'POST /rechargebyqr',
            async handler(ctx) {
                const { amount, cvu } = ctx.params;
                const recharge = await this.recharge(amount, cvu, 'QR');

                return recharge && recharge;
            }
        },
        rechargeByCard: {
            rest: 'POST /rechargebycard',
            async handler(ctx) {
                const { amount, cvu } = ctx.params;
                const recharge = await this.recharge(amount, cvu, 'Credit Card');

                return recharge && recharge;
            }
        },
        transfer: {
            rest: 'POST /transfer',
            async handler(ctx) {
                const { from, to, amount, description } = ctx.params;
                const fromAccount = await Account.findOne({ cvu: from })
                const toAccount = await Account.findOne({ cvu: to })
                let transferType = 'Transfer';
                let amountB = 0;

                //To check if this transfer from one account in 'pesos(Argentina currency)'
                //to another in 'dollars' or vice versa
                if (fromAccount.type === 'Pesos' && toAccount.type === 'Dolares') {
                    amountB = await this.dollarConversion(amount, 'Purchase')
                    transferType = 'Dollar Purchase'
                } else if (fromAccount.type === 'Dolares' && toAccount.type === 'Pesos') {
                    amountB = await this.dollarConversion(amount, 'Sale')
                    transferType = 'Dollar Sales'
                }

                const fromUser = fromAccount._userId[0].toString().trim()
                const toUser = toAccount._userId[0].toString().trim()

                if (fromAccount.balance - parseFloat(amount) >= 0) {
                    if (transferType === 'Dollar Purchase') {
                        fromAccount.balance = fromAccount.balance - parseFloat(amount);
                        toAccount.balance += parseFloat(amountB);
                        if (fromUser !== toUser) transferType = 'Dollar Transfer';
                    } else if (transferType === 'Dollar Sales') {
                        fromAccount.balance = fromAccount.balance - parseFloat(amount);
                        toAccount.balance += parseFloat(amountB);
                        if (fromUser !== toUser) transferType = 'Dollar Transfer';
                    } else {
                        fromAccount.balance = fromAccount.balance - parseFloat(amount);
                        toAccount.balance += parseFloat(amount);
                    }



                    const transaction = await this.generateTransaction(
                        transferType,
                        fromAccount._id,
                        toAccount._id,
                        description,
                        parseFloat(amount),
                    );

                    await transaction.save()

                    fromAccount.transactions.push(transaction);
                    toAccount.transactions.push(transaction);

                    await fromAccount.save()
                    await toAccount.save()
                    const response = {
                        _id:fromAccount._id,
                        fromAccountBalance: fromAccount.balance,
                        fromAccountCVU: fromAccount.cvu,
                        fromUser,
                        toAccountBalance: toAccount.balance,
                        toAccountCVU: toAccount.cvu,
                        toUser,
                        transferType
                    }
                    return response;
                } else {
                    return 'You do not have enough balance'
                };
            }
        },

    },

    methods: {
        generateCVU(dni) {
            const rdm = () => parseInt(Math.random() * 10).toString();
            const x = dni.toString();
            const last4 = x.substring(x.length - 4, x.length)
            const cvu = '00000000' + rdm() + rdm() + rdm() + rdm() + rdm() + rdm() + rdm() + rdm() + rdm() + rdm() + last4;
            return cvu
        },
        generateAccount(cvu, type, _userId) {
            const account = new Account({
                cvu,
                type,
                _userId
            })
            if (!account) {
                throw new MoleculerClientError(
                    'there are not accounts for this user!',
                    422,
                    '', [{ message: 'there are not accounts for this user!' }]
                )
            }
            return account
        },
        generateTransaction(by, fromAccount, toAccount, description, amount) {
            const transaction = new Transaction({
                by,
                fromAccount,
                toAccount,
                description,
                amount
            })
            if (!transaction) {
                throw new MoleculerClientError(
                    'there are not accounts for this user!',
                    422,
                    '', [{ message: 'there are not accounts for this user!' }]
                )
            }
            return transaction
        },
        async getDollarPrice() {
            const response = await axios.get('https://www.dolarsi.com/api/api.php?type=valoresprincipales')
            const data = {
                purchase: (response.data[0].casa.compra).replace(',', '.'),
                sale: (response.data[0].casa.venta).replace(',', '.'),
                name: response.data[0].casa.nombre
            }
            return data
        },
        async dollarConversion(amount, typeOfConversion) {
            if (typeOfConversion === 'Sale') {
                //Sale Conversion taking the price in 'purchase'
                const dollar = await this.getDollarPrice()
                const response = amount * parseFloat(dollar.purchase)
                return response
            } else if (typeOfConversion === 'Purchase') {
                //Purchase Conversion taking the price in 'sale'
                const dollar = await this.getDollarPrice()
                const response = amount / parseFloat(dollar.sale)
                return response
            }

        },
        async recharge(amount, cvu, type) {
            const account = await Account.findOne({ cvu })

            const transaction = await this.generateTransaction(
                type,
                account._id,
                account._id,
                'Recharge',
                parseInt(amount, 10)
            );
            transaction.save()
            account.transactions.push(transaction)
            const balance = account.balance + parseInt(amount, 10)
            account.balance = balance;
            account.save();

            return account;
        }
    },

    created() {
        mongoose.connect(
                'mongodb://localhost/henrybank', {
                    useNewUrlParser: true,
                    useUnifiedTopology: true
                }
            )
            .then(() => console.log('Account Service Online'))
            .catch(err => console.log({
                message: 'Error to connect DB',
                error: err
            }));
    },

}