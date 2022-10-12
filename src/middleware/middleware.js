const jwt = require('jsonwebtoken')
const userModel = require('../model/userModel')
const mongoose = require('mongoose')
const {isvalidObjectId} = require('../validation/validator')


const authentication = async function(req,res,next)
{
    try{
        let token = req.headers("Authorization")
        console.log(token)
        if(!token)  return res.status(401).send({ status: false, message: "Please enter Token" })
        let decodetoken = jwt.verify(token, "Secretekeygroup25")
        if(!decodetoken)  return res.status(401).send({ status: false, message: "Invalide token" })
        req.decodetoken = decodetoken
        next()
    }
    catch(err)
    {
        return res.status(500).send({status:false, message:err})
    }
}





module.exports = {authentication}