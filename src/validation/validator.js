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

const isValidPassword = function (value) {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,15}$/
    return regex.test(value)
};

const isvalidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
};
const isValidISBN = function (value) {
    const Regex = /^(?:ISBN(?:-13)?:? )?(?=[0-9]{13}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)97[89][- ]?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9]$/
    return Regex.test(value);
}

const isValidPinCode = function (pincode) {
    const Regex = /^[1-9]{1}[0-9]{5}$/   //055555     55555
    return Regex.test(pincode);
}
const isValidDate = function (date) {
    const Regex = /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/

    return Regex.test(date)
}
const isValidMixed = function (value) {
    //  const regex = /(?<![0-9]\S{0,100})[^a-zA-Z](?!\S{0,100}[0-9])|(?<=[0-9]\S{0,100})[^a-zA-Z0-9-](?=\S{0,100}[0-9])/
    const regex = /^([a-zA-Z]+|[a-zA-Z]+\s[a-zA-Z]+)$/

    return regex.test(value)
}
const isValidRating = function (rating) {
    const Regex = /^([1-5]{1})$/

    return Regex.test(rating);
}
const isValidBody = function (value) {
    if (typeof value === "undefined" || value === null)
        return false;
}

const isValidImage = function (value) {
    //  const Regex = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/
    // const Regex = "(.*/)*.+\\.(png|jpg|gif|bmp|jpeg|PNG|JPG|GIF|BMP|JPEG)$"
    // const Regex = /(\/*\.(?:png|gif|webp|jpeg|jpg))/
    const Regex = /.*\.(gif|jpe?g|bmp|png|jpg)$/
    return Regex.test(value);
}
module.exports = { isValid, isValidEmail, isValidPhone, isValidName, isValidPassword, isvalidObjectId, isValidISBN, isValidPinCode, isValidDate, isValidMixed, isValidRating, isValidBody,isValidImage};