"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let ContactSchema = new Schema(
	{
		username: {
			type: String,
			unique: true,
		},
		phone : {
			type: String,
		},
		email : {
			type : String,
			unique : true
		},
		fromUser : {
			type : Schema.Types.ObjectId,
			ref: 'User'
		}
    },	
	{
		timestamps: false,
	}
);

// Add full-text search index
ContactSchema.index({
	//"$**": "text"
	username : "text",
	phone : "text",
	email : "text",
});

module.exports = mongoose.model("Contact", ContactSchema);

