'use strict'

//Imports from moleculer
const { MoleculerClientError } = require('moleculer').Errors;

//Foreign Imports
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer')

//DbServices and Mongo
//In this casei will use "db-moleculer" until we configure the db.mixin
//const DbService = require('../mixins/db.mixin');
const DbService = require('moleculer-db');
const User = require('../models/user.model');
const MongooseAdapter = require('moleculer-db-adapter-mongoose');
const mongoose = require('mongoose');

module.exports = {
    name: 'auth',
    mixins: [DbService],
    //check if i need the adapter to connect or only with the mixins
    adapter: new MongooseAdapter(
        'mongodb://localhost/henrybank',
        {
            useNewUrlParser : true,
            useUnifiedTopology : true
        }
    ),
    //Model
    model: User,
    settings: {
        rest: '/auth',
        //Secret for JWT
        JWT_SECRET: process.env.JWT_SECRET,
        fields: [
            '_id',
            'username',
            'email',
            'name',
            'lastname',
            'dni',
            'dob',
            'phone',
            'address',
            'password',
        ],
        //Validators

    },
    //Actions
    actions: {
        //Login
        login: {
            rest: 'POST /auth/login',
            async handler(ctx) {
                //Take the email & password from body,resolve if i take from params or params.user
                const { email, password } = ctx.params;
                const user = await User.findOne({ email });

                if(!user){
                    throw new MoleculerClientError(
                        'Email or password is invalid!', 
                        422 , 
                        '' ,
                        [{ message : 'error when entering an email or password' }]
                    )
                }

                //check password
                const comparePassword = await bcrypt.compare(password , user.password);

                if(!comparePassword){
                    throw new MoleculerClientError(
                        'Wrong password!' ,
                        422,
                        '',
                        [{ message: 'is not found'}]
                    )
                }

                const response = await this.generateJWT(user);

                if(!response) {
                    throw new MoleculerClientError(
                        'Error to generate a Token for this user',
                        422,
                        '',
                        [{ message: 'error to generate a token'}]
                    )
                }

                return response;

            }
        }      
    },
    //Methods
    methods: {
        //method to genererate a jwt from our user
        generateJWT(user){
            return jwt.sign({
                id: user._id,
                auth: user.auth,
                username: user.username,
                name: user.name,
                lastname: user.lastname,
                email: user.email,
                dob: user.dob,
                dni: user.dni,
                phone: user.phone,
                address: user.address,
            },this.settings.JWT_SECRET);
        },
        
    },
    
    created(){
        mongoose.connect(
            'mongodb://localhost/henrybank',
            {
                useNewUrlParser: true,
                useUnifiedTopology:true
            }
        )
        .then(() => console.log('Auth Service Online'))
        .catch(err => console.log({
            message: 'Error to connect DB',
            error: err
        }));
    },
}