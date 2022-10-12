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
        return res.status(500).send({status:false, message:err.message})
    }
};

const authorization= async function (req,res,next){
    try {
        let  userId = req.params.userId
        if(!isvalidObjectId(userId))
        return res.status(400).send({ status: false, message:"please provide the valid userId"})
        let tokenUserId = req.decodetoken.userId
        const checkUser = await userModel.findById({_id:userId})
        if(!checkUser)
        return res.status(404).send({ status: false, message:"No user found"});
        if(tokenUserId !=userId)
        return res.status(403).send({ status: false, message: "You are not authorize to edit"})
        next();
    } catch (err) {
        return res.status(500).send({ status: false, message:err.message})
    }
}


module.exports = {authentication,authorization}