"use strict";

const mongoose = require("mongoose");
const { Schema } = mongoose;

const cardSchema = new Schema({
    _userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        ref: 'User' 
    },
    cardName: {
        type:String,
        required: true
    },
    cardNumber: { 
        type: Number, 
        required: true 
    },
    cardExpire: {
        type: String,
        required: true
    },

});

module.exports = mongoose.model("Card", cardSchema);