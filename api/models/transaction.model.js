"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;


let TransactionSchema = new Schema(
	{
		by: {
			type : String,
			enum : ['Debit Card','Credit Card','QR','Transfer','Dollar Purchase', 'Dollar Sales','Dollar Transfer'],
			required : true
		},
		fromAccount: [
            {
                type : Schema.Types.ObjectId, 
                ref : 'Account'
            }
        ],
		toAccount: [
            {
                type : Schema.Types.ObjectId, 
                ref : 'Account'
            }
        ],
		description: {
            type : String,
            required : true
        },
		amount: {
            type : Number,
            default : 0,
            required : true
        },

	},
	{
		timestamps: true,
	}
);


module.exports = mongoose.model("Transaction", TransactionSchema);