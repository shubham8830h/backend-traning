const bcrypt = require("bcrypt") //123   alkdsjf;kla@j3434
const userModel = require('../model/userModel')
const moment = require('moment') // manipulate our dates 
const jwt = require('jsonwebtoken')  // create a token ... 
const {uploadFile}= require("../middleware/aws")
const { isValid, isValidName, isValidEmail, isValidPhone, isValidPassword, isValidMixed, isValidPinCode, isValidImage,isvalidObjectId } = require("../validation/validator")
// const aws = require('aws-sdk');
// const { fn } = require("moment")
// const { authentication } = require("../middleware/middleware")




const createUser = async (req, res) => {
    try {
        let data = req.body
       
        let { fname, lname, email, phone, password, address } = req.body
        // let shipping = req.body.address
        // let billing = req.body.address
        let profileImage = req.files


        if (Object.keys(data).length == 0)
            return res.status(400).send({ status: false, message: "provide the All data" })

        //validation for fname

        if (!isValid(fname)) {
            return res.status(400).send({ status: false, message: "provide the fname" })
        }
        if (!isValidName(fname)) {
            return res.status(400).send({ status: false, message: "fname should be character only" })
        }

        //validation for lname

        if (!isValid(lname)) {
            return res.status(400).send({ status: false, message: "provide the lname" })
        }
        if (!isValidName(lname)) {
            return res.status(400).send({ status: false, message: "lname should be character only" })
        }

        //validation for email
        if (!isValid(email)) {
            return res.status(400).send({ status: false, message: "provide the email" })
        }
        if (!isValidEmail(email)) {
            return res.status(400).send({ status: false, message: "provide the valid email" })
        }
        const checkUser = await userModel.findOne({ email: email });
        if (checkUser) {
            return res.status(400).send({ status: false, message: "email already exists" })
        }

        //validation for profileImage
        if (profileImage) {
            if (!isValidImage(profileImage[0].mimetype)) return res.status(400).send({ status: false, message: "provide the valid profileImage" })
            let files = req.files;
            // console.log(files)
            if (files && files.length > 0) {
                let uploadedFileURL = await uploadFile(files[0]);

                profileImage = uploadedFileURL;
                // console.log(profileImage)
            } else {
                return res.status(400).send({ message: "No file found" });
            }
        }
        else { return res.status(400).send({ status: false, message: "Please provide profileimage" }) }



        //validation for phone

        if (!isValid(phone)) {
            return res.status(400).send({ status: false, message: "provide the phone Number" })
        }
        if (!isValidPhone(phone)) {
            return res.status(400).send({ status: false, message: "provide the valid indian phone number" })
        }
        const checkPhone = await userModel.findOne({ phone: phone });
        if (checkPhone) {
            return res.status(400).send({ status: false, message: "phone Number already exists" })
        }

        //validation for password
        if (!isValid(password)) {
            return res.status(400).send({ status: false, message: "provide the password" })
        }
        if (!isValidPassword(password)) {
            return res.status(400).send({ status: false, message: "provide the valid password ,length of password should be 8 to 15 [Ex:Abcd@1234]" })
        }
        const encryptedPassword = await bcrypt.hash(password, 15); //encrypting the Password
        req.body.password = encryptedPassword;

        if (address) {
            // console.log(address)
            address = JSON.parse(address)
            if (address.shipping) {
                if (!isValid(address.shipping.street))
                    return res.status(400).send({ status: false, message: "please enter shipping street address" })
                if (!isValidMixed(address.shipping.street))
                    return res.status(400).send({ status: false, message: "please enter valid shipping street address" })
                if (!isValid(address.shipping.city))
                    return res.status(400).send({ status: false, message: "please enter shipping city address" })
                if (!isValidMixed(address.shipping.city))
                    return res.status(400).send({ status: false, message: "please enter valid  shipping city address" })
                if (!isValid(address.shipping.pincode))
                    return res.status(400).send({ status: false, message: "please enter shipping pin " })
                if (!isValidPinCode(address.shipping.pincode))
                    return res.status(400).send({ status: false, message: "please enter valid shipping pin" })

            }
            else { return res.status(400).send({ status: false, message: "Please enter shipping address" }) }


            if (address.billing) {
                if (!isValid(address.billing.street))
                    return res.status(400).send({ status: false, message: "please enter   billing street address" })
                if (!isValidMixed(address.billing.street))
                    return res.status(400).send({ status: false, message: "please enter valid billing street address" })
                if (!isValid(address.billing.city))
                    return res.status(400).send({ status: false, message: "please enter  billing city address" })
                if (!isValidMixed(address.billing.city))
                    return res.status(400).send({ status: false, message: "please enter valid billing city address" })
                if (!isValid(address.billing.pincode))
                    return res.status(400).send({ status: false, message: "please enter  billing pin " })
                if (!isValidPinCode(address.billing.pincode))
                    return res.status(400).send({ status: false, message: "please enter billing valid pin" })

            }
            else { return res.status(400).send({ status: false, message: "Please enter billing address" }) }
        }
        else { return res.status(400).send({ status: false, message: "Please enter address" }) }

        const newData = {
            fname: fname,
            lname: lname,
            email: email,
            profileImage: profileImage,
            phone: phone,
            password: password,
            address: address,
        };
        const saveData = await userModel.create(newData)
        return res.status(201).send({ status: true, message: "User Created successfully", data: saveData })

    } catch (err) { console.log(err) }
}


