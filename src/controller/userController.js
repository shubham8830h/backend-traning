const bcrypt = require("bcrypt") //123   alkdsjf;kla@j3434
const userModel = require('../model/userModel')
const moment = require('moment') // manipulate our dates 
const jwt = require('jsonwebtoken')  // create a token ... 
const { uploadFile } = require("../middleware/aws")
const { isValid, isValidName, isValidEmail, isValidPhone, isValidPassword, isValidMixed, isValidPinCode, isValidImage, isvalidObjectId } = require("../validation/validator")


// -------------------------------------------CreateUser-----------------------------------------------
const createUser = async (req, res) => {
    try {
        let data = req.body
        let { fname, lname, email, phone, password, address } = req.body
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

        if (!isValid(email.toLowerCase())) {
            return res.status(400).send({ status: false, message: "provide the email" })
        }
        if (!isValidEmail(email.toLowerCase())) {
            return res.status(400).send({ status: false, message: "provide the valid email" })
        }
        const checkUser = await userModel.findOne({ email: email.toLowerCase() });
        if (checkUser) {
            return res.status(400).send({ status: false, message: "email already exists" })
        }

        //validation for profileImage
        // if (profileImage) {//proper work nahi kr raha hai
        // if (profileImage.length === 0) 
        // return res.status(400).send({ status: false, message: "ProfileImage is required." });
        // console.log(files)
        if (profileImage && profileImage.length > 0) {
            if (!isValidImage(profileImage[0].mimetype)) return res.status(400).send({ status: false, message: "provide the valid profileImage" })
            let uploadedFileURL = await uploadFile(profileImage[0]);

            profileImage = uploadedFileURL;
            // console.log(profileImage)
        } else {
            return res.status(400).send({ message: "ProfileImage is required." });
        }
        // }
        // else { return res.status(400).send({ status: false, message: "Please provide profileimage" }) }




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



        if (address) {
            // console.log(address)
            address = JSON.parse(address)
            if (address.shipping) {
                if (address.shipping.street) {
                    if (!isValid(address.shipping.street))
                        return res.status(400).send({ status: false, message: "please enter shipping street address" })
                    if (!isValidMixed(address.shipping.street))
                        return res.status(400).send({ status: false, message: "please enter valid shipping street address" })
                } else {
                    return res.status(400).send({ status: false, message: "Please enter street address of shipping" })
                }
                if (address.shipping.city) {
                    if (!isValid(address.shipping.city))
                        return res.status(400).send({ status: false, message: "please enter shipping city address" })
                    if (!isValidMixed(address.shipping.city))
                        return res.status(400).send({ status: false, message: "please enter valid  shipping city address" })
                } else {
                    return res.status(400).send({ status: false, message: "Please enter city address of shipping" })
                }
                if (address.shipping.pincode) {
                    if (!isValid(address.shipping.pincode))
                        return res.status(400).send({ status: false, message: "please enter shipping pin " })
                    if (!isValidPinCode(address.shipping.pincode))
                        return res.status(400).send({ status: false, message: "please enter valid shipping pin" })
                } else {
                    return res.status(400).send({ status: false, message: "Please enter pincode address of shipping" })
                }

            }
            if (address.billing) {
                if (address.billing.street) {
                    if (!isValid(address.billing.street))
                        return res.status(400).send({ status: false, message: "please enter   billing street address" })
                    if (!isValidMixed(address.billing.street))
                        return res.status(400).send({ status: false, message: "please enter valid billing street address" })
                } else {
                    return res.status(400).send({ status: false, message: "Please enter street address of billing" })
                }
                if (address.billing.city) {
                    if (!isValid(address.billing.city))
                        return res.status(400).send({ status: false, message: "please enter  billing city address" })
                    if (!isValidMixed(address.billing.city))
                        return res.status(400).send({ status: false, message: "please enter valid billing city address" })
                } else {
                    return res.status(400).send({ status: false, message: "Please enter city address of billing" })
                }
                if (address.billing.pincode) {
                    if (!isValid(address.billing.pincode))
                        return res.status(400).send({ status: false, message: "please enter  billing pin " })
                    if (!isValidPinCode(address.billing.pincode))
                        return res.status(400).send({ status: false, message: "please enter billing valid pin" })
                } else {
                    return res.status(400).send({ status: false, message: "Please enter pincode address of billing" })
                }

            }
            else { return res.status(400).send({ status: false, message: "Please enter billing address" }) }
        }
        else { return res.status(400).send({ status: false, message: "Please enter address" }) }

        const newData = {
            fname: fname,
            lname: lname,
            email: email.toLowerCase(),
            profileImage: profileImage,
            phone: phone,
            password: encryptedPassword,
            address: address,
        };
        const saveData = await userModel.create(newData)
        return res.status(201).send({ status: true, message: "Success", data: saveData })

    } catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    }
}

