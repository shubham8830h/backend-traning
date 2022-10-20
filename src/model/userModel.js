const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    fname: {
        type: String,
        require: true,
        trim:true
    },
    lname: {
        type: String,
        require: true,
        trim:true
    },
    email: {
        type: String,
        require: true,
        unique: true,
        trim:true

    },
    profileImage: {
        type: String,
        require: true,
        trim:true
    },
    phone: {
        type: String,
        require: true,
        unique: true,
        trim:true
    },
    password: {
        type: String,
        require: true,
        minLen: 8,
        maxLen: 15,
        trim:true
    },
    address: {
        shipping: {
            street: {
                type: String,
                require: true
        
            },
            city: {
                type: String,
                require: true
            },
            pincode: {
                type: Number,
                require: true
            },
        },
        billing: {
            street: {
                type: String,
                require: true
            },
            city: {
                type: String,
                require: true
            },
            pincode: {
                type: Number,
                require: true
            }
        }
    }
}, { timestamps: true }); // created and updated 


module.exports = mongoose.model('userList', userSchema)