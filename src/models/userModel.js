const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
      enum: ["Mr", "Mrs", "Miss"],
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: [8, "Must be at least 8"],
      max: 15,
    },
    address: {
      street: { type: String },
      city: { type: String },
      pincode: { type: String },
    },
  },{ timestamps: true });


  
module.exports = mongoose.model("User", userSchema);