const userlogin = async function (req, res) {
    try {
        // let emailId = req.body.email
        // let password = req.body.password
        let data = req.body
        let { emailId, password } = data
        if(Object.keys(data).length == 0) return res.status(400).send({status:false, message:"Please proivde data"})

        if (!isValid(emailId)) return res.status(400).send({ status: false, message: "Please enter  emailId" })
        if (!isValidEmail(emailId)) return res.status(400).send({ status: false, message: "Please enter valid emailId" })

        if (!isValid(password)) return res.status(400).send({ status: false, message: "Please enter password" })
        if (!isValidPassword(password)) return res.status(400).send({ status: false, message: "Please enter valid password" })
        let hpassword = await bcrypt.compare(password,user.password)
        if(hpassword==false)return res.status(400).send({status:false,message:"Please enter your correct password"})

        let userin = await userModel.findOne({ email: emailId, password: password })
        if (!userin) return res.status(404).send({ status: false, message: "Please enter correct emailId and Password" })

        const token = await jwt.sign(
            {
                userId: userin._id.toString(),
                iat: Math.floor(Date.now() / 1000),//created 
                exp: Math.floor(moment().add(1, 'days')) // expire
            },
            "Secretekeygroup25"
        )
        // res.setHeader("x-auth-key", token)
        // ("authenticate", token)
        res.setheader("Authorization",token)
        return res.status(201).send({ status: true, message: "Login Successfully", userId: userin._id, data: token })
    }
    catch (err) {
        return res.status(500).send({ message: err })
    }
}

const getuserprofile = async function (req, res) {
    try {
        let userId = req.params.userId
        if(!userId) return res.status(400).send({status:false, message:"Please enter userId in path param"})
        if (!isvalidObjectId(userId)) {return res.status(400).send({ status: false, message: "Please enter valid userId" })}
        console.log(userId)
        let userindb = await userModel.findOne({ _id: userId })
        if (!userindb) return res.status(404).send({ status: false, message: "NO user found" })

        return res.status(200).send({ status: true, message: "Users Profile", data: userindb })
    }
    catch (err) {
        return res.status(500).send({ message: err })
    }
}

