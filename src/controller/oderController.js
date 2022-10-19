const orderModel = require('../model/orderModel')
const productModel = require('../model/productModel')
const userModel = require('../model/userModel')
const cartModel = require('../model/cartModel')
const { isValid, isvalidObjectId} = require('../validation/validator')

const createOrder = async function(req,res)
{
    try{

    }
    catch(err)
    {
        console.log(err)
        return res.status(500).send({status:false, message:"Error" ,error: err.message })
    }

}


const updateOrder = async function(req,res)
{
    try{

    }
    catch(err)
    {
        console.log(err)
        return res.status(500).send({status:false, message:"Error" ,error: err.message })
    }

}


module.exports = {createOrder,updateOrder}