// -------------------------------------------UserLogin-----------------------------------------------
const userlogin = async function (req, res) {
    try {
        // let emailId = req.body.email
        // let password = req.body.password
        let data = req.body;
        let { email, password } = data
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "Please proivde data" })

        if (!email)
            return res.status(400).send({ status: false, message: "Please enter  emailId" })
        let userin = await userModel.findOne({ email: email.toLowerCase() })
        if (!userin)
            return res.status(404).send({ status: false, message: "Please enter correct emailId." })
        if (!password)
            return res.status(400).send({ status: false, message: "Please enter password" })
        let hpassword = await bcrypt.compare(password, userin.password)
        if (hpassword == false)
            return res.status(400).send({ status: false, message: "Please enter your correct password" })

        const token = await jwt.sign(
            {
                userId: userin._id.toString(),
                exp: Math.floor(moment().add(1, 'days')) // expire
            },
            "Secretekeygroup25"
        )

        res.header("Authorization", "Bearer : " + token);
        const result={
            "userId": userin._id,
             "token": token,
             "iat":Math.floor(Date.now() / 1000)
        }
        return res.status(201).send({ status: true, message: "Login Successfully", data:result })
    }
    catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    }
}

// -------------------------------------------Get user-----------------------------------------------

const getuserprofile = async function (req, res) {
    try {
        let userId = req.params.userId
        if (!userId) return res.status(400).send({ status: false, message: "Please enter userId in path param" })
        if (!isvalidObjectId(userId)) { return res.status(400).send({ status: false, message: "Please enter valid userId" }) }
        console.log(userId)
        let userindb = await userModel.findOne({ _id: userId }).select({ createdAt: 0, updatedAt: 0, __v: 0 })
        if (!userindb) return res.status(404).send({ status: false, message: "NO user found" })

        return res.status(200).send({ status: true, message: "Users Profile", data: userindb })
    }
    catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    }
}


// -------------------------------------------Updateuser-----------------------------------------------

