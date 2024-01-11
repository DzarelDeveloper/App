"use strict";
require("dotenv").config();

const DbService = require("moleculer-db");
const mongoose = require("mongoose");
const Card = require("../models/card.model");
const { MoleculerClientError } = require("moleculer").Errors;
const { DATABASE } = process.env;

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Definición de los tipos de errores CRUD  tarjetas     *
 * * * * ** * * * * * * * * * * * * * * * * * * * * * * * */
const cardError = new MoleculerClientError(
	"card already exists!",
	422,
	"Card error!"
);
const cardNotFound = new MoleculerClientError(
	"card does not exist!",
	404,
	"Finding error!"
);

module.exports = {
	name: "cards",

	/* * * * * *
	 * Mixins  *
	 * * * * * */
	mixin: [DbService],

	/* * * * * *
	 * Model   *
	 * * * * * */
	model: Card,

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
		 * Acción/ruta para la creación de una nueva tarjeta		   *
		 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
		create_card: {
			rest: "POST /create",
			async handler(ctx) {
                const entity = ctx.params;
                
                /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
				 * Validación de tarjeta (creación de tarjeta única)     	     *
				 * * * * *  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
                
                if (entity.cardNumber) {
                    
                    
                    const found = await Card.findOne({

                        cardNumber: entity.cardNumber

                    });

					if (found) {
                       
						if (found.cardNumber === entity.cardNumber) {
                             
							return Promise.reject(cardError);
						} 
					}
                }


                /*  * * * * * * * * * * * * * * * * *
				 * Creación de la nueva tarjeta		*
				 * * * * *  * * * * * * * *  * * * * */

                const created = await Card.create(entity);


                return created;
                

            }
		},

		/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
		 * Acción/ruta para la obtención de todos las tarjetas		   *
		 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
		get_all_cards: {
			rest: "GET /all",
			async handler(ctx) {
                const userId=ctx.params._userId.toString();
                //console.log(userId)
				const cards = await Card.find({
                    _userId: userId
                });
				return cards;
			},
		},

		/* * * * * * * * * * * * * * * * * * * * * * * * * * * *
		 * Acción/ruta para eliminación de una tarjeta 		   *
		 * * * * * * * * * * * * * * * * * * * * * * * * * * * */
		remove_card: {
			rest: "DELETE /remove",
			async handler(ctx) {
				const card = ctx.params;

				if (mongoose.Types.ObjectId.isValid(card._id)) {
					const removed = await Card.findByIdAndRemove({
						_id: card._id,
					});

					if (removed) return removed;
				}

				return Promise.reject(cardNotFound);
			},
		},

		/* * * * * * * * * * * * * * * * * * * * * * * * * * * *
		 * Acción/ruta para actualización de una tarjeta 	   *
		 * * * * * * * * * * * * * * * * * * * * * * * * * * * */

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
				console.log("Cards service connected to DB");
			})
			.catch((error) => {
				console.error("Cards service couldn't connect to DB");
			});
	},
};