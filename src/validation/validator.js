const { mongoose } = require("mongoose");


const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length > 0) return true;
    return false;
};

const isValidEmail = function (email) {
    const emailRegex = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/
    ///^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/
    return emailRegex.test(email);
};

const isValidPhone = function (number) {
    const mobileRegex = /^[5-9]{1}[0-9]{9}$/
    return mobileRegex.test(number);
}

const isValidName = function (value) {
     const regex = /^[a-zA-Z]+([\s][a-zA-Z]+)*$/
    return regex.test(value)
}
const isValidproduct = function (value) {
   
    const regex = /^[a-zA-Z]+([\s][a-zA-Z]+)*$/
    // /^[A-Za-z\s.\(\)0-9]$/
    return regex.test(value)
}

const isValidPassword = function (value) {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,15}$/
    return regex.test(value)
};

const isvalidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
};

const isValidPinCode = function (pincode) {
    const Regex = /^[1-9]{1}[0-9]{5}$/   //    55555
    return Regex.test(pincode);
}

const isValidMixed = function (value) {
    //  const regex = /(?<![0-9]\S{0,100})[^a-zA-Z](?!\S{0,100}[0-9])|(?<=[0-9]\S{0,100})[^a-zA-Z0-9-](?=\S{0,100}[0-9])/
    // const regex = /^([a-zA-Z]+|[a-zA-Z]+\s[a-zA-Z]+)$/
    const regex = /^[#.0-9a-zA-Z\s,-]+$/

    return regex.test(value)
}
const isValidNumber = function (value) {
    // const Regex = /^([1-5]{1})$/
    const Regex = /[0-9][0-9.]*[0-9]+$/

    return Regex.test(value);
}
const isValidBody = function (value) {
    if (Object.keys(value).length == 0)
        return false;
}

const isValidImage = function (value) {
     const Regex = /image\/png|image\/jpeg|image\/jpg/
    // const Regex = (/^.*\.(jpg|JPG|gif|GIF|webp|tiff?|bmp|png|PNG|pdf|jpeg|JPEG)$/)
    return Regex.test(value);
}
const isValidPrice = function (value) {
    const Regex = /^[1-9][0-9]{2,5}\.[0-9]{2}|^[1-9][0-9]{2,5}$/
    return Regex.test(value)
}




module.exports = { isValid, isValidEmail, isValidPhone, isValidName, isValidPassword, isvalidObjectId, isValidPinCode, isValidMixed, isValidNumber, isValidBody,isValidImage,isValidPrice,isValidproduct}