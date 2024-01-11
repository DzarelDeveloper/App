"use strict";
require('dotenv').config();

const nodemailer = require('nodemailer');
const Token = require('../models/token.model');
const handlebars = require("handlebars");
const fs = require('fs')
const { ADMIN_EMAIL, PASSW_EMAIL, VERIFICATION_URL } = process.env;
//Imports from moleculer
const { MoleculerClientError } = require('moleculer').Errors;
module.exports = {

	name: "emails",

	actions: {
		/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
		 * Acción para el envío del correo de confirmación de cuenta   *
		 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
		send_email(ctx) {

			const source = fs.readFileSync('./public/verify.html', 'utf-8').toString();
			const template = handlebars.compile(source);
			const replacements = {
				username: ctx.params.username,
				token: ctx.params.token	
			};
			const htmlToSend = template(replacements);
			
			const transporter = nodemailer.createTransport({
				service: 'gmail',
				auth: {
					user: ADMIN_EMAIL,
					pass: PASSW_EMAIL
				}
			});
			
			const mailOptions = {

				from: ADMIN_EMAIL,
				to: ctx.params.email,
				subject: 'Account Verification Token',
				html: htmlToSend
				//text: 'Hola,\n\n' + 'Por favor verifica tu cuenta dando clic al siguente enlace:\n' + VERIFICATION_URL + ctx.params.token	 
			};
			
			transporter.sendMail(mailOptions, (error, info) => {

				if(error) { 
					console.log('Ocurrió un error, corrija el correo ingresado') 
				} 
				else { 
					console.log('Email enviado a: ', info.accepted) 
				}
				
			});
		},

		/* * * * * * * * * * * * * * * * * * * * * * * * *  * * * *
		 * Acción para confirmar correo y verificar al usuario	  *
		 * * * * * * * * * * * * * * * * * * * * * * ** * * * * * */
		email_confirmation: { 

			rest: "GET /confirm/:token",
			async handler(ctx){ 

				const token = await Token.findOne({ token: ctx.params.token });

				if(token) {
					
					const confirm = await ctx.call("users.verify_user", token._userId )

					if (confirm) return confirm;					
					else console.log('Falta esta opción'); //falta terminar
				}else{
					throw new MoleculerClientError(
                        'Incorrect token',
                        422,
                        '', [{ message: 'Incorrect token' }]
                    )
				}
				 
			}

		},

		/* * * * * * * * * * * * * * * * * * * * * * * * *
		 * Obtener todos los token (Solo para pruebas)	 *
		 * * * * * * * * * * * * * * * * * * * * * * * * */
		token: { 

			rest: "GET /token",
			async handler(){ 
				const exist = await Token.find();
				
				return exist
			}

		},
	}	
}