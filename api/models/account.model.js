"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;


let AccountSchema = new Schema(
	{
		cvu: {
			type: String,
			unique : true,
			required : true
		},
		balance: {
			type: Number,
			default : 0
		},
		type: {
			type : String,
			enum : ['Pesos','Dolares'],
			required : true
		},
		transactions: [
            {
                type : Schema.Types.ObjectId, 
                ref : 'Transaction'
            }
        ],
		_userId: [
            {
				type : Schema.Types.ObjectId,
				required : true,
                ref : 'User',
            }
        ],
	},
	{
		timestamps: true,
	}
);


module.exports = mongoose.model("Account", AccountSchema);