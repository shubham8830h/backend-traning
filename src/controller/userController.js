const bcrypt = require("bcrypt")
const userModel = require('../model/userModel')
const moment = require('moment')
const jwt = require('jsonwebtoken')
const aws =  require("../middleware/aws")
const { isValid, isValidName, isValidEmail, isValidPhone, isValidPassword, isValidMixed, isValidPinCode, isValidImage } = require("../validation/validator")


const createUser = async (req, res) => {
    try {
        let data = req.body
        let { fname, lname, email, profileImage, phone, password, address } = req.body

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
        if (!(lname)) {
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
        
        let files= req.files
        if(files && files.length>0){
            //upload to s3 and get the uploaded link
            // res.send the link back to frontend/postman
           
        // profileImage.files = req.body
        if(!profileImage.files){
             return res.status(400).send({ status: false, message: "please provide the profileImage file" })
        }
        if (!isValid(profileImage.files)) {
            return res.status(400).send({ status: false, message: "provide the profileImage" })
        }
        if (!isValidImage(profileImage.files)) {
            return res.status(400).send({ status: false, message: "provide the valid profileImage url" })
        }
        let uploadedFileURL= await uploadFile( files[0] )
        res.status(201).send({msg: "file uploaded succesfully", data: uploadedFileURL})
    }
    else{
        res.status(400).send({ msg: "No file found" })
    }
        
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

        // validation for address
        if (req.body.address)
            req.body.address = JSON.parse(address)
        let { shipping, billing } = req.body.address

        if (!shipping) {
            return res.status(400).send({ status: false, message: "Please enter shipping address" })
        }
        if (!isValid(shipping.street) || !isValidMixed(shipping.street))
            return res.status(400).send({ status: false, message: "please enter valid street address" })

        // if(!isValidMixed(shipping.street))
        //     return res.status(400).send({status:false , message:"provide the valid street"})
        // }else{
        //     return res.status(400).send({status:false , message:"Please enter shipping address"});
        // }

        if (!isValid(shipping.city) || !isValidMixed(shipping.city))
            return res.status(400).send({ status: false, message: "please enter valid city address" })
        // }else{
        //     return res.status(400).send({status:false , message:"Please enter city address"});
        // }
        if (!isValid(shipping.pin) || !isValidPinCode(shipping.pin))
            return res.status(400).send({ status: false, message: "please enter valid pin " })
        // }else{
        //     return res.status(400).send({status:false , message:"Please enter pin "});
        // }
        //valodation for address.billing
        if (!billing) {
            return res.status(400).send({ status: false, message: "Please enter billing address" })
        }
        if (!isValid(billing.street) || !isValidMixed(billing.street))
            return res.status(400).send({ status: false, message: "please enter valid street address" })

        if (!isValid(billing.city) || !isValidMixed(billing.city))
            return res.status(400).send({ status: false, message: "please enter valid city address" })

        if (!isValid(billing.pin) || !isValidPinCode(billing.pin))
            return res.status(400).send({ status: false, message: "please enter valid pin " })


       
        
        const saveData = await userModel.create(req.body)
        return res.status(201).send({ status: true, message: "Success", data: saveData })

    } catch (err) { console.log(err) }
}


const userlogin = async function (req, res) {
    try {
        let emailId = req.email
        let password = req.password

        if (!isValid(emailId)) return res.status(400).send({ status: false, message: "Please enter  emailId" })
        if (!validemail(emailId)) return res.status(400).send({ status: false, message: "Please enter valid emailId" })

        if (!isValid(password)) return res.status(400).send({ status: false, message: "Please enter password" })
        if (!validPassword(password)) return res.status(400).send({ status: false, message: "Please enter valid password" })

        let userin = await userModel.findOne({ email: emailId, password: password })
        if (!userin) return res.status(404).send({ status: false, message: "Please enter correct emailId and Password" })

        const token = await jwt.sign(
            {
                userId: userin._id.toString(),
                iat: Math.floor(Date.now() / 1000),
                exp: Math.floor(moment().add(1, 'days'))
            },
            "Secretekeygroup25"
        )
        res.setHeader("x-auth-key", token)
        return res.status(201).send({ status: true, message: "Login Successfully", data: token })
    }
    catch (err) {
        return res.status(500).send({ message: err })
    }
}

const getuserprofile = async function (req, res) {
    try {
        let userId = req.params.userId
        if (!isValid(userId)) return res.status(400).send({ status: false, message: "Please enter userId in pathparam" })
        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: "Please enter valid userId" })

        let userindb = await userModel.findById({ userId })
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
        if (!isValid(userId)) return res.status(400).send({ status: false, message: "Please enter userId in pathparam" })
        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: "Please enter valid userId" })

    }
    catch (err) {
        return res.status(500).send({ message: err })
    }
}

module.exports = { createUser,userlogin, getuserprofile, updateprofile }

