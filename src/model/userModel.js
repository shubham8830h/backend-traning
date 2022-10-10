const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    fname: {
        type: String,
        require: true
    },
    lname: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    profileImage: {
        type: String,
        require: true
    },
    phone: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
        minLen: 8,
        maxLen: 15
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
}, { timestamps: true });


module.exports = mongoose.model('userList', userSchema)