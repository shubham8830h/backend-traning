const userModel = require('../model/userModel')
const moment = require('moment')
const jwt = require('jsonwebtoken')

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true
}

const validemail = function (value) {
    let regex = /[a-zA-Z0-9_\-\.]+[@][a-z]+[\.][a-z]{2,3}/
    return regex.test(value)
}
const validPassword = function (value) {
    let regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/;
    return regex.test(value)
}
const isValidObjectId = function(ObjectId){
         return mongoose.Types.ObjectId.isValid(ObjectId)
     }
    

const userlogin = async function (req, res)
{
    try{
        let emailId = req.email
        let password = req.password

        if(!isValid(emailId))  return res.status(400).send({status:false, message:"Please enter  emailId"})
        if(!validemail(emailId))  return res.status(400).send({status:false, message:"Please enter valid emailId"})

        if(!isValid(password))  return res.status(400).send({status:false, message:"Please enter password"})
        if(!validPassword(password))  return res.status(400).send({status:false, message:"Please enter valid password"})

        let userin = await userModel.findOne({email:emailId, password:password})
        if(!userin)  return res.status(404).send({status:false, message:"Please enter correct emailId and Password"})

        const token = await jwt.sign(
            {
                userId : userin._id.toString(),
                iat : Math.floor(Date.now()/1000),
                exp: Math.floor(moment().add(1,'days'))
            },
            "Secretekeygroup25"
        )
        res.setHeader("x-auth-key",token)
        return res.status(201).send({status:true, message:"Login Successfully", data:token})
    }
    catch(err)
    {
        return res.status(500).send({message: err})
    }
}

const getuserprofile = async function (req, res)
{
    try{
       let userId = req.params.userId
        if(!isValid(userId)) return res.status(400).send({status:false, message:"Please enter userId in pathparam"})
        if(!isValidObjectId(userId)) return res.status(400).send({status:false, message:"Please enter valid userId"})

        let userindb = await userModel.findById({userId})
        if(!userindb) return res.status(404).send({status:false, message:"NO user found"})

        return res.status(200).send({status:true, message:"Users Profile", data:userindb})
    }
    catch(err)
    {
        return res.status(500).send({message: err})
    }
}

const updateprofile = async function (req, res)
{
    try{
        let userId = req.params.userId
        if(!isValid(userId)) return res.status(400).send({status:false, message:"Please enter userId in pathparam"})
        if(!isValidObjectId(userId)) return res.status(400).send({status:false, message:"Please enter valid userId"})
        
    }
    catch(err)
    {
        return res.status(500).send({message: err})
    }
}

module.exports = {userlogin,getuserprofile,updateprofile}