const updateprofile = async function (req, res) {
    try {
        let userId = req.params.userId
        if (!userId) return res.status(400).send({ status: false, message: "Please enter userId in path param" })
        if (!isvalidObjectId(userId)) return res.status(400).send({ status: false, message: "Please enter valid userId" })
        let body = req.body
        let profileImage = req.files
        if ((Object.keys(body).length === 0) && (!profileImage)) {
            return res.status(400).send({ status: false, message: "Please enter updations details" })
        }
        // if(!(body || profileImage))  return res.status(400).send({ status: false, message: "Please enter updations details" })
        let { fname, lname, email, phone, password, address } = body
        // console.log(body)
        // let shipping = req.body.address
        // let billing = req.body.address


        let updations = {}
        // console.log(updations)

        if (fname != null) {
            if (!isValid(fname)) return res.status(400).send({ status: false, message: "Please enter fname" })
            if (!isValidName(fname)) return res.status(400).send({ status: false, message: "Please enter valid fname" })
            updations.fname = fname
        }
        if (lname != null) {
            if (!isValid(lname)) return res.status(400).send({ status: false, message: "Please enter lname" })
            if (!isValidName(lname)) return res.status(400).send({ status: false, message: "Please enter valid lname" })
            updations.lname = lname
        }
        if (email != null) {
            if (!isValid(email)) return res.status(400).send({ status: false, message: "Please enter email" })
            if (!isValidEmail(email)) return res.status(400).send({ status: false, message: "Please enter valid email" })
            updations.email = email
        }
        if (phone != null) {
            if (!isValid(phone)) return res.status(400).send({ status: false, message: "Please enter phone" })
            if (!isValidPhone(phone)) return res.status(400).send({ status: false, message: "Please enter valid phone" })
            updations.phone = phone
        }
        if (password != null) {
            if (!isValid(password)) return res.status(400).send({ status: false, message: "Please enter password" })
            if (!isValidPassword(password)) return res.status(400).send({ status: false, message: "Please enter valid password" })
            const encryptedPassword = await bcrypt.hash(password, 15); //encrypting the Password
            req.body.password = encryptedPassword;
            updations.password = password
        }

        if (profileImage && profileImage.length > 0) {
            if (!isValidImage(profileImage[0].mimetype)) return res.status(400).send({ status: false, message: "provide the valid profileImage" })
            let uploadedFileURL = await uploadFile(profileImage[0]);
            profileImage = uploadedFileURL
            updations.profileImage = uploadedFileURL
        }

        if (address != null) {
            
            address = JSON.parse(address)
            if (address.shipping) {
                if (address.shipping.street) {
                    if (!isValid(address.shipping.street))
                        return res.status(400).send({ status: false, message: "please enter shipping street address" })
                    if ((address.shipping.street).trim()==0)
                        return res.status(400).send({ status: false, message: "please enter valid shipping street address" })
                }
                if (address.shipping.city) {
                    if (!isValid(address.shipping.city))
                        return res.status(400).send({ status: false, message: "please enter shipping city address" })
                    if (!isValidMixed(address.shipping.city))
                        return res.status(400).send({ status: false, message: "please enter valid  shipping city address" })
                }
                if (address.shipping.pincode) {
                    if (!isValid(address.shipping.pincode))
                        return res.status(400).send({ status: false, message: "please enter shipping pin " })
                    if (!isValidPinCode(address.shipping.pincode))
                        return res.status(400).send({ status: false, message: "please enter valid shipping pin" })
                }

            }
            if (address.billing) {
                if (address.billing.street) {
                    if (!isValid(address.billing.street))
                        return res.status(400).send({ status: false, message: "please enter   billing street address" })
                    if ((address.shipping.street).trim()==0)
                        return res.status(400).send({ status: false, message: "please enter valid billing street address" })
                }
                if (address.billing.city) {
                    if (!isValid(address.billing.city))
                        return res.status(400).send({ status: false, message: "please enter  billing city address" })
                    if (!isValidMixed(address.billing.city))
                        return res.status(400).send({ status: false, message: "please enter valid billing city address" })
                }
                if (address.billing.pincode) {
                    if (!isValid(address.billing.pincode))
                        return res.status(400).send({ status: false, message: "please enter  billing pin " })
                    if (!isValidPinCode(address.billing.pincode))
                        return res.status(400).send({ status: false, message: "please enter billing valid pin" })
                }

            }
            updations.address = address
        }

        let updatedData = await userModel.findByIdAndUpdate({ _id: userId }, { $set: updations }, { new: true })
        // console.log(updatedData)
        if (!updatedData) return res.status(404).send({ status: false, message: "No User found " })
        return res.status(201).send({ status: true, message: "updated successfully", data: updatedData })

    }
    catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    }
}

// -------------------------------------------export-----------------------------------------------
module.exports = { createUser, userlogin, getuserprofile, updateprofile }

