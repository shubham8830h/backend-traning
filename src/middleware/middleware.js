const jwt = require('jsonwebtoken')
const userModel = require('../model/userModel')
const mongoose = require('mongoose')
const {isvalidObjectId} = require('../validation/validator')


const authentication = async function(req,res,next)
{
    try{
        let token = req.header("Authorization")
        console.log(token)
        if(!token)  return res.status(401).send({ status: false, message: "Please enter Token" })
        const bearer = token.split(' ')
        const bearerToken = bearer[1]
        jwt.verify(bearerToken, "Secretekeygroup25", (err,decodetoken)=>{
        // console.log(decodetoken)
        if(err)  {return res.status(401).send({ status: false, message: err.message })
        }else{
        req.decodetoken = decodetoken
        next()
        }
        })
    }
  catch(err)
    {
        return res.status(500).send({status:false, message:err})
    }
}








module.exports = {authentication}