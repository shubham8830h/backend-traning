const orderModel = require('../model/orderModel')
const productModel = require('../model/productModel')
const userModel = require('../model/userModel')
const cartModel = require('../model/cartModel')
const { isValid, isvalidObjectId} = require('../validation/validator')

const createOrder = async function(req,res)
{
    try{
        let userId = req.params.userId
        if(!isvalidObjectId(userId)) return res.status(400).send({status:false, message:"Please provide valid userId"})
        let user = await userModel.findOne({_id:userId, isDeleted:false})
        if(!user) return res.status(404).send({status:false, message:"User not exists"})

        let body = req.body
        if(Object.keys(body).length == 0) return res.status(400).send({status:false, message:"Please data in request body"})
        let {cartId,cancellable,status} = body
        let totalQuantity =0

        if(!isValid(cartId)) return res.status(400).send({status:false, message:"Please provide cartId"})
        if(!isvalidObjectId(cartId)) return res.status(400).send({status:false, message:"Please provide valid cartId"})
        let cart = await cartModel.findById(cartId)
        if(!cart) return res.status(404).send({status:false, message:"cart not present"})
        if(cart.userId != userId) return res.status(400).send({status:false, message:"cart userId and given userId does not get matched"})
        let cartItems = cart.items
        for( let i=0; i<cartItems.length;i++){
            totalQuantity = totalQuantity+cartItems[i].quantity
        }
        if(cancellable){
            if(!isValid(cancellable)) return res.status(400).send({status:false, message:"Please provide cancellable value"})
            body.cancellable = cancellable
        }

        if(status){    
            if(!isValid(status)) return res.status(400).send({status:false, message:"Please provide status"})
            if(!isvalidObjectId(status)) return res.status(400).send({status:false, message:"Please provide valid status"})
            if(status !== "pending" && status !== "completed" && status !== "cancelled") return res.status(400).send({status:false, message:"Please provide status (pending, completed, cancelled)"})
            body.status = status
        }

        let newData = {
            userId : userId,
            items : cart.items,
            totalPrice : cart.totalPrice,
            totalItems: cart.totalItems,
            totalQuantity:totalQuantity,
            cancellable:cancellable,
            status:status,
        }

        let ordercreated = await orderModel.create(newData)
        return res.status(201).send({status:true, message:"Order created Successfully", data:ordercreated})
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