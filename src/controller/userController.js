const bcrypt = require("bcrypt")
let userModel = require("../model/userModel")
const {isValid,isValidName,isValidEmail,isValidPhone,isValidPassword,isValidMixed,isValidPinCode,isValidImage} = require("../validation/validator")

const createUser =async (req,res)=>{
  try{
   let data = req.body
let {fname,lname,email,profileImage,phone,password,address} =req.body
   
   if(Object.keys(data).length==0)
    return res.status(404).send({status:false, message:"provide the data"})
 
//validation for fname

if(!isValid(fname)){
    return res.status(400).send({status:false , message:"provide the fname"})
}
 if(!isValidName(fname)){
    return res.status(400).send({status:false , message :"fname should be character only"})
 }

//validation for lname

if(!isValid(lname)){
    return res.status(400).send({status:false , message:"provide the lname"})
}
 if(! (lname)){
    return res.status(400).send({status:false , message :"lname should be character only"})
 }

//validation for email
if(!isValid(email)){
    return res.status(400).send({status:false , message:"provide the email"})
}
if(!isValidEmail(email)){
    return res.status(400).send({status:false , message:"provide the valid email"})
}
const checkUser =await userModel.findOne({email:email});
if(checkUser){
    return res.status(400).send({status:false , message:"email already exists"})
}

//validation for phone

if(!isValid(phone)){
    return res.status(400).send({status:false , message:"provide the phone Number"})
}
if(!isValidPhone(phone)){
    return res.status(400).send({status:false , message:"provide the valid indian phone number"})
}
const checkPhone =await userModel.findOne({phone:phone});
if(checkPhone){
    return res.status(400).send({status:false , message:"phone Number already exists"})
}

//validation for password
if(!isValid(password)){
    return res.status(400).send({status:false , message:"provide the password"})
}
if(!isValidPassword(password)){
    return res.status(400).send({status:false , message:"provide the valid password ,length of password should be 8 to 15 [Ex:Abcd@1234]"})
}
const encryptedPassword = await bcrypt.hash(password, 15); //encrypting the Password
req.body.password = encryptedPassword;  
 
// validation for address
if(req.body.address)
   req.body.address =JSON.parse(address)
let {shipping,billing} = req.body.address
 
if(!shipping){
    return res.status(400).send({status:false , message:"Please enter shipping address"})
}
if(!isValid(shipping.street)||!isValidMixed(shipping.street))
 return res.status(400).send({status:false , message:"please enter valid street address"})

// if(!isValidMixed(shipping.street))
//     return res.status(400).send({status:false , message:"provide the valid street"})
// }else{
//     return res.status(400).send({status:false , message:"Please enter shipping address"});
// }

if(!isValid(shipping.city)||!isValidMixed(shipping.city))
    return res.status(400).send({status:false , message:"please enter valid city address"})
// }else{
//     return res.status(400).send({status:false , message:"Please enter city address"});
// }
if(!isValid(shipping.pin)||!isValidPinCode(shipping.pin))
    return res.status(400).send({status:false , message:"please enter valid pin "})
// }else{
//     return res.status(400).send({status:false , message:"Please enter pin "});
// }
//valodation for address.billing
if(!billing){
    return res.status(400).send({status:false , message:"Please enter billing address"})
}
if(!isValid(billing.street)||!isValidMixed(billing.street))
 return res.status(400).send({status:false , message:"please enter valid street address"})
 
 if(!isValid(billing.city)||!isValidMixed(billing.city))
 return res.status(400).send({status:false , message:"please enter valid city address"})

 if(!isValid(billing.pin)||!isValidPinCode(billing.pin))
    return res.status(400).send({status:false , message:"please enter valid pin "})


//  valodation for profileImage

if(!isValid(profileImage)){
    return res.status(400).send({status:false , message:"provide the profileImage"})
}
if(!isValidImage(profileImage)){
    return res.status(400).send({status:false , message:"provide the valid profileImage url"})
}
//  ye sahi nahi hai mujhe samaj nahi aaraha hai ye profileImage wala kal dekhte hai

const saveData  = await userModel.create(req.body)
return res.status(201).send({status:true, message:"Success", data:saveData})

}catch(err){  console.log(err) }  
}

module.exports = {createUser}