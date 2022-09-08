
const mongoose = require('mongoose');
const validator=require("validator")

const authorSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
        trim:true
    },
    lname: {
        type: String,
        required: true,
        trim:true
    },
    title: {
        type: String,
        required: true,
        enum: ["Mr", "Mrs", "Miss"]
    },
    email: {
        type: String,
        unique: true,
        lowerCase: true,
        required: true,
        validate(value){
            if(!validator.isEmail(value)) {
                throw new Error("Email is invalid");
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength:[8, "Password should be atlest 8 digits"]

    }
}, { timestamps: true })

module.exports = mongoose.model('author', authorSchema)

