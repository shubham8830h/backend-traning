const { mongoose } = require("mongoose");

const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length == 0) return false;
    return true;
};

const isValidEmail = function (email) {
    const emailRegex = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/
   
    ///^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/
    return emailRegex.test(email);
};

const isValidPhone = function (number) {
    const mobileRegex = /^[6-9]{1}[0-9]{9}$/
    return mobileRegex.test(number);
}

const isValidName = function (value) {
    // const regex = /^[a-zA-Z]+([\s][a-zA-Z]+)*$/
    //const regex =  /(?<![0-9]\S{0,100})[^a-zA-Z](?!\S{0,100}[0-9])|(?<=[0-9]\S{0,100})[^a-zA-Z0-9-](?=\S{0,100}[0-9])/
    const regex=/([a-zA-z])+/g
    return regex.test(value)
}
const isValidNames = function (value) {
     const regex = /^[a-zA-Z]+([\s][a-zA-Z]+)*$/
    // const regex =  /(?<![0-9]\S{0,100})[^a-zA-Z](?!\S{0,100}[0-9])|(?<=[0-9]\S{0,100})[^a-zA-Z0-9-](?=\S{0,100}[0-9])/
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
const isValidDate = function (date) {
    const Regex = /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/

    return Regex.test(date)
}
const isValidMixed = function (value) {
   
    const regex = /^[a-zA-Z0-9_.-]*$/
    return regex.test(value)
}
const isValidNumber = function (rating) {
    // const Regex = /^([0-9]{1})$/
    const Regex = /^([1-9])+([0-9])*?$/

    return Regex.test(rating);
}
const isValidBody = function (value) {
    if (typeof value === "undefined" || value === null)
        return false;
}

const isValidImage = function (value) {
    const Regex = /image\/png|image\/jpeg|image\/jpg/
    
    return Regex.test(value);
}
const isValidPrice = function (value) {
    const Regex = /^[1-9][0-9]{2,5}\.[0-9]{2}|^[1-9][0-9]{2,5}$/
    return Regex.test(value)
}

const validSize=function(arrayOfSize){
    let size1 = ["S", "XS", "M", "X", "L", "XXL", "XL"];
            let size2 = arrayOfSize.toUpperCase().split(",").map((x) => x.trim())
            for (let i = 0; i < size2.length; i++) {
                if (!size1.includes(size2[i])) {
                    return false
                }
          }
     return true
 }


module.exports = { validSize, isValidNames,isValid, isValidEmail, isValidPhone, isValidName, isValidPassword, isvalidObjectId, isValidPinCode, isValidDate, isValidMixed, isValidNumber, isValidBody,isValidImage,isValidPrice}