'use strict'

//Imports from moleculer
const { MoleculerClientError } = require('moleculer').Errors;

//DbServices and Mongo
//In this case i will use "db-moleculer" until we configure the db.mixin

const DbService = require('moleculer-db');
const Contact = require('../models/contact.model');
const User = require('../models/user.model');
const MongooseAdapter = require('moleculer-db-adapter-mongoose');
const mongoose = require('mongoose');
const WhatsAppWeb = require('baileys') 
const client = new WhatsAppWeb() 

module.exports = {

    name: 'contacts',

    mixin: [DbService],

    adapter: new MongooseAdapter(
        'mongodb://localhost/henrybank', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    ),

    model: Contact,

    settings: {
        rest: '/contacts',
        fields: [
            'userId',
            'contactList'
        ],
        //Validators
    },

    actions: {
        getContacts: {
            //Return all contacts from our contact list
            rest: 'GET /',
            async handler(ctx) {
                //We need the front-end to send us the id of the user who is currently logged in
                const { _id } = ctx.params;
                const response = await User.findById(_id).populate('contacts')

                if (!response) {
                    throw new MoleculerClientError(
                        'the user was not found!',
                        422,
                        '', [{ message: 'the user was not found!' }]
                    )
                }
                const aux = response.contacts
                let contactList = []
                //Take the contact accounts
                for (let i = 0; i < aux.length; i ++) {
                    const user = await User.findOne({email : aux[i].email}).populate('accounts');
                    const userObj = {
                        // id : response.contacts[i]._id,
                        username: response.contacts[i].username,
                        email : user.email,
                        name : user.name,
                        phone : user.phone,
                        lastname: user.lastname,
                        accounts : {
                            pesos : user.accounts[0].cvu, 
                            dollars : user.accounts[1].cvu
                        }
                    }
                    contactList.push(userObj)    
                }
                
                return contactList;
            }
        },
        updateUsername: {
            //In our Contact List we only can change the username of our contact
            //We take the email and the username edited from our ctx
            rest: 'PUT /editusername',
            async handler(ctx) {
                const { idUserLoggedIn, email, username } = ctx.params;

                const contact = await Contact.findOneAndUpdate({ email, fromUser: idUserLoggedIn }, { username })
                if (!contact) {
                    throw new MoleculerClientError(
                        'Failed Uptade',
                        422,
                        '', [{ message: 'Failed Uptade!' }]
                    )
                }

                return 'Updated'
            }
        },
        addConcat: {
            //To add a new contact we need first find  if this contact exist in our user db and has an
            //acount with validate in true.
            rest: 'POST /',
            async handler(ctx) {
                const { _id, email } = ctx.params;

                //Find my two users
                const user = await User.findById(_id)
                const user2 = await User.findOne({ email }, { username: true, phone: true, email: true, })

                //handler Error
                if (!user || !user2) {
                    throw new MoleculerClientError(
                        'the user was not found!',
                        422,
                        '', [{ message: 'the user was not found!' }]
                    )
                }

                //Create new contact with the user 2
                const contact = new Contact({
                    username: user2.username,
                    phone: user2.phone,
                    email: user2.email,
                    fromUser: user._id
                })

                //make the relationship
                await contact.save()
                user.contacts.push(contact);
                await user.save();

                return contact;

            }
        },
        addContactByPhone: {
            rest: 'POST /addbyphone',
            async handler(ctx) {
                const { phone, idUserLoggedIn } = ctx.params;

                const userToContact = await User.findOne({ phone }, { username: true, phone: true, email: true, });
                const userLoggedIn = await User.findById(idUserLoggedIn);

                if (!userToContact || !userLoggedIn) {
                    throw new MoleculerClientError(
                        'the user was not found!',
                        422,
                        '', [{ message: 'the user was not found!' }]
                    )
                }

                const contact = new Contact({
                    username: userToContact.username,
                    phone: userToContact.phone,
                    email: userToContact.email,
                    fromUser: userLoggedIn._id
                })


                //make the relationship
                await contact.save()
                userLoggedIn.contacts.push(contact);
                await userLoggedIn.save();

                return contact
            }
        },
        inviteByWhatsapp: {
            //Take the phone number from our context and send a whatsapp message to invite him/her.
            //And send a link to start the registration process
            rest: 'POST /whatsapp',
            async handler(ctx) {
                //ctx trae el phone y el body del mensaje ambos como string
                
                const wspMessage =await client.sendTextMessage(`${ctx.params.phone}@s.whatsapp.net`, ctx.params.body)
                    .then(res=>{return { mensaje: 'Notificación enviada' }})
                    .catch(err=> {return "fallo todo"})

                    return wspMessage;
            }
        },
        deletContact: {
            //Delete a contact from our contactList , but not from our userDatabase.
            //To delete this contact , we need an id from our ctx
            rest: 'DELETE /',
            async handler(ctx) {
                const { email , idUserLoggedIn } = ctx.params;
                const user = await User.findById(idUserLoggedIn)
                await Contact.findOneAndRemove({email})

                //Removing from the contact list of our user logged in
                let contact = user.contacts.indexOf(email)
                if (contact !== -1) user.contacts.splice(contact,1)
                await user.save()
                
                return 'Contact deleted'            
            }
        },
    },

    methods: {
        async fillSeeds() {
            //use this methods to test the contact service
            await User.create({
                username: "Robert",
                name: "Roberto",
                lastname: "Marth",
                phone: '12312312',
                email: 'roberto@roberto.com',
                password: '123123',
            })
            await User.create({
                username: "Jose",
                name: "Manuel",
                lastname: "Marth",
                phone: '123122312',
                email: 'manuel@rasdsa.com',
                password: '1231232',
            })
            await User.create({
                username: "Maria",
                name: "Maria la",
                lastname: "Del Barrio",
                phone: '15152323',
                email: 'maria@maria.com',
                password: '123123',
            })
            return "Users have been created";
        }
    },

    created() {
        mongoose.connect(
                'mongodb://localhost/henrybank', {
                    useNewUrlParser: true,
                    useUnifiedTopology: true
                }
            )
            .then(() => console.log('Contact Service Online'))
            .catch(err => console.log({
                message: 'Error to connect DB',
                error: err
            }));

        client.connect()
            .then(([user, chats, contacts, unread]) => {
                console.log("oh hello " + user.name + " (" + user.id + ")")
                console.log("you have " + unread.length + " unread messages")
                console.log("you have " + chats.length + " chats")
            })
            .catch(err => console.log("unexpected error: " + err))
    },
}