const updateprofile = async function (req, res) {
    try {
        let userId = req.params.userId
        if(!userId) return res.status(400).send({status:false, message:"Please enter userId in path param"})
        if (!isvalidObjectId(userId)) return res.status(400).send({ status: false, message: "Please enter valid userId" })
        let body = req.body
        let profileImage = req.files
        if ((Object.keys(body).length === 0)&&(!profileImage)) {
            return res.status(400).send({ status: false, message: "Please enter updations details" })
        } 
        // if(!(body || profileImage))  return res.status(400).send({ status: false, message: "Please enter updations details" })
        let { fname, lname, email, phone,password, address } = body
        // console.log(body)
        // let shipping = req.body.address
        // let billing = req.body.address
        
        
        let updations ={}
        // console.log(updations)

        if(fname){
            if(!isValid(fname)) return res.status(400).send({status:false, message:"Please enter fname"})
            if(!isValidName(fname)) return res.status(400).send({status:false, message:"Please enter valid fname"})
            updations.fname = fname
        }
        if(lname){
            if(!isValid(lname)) return res.status(400).send({status:false, message:"Please enter lname"})
            if(!isValidName(lname)) return res.status(400).send({status:false, message:"Please enter valid lname"})
            updations.lname = lname
        }
        if(email){
            if(!isValid(email)) return res.status(400).send({status:false, message:"Please enter email"})
            if(!isValidEmail(email)) return res.status(400).send({status:false, message:"Please enter valid email"})
            updations.email = email
        }
        if(phone){
            if(!isValid(phone)) return res.status(400).send({status:false, message:"Please enter phone"})
            if(!isValidPhone(phone)) return res.status(400).send({status:false, message:"Please enter valid phone"})
            updations.phone = phone
        }
        if(password){
            if(!isValid(password)) return res.status(400).send({status:false, message:"Please enter password"})
            if(!isValidPassword(password)) return res.status(400).send({status:false, message:"Please enter valid password"})
            const encryptedPassword = await bcrypt.hash(password, 15); //encrypting the Password
            req.body.password = encryptedPassword;
            updations.password = password
        }
        
        if (profileImage) {
            // if (!isValidImage(profileImage.originalname)) return res.status(400).send({ status: false, message: "provide the valid profileImage" })
            let files = req.files;
            if (files && files.length > 0) {
                let uploadedFileURL = await uploadFile(files[0]);

                profileImage = uploadedFileURL;
                console.log(profileImage)
            } else {
                return res.status(400).send({ message: "No file found" });
            }
        }
        if (address) {
            // console.log(address)
            address = JSON.parse(address)
            if (address.shipping) {
                if (!isValid(address.shipping.street))
                    return res.status(400).send({ status: false, message: "please enter shipping street address" })
                if (!isValidMixed(address.shipping.street))
                    return res.status(400).send({ status: false, message: "please enter valid shipping street address" })
                if (!isValid(address.shipping.city))
                    return res.status(400).send({ status: false, message: "please enter shipping city address" })
                if (!isValidMixed(address.shipping.city))
                    return res.status(400).send({ status: false, message: "please enter valid  shipping city address" })
                if (!isValid(address.shipping.pincode))
                    return res.status(400).send({ status: false, message: "please enter shipping pin " })
                if (!isValidPinCode(address.shipping.pincode))
                    return res.status(400).send({ status: false, message: "please enter valid shipping pin" })

            }
            if (address.billing) {
                if (!isValid(address.billing.street))
                    return res.status(400).send({ status: false, message: "please enter   billing street address" })
                if (!isValidMixed(address.billing.street))
                    return res.status(400).send({ status: false, message: "please enter valid billing street address" })
                if (!isValid(address.billing.city))
                    return res.status(400).send({ status: false, message: "please enter  billing city address" })
                if (!isValidMixed(address.billing.city))
                    return res.status(400).send({ status: false, message: "please enter valid billing city address" })
                if (!isValid(address.billing.pincode))
                    return res.status(400).send({ status: false, message: "please enter  billing pin " })
                if (!isValidPinCode(address.billing.pincode))
                    return res.status(400).send({ status: false, message: "please enter billing valid pin" })

            }
            updations.address = address
        }
       
        let updatedData = await userModel.findByIdAndUpdate({_id:userId},{$set:updations},{new:true})
        // console.log(updatedData)
        if(!updatedData) return res.status(404).send({status:false, message:"No User found "})
        return res.status(201).send({status:true, message:"updated successfully",data:updatedData})
       
    }
    catch (err) {
        return res.status(500).send({ message: err })
    }
}

module.exports = { createUser, userlogin, getuserprofile, updateprofile }

