"use strict";
require("dotenv").config();

const DbService = require("moleculer-db");
const mongoose = require("mongoose");
const User = require("../models/user.model");
const Token = require("../models/token.model");
const bcrypt = require("bcrypt");
const { MoleculerClientError } = require("moleculer").Errors;
const { DATABASE } = process.env;

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Definición de los tipos de errores CRUD  usuarios	     *
 * * * * ** * * * * * * * * * * * * * * * * * * * * * * * */
const usernameError = new MoleculerClientError(
	"username already exists!",
	422,
	"Username error!"
);
const emailError = new MoleculerClientError(
	"email already exists!",
	422,
	"Email error!"
);
const userNotFound = new MoleculerClientError(
	"user does not exist!",
	404,
	"Finding error!"
);

module.exports = {
	name: "users",

	/* * * * * *
	 * Mixins  *
	 * * * * * */
	mixin: [DbService],

	/* * * * * *
	 * Model   *
	 * * * * * */
	model: User,

	/* * * * * * *
	 * Settings  *
	 * * * * * * */
	settings: {
		// Campos disponibles en la respuesta (**No está funcionando porque no se usa adapter)
		fields: ["_id", "username", "email"],
		// Validador para las acciones `create` & `insert`.
		entityValidator: {
			name: "string|min:3",
		},
	},

	actions: {
		/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
		 * Acción/ruta para la creación de un nuevo usuario			   *
		 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
		create_user: {
			rest: "POST /create",
			async handler(ctx) {
				const entity = ctx.params;
				console.log(entity);
				/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
				 * Validación de username o email (creación de usuario único)     	     *
				 * * * * *  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
				if (entity.username) {
					const found = await User.findOne({
						$or: [
							{ username: entity.username },
							{ email: entity.email },
						],
					});

					if (found) {
						if (found.username === entity.username.toLowerCase()) {
							return Promise.reject(usernameError);
						} else if (found.email === entity.email.toLowerCase()) {
							return Promise.reject(emailError);
						}
					}
				}

				/* * * * * * * * * * * * * * * * * *
				 * Encryptación de contraseña      *
				 * * * * * * * * * * * * * * * * * */
				entity.password = bcrypt.hashSync(entity.password, 10);

				/* * * * * * * * * * * * * *
				 * Función generadora 	   *
				 * * * * * * * * * * * * * */
				const rdm = () => parseInt(Math.random() * 10).toString();

				// /* * * * * * * * * * * * *
				//  * Generación de CVU     *
				//  * * * * * * * * * * * * */
				//  const x = entity.dni.toString();
				//  const last4 = x.substring(x.length-4, x.length)

				//  entity.cvu = '00000000' + rdm() + rdm() + rdm() + rdm() + rdm() + rdm() + rdm() + rdm() + rdm() + rdm() + last4;

				/*  * * * * * * * * * * * * * * * * *
				 * Creación del nuevo usuario		*
				 * * * * *  * * * * * * * *  * * * * */
				const created = await User.create(entity);

				//Dar de alta las cuentas para este usario : llamando a los acciones de
				//accounts.service.js

				/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
				 * Generación de token para enviar confirmación al mail del nuevo usuario *
				 * * * * * * * * * * * * *  * * * * * * * * * * * * * * * * * * * * * * * */
				const tokenGen = () => rdm() + rdm() + rdm() + rdm() + rdm();

				const token = await Token.create({
					_userId: created._id,
					token: tokenGen(),
				});

				console.log(token);

				/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
				 * Llamado al servicio de emails para hacer verificación de la cuenta *
				 * * * * * * * * * * * * *  * * * * * * * * * * * * * * * * * * * * * */
				await ctx.call("emails.send_email", {
					email: created.email,
					username: created.username,
					token: token.token,
				});

				return created;
			},
		},

		/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
		 * Acción/ruta para la obtención de todos los usuarios		   *
		 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
		get_all_users: {
			rest: "GET /all",
			async handler() {
				const users = await User.find();
				return users;
			},
		},

		/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
		 * Acción/ruta para la obtención de un usuario por email	   *
		 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
		get_user_by_email: {
			rest: "GET /by-email",
			async handler(ctx) {
				const user = ctx.params;
				const found = await User.findOne({ email: user.email });

				if (found) return found;
				return Promise.reject(userNotFound);
			},
		},

		/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
		 * Acción/ruta para la obtención de un usuario por username	   *
		 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
		get_user_by_username: {
			rest: "GET /by-username",
			async handler(ctx) {
				const user = ctx.params;
				const found = await User.findOne({ username: user.username });

				if (found) return found;
				return Promise.reject(userNotFound);
			},
		},

		/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
		 * Acción/ruta para la obtención de un usuario por id   *
		 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
		get_user_by_id: {
			rest: "GET /by-id",
			async handler(ctx) {
				const user = ctx.params;

				if (mongoose.Types.ObjectId.isValid(user._id)) {
					const found = await User.findById({ _id: user._id }).populate('accounts');

					if (found) return found;
				}

				return Promise.reject(userNotFound);
			},
		},

		/* * * * * * * * * * * * * * * * * * * * * * * * * * * *
		 * Acción/ruta para eliminación de un usuario 		   *
		 * * * * * * * * * * * * * * * * * * * * * * * * * * * */
		remove_user: {
			rest: "DELETE /remove",
			async handler(ctx) {
				const user = ctx.params;

				if (mongoose.Types.ObjectId.isValid(user._id)) {
					const removed = await User.findByIdAndRemove({
						_id: user._id,
					});

					if (removed) return removed;
				}

				return Promise.reject(userNotFound);
			},
		},

		/* * * * * * * * * * * * * * * * * * * * * * * * * * * *
		 * Acción/ruta para actualizar el avatar de un usuario *
		 * * * * * * * * * * * * * * * * * * * * * * * * * * * */
		update_avatar: {
			rest: "PUT /updateAvatar",
			async handler(ctx) {
				const {avatar,_id} = ctx.params;

				if (mongoose.Types.ObjectId.isValid(_id)) {
					const updatedAvatar = await User.findByIdAndUpdate(
						{ _id },
						{avatar}
					);

					if (updatedAvatar) return updatedAvatar;
				}

				return Promise.reject(userNotFound);
			},
		},

		/* * * * * * * * * * * * * * * * * * * * * * * * * * * *
		 * Acción/ruta para actualización de un usuario 	   *
		 * * * * * * * * * * * * * * * * * * * * * * * * * * * */
		update_user: {
			rest: "PUT /update",
			async handler(ctx) {
				const { _id, name, lastname, phone, address, dob, province, city } = ctx.params;
				
				if (mongoose.Types.ObjectId.isValid(_id)) {
					await User.findByIdAndUpdate(
						{ _id },
						{ name, lastname, phone, address, dob, province, city }
					);

					const updated = await User.findById({ _id });
					/* * * * * * * * * * * * * * * * * * * * * * * * * *
					 *   Crear cuentas en pesos y en dolares para el usuario  *
					 * * * * * * * * * * * * * * * * * * * * * * * * * */
					console.log(_id);
					await ctx.call("accounts.createdAccounts", updated._id);

					return updated;
				}

				return Promise.reject(userNotFound);
			},
		},

		/* * * * * * * * * * * * * * * * * * * * * * * * * *
		 * Acción/ruta para verificación de un usuario 	   *
		 * * * * * * * * * * * * * * * * * * * * * * * * * */
		verify_user: {
			async handler(ctx) {
				const { _id } = ctx.params;

				if (mongoose.Types.ObjectId.isValid(_id)) {
					await User.findByIdAndUpdate({ _id }, { verified: true });
					const verified = await User.findById({ _id });

					return {
						username: verified.username,
						email: verified.email,
						verified: verified.verified,
						_id: verified._id,
					};
				}

				return Promise.reject(userNotFound);
			},
		},
	},

	started() {
		/* * * * * * * * * * * * * * * * * * * *
		 * Conexión a la base de datos 		   *
		 * * * * * * * * * * * * * * * * * * * */
		mongoose
			.connect(DATABASE, {
				useCreateIndex: true,
				useNewUrlParser: true,
				useFindAndModify: true,
				useUnifiedTopology: true,
			})
			.then(() => {
				console.log("Users service connected to DB");
			})
			.catch((error) => {
				console.error("Users service couldn't connect to DB");
			});
	},
};
