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
                let data = req.body
                let userId = req.params.userId
                let { orderId, status } = data
        
                if (!isValid(orderId)) return res.status(400).send({ status: false, message: "order Id must be present" })
            
                if (!(isvalidObjectId(orderId))) return res.status(400).send({ status: false, message: 'please enter valid orderId' })
        
                let findOrder = await orderModel.findOne({ _id: orderId, isDeleted: false })
                if (!findOrder) return res.status(404).send({ status: false, message: "order Id does not exist" })
        
                if (findOrder.userId != userId) return res.status(403).send({ status: false, message: "oredrId does not match with user" })
        
                if (!status) return res.status(400).send({ status: false, message: "enter the status of the order" })
        
                if (findOrder.status == "completed") return res.status(400).send({ status: false, message: "order  completed" })
                if (findOrder.status == "cancelled") return res.status(400).send({ status: false, message: "order  cancelled" })
        
                if (status == "completed") {
        
                    let update = await orderModel.findOneAndUpdate({ _id: orderId }, { status: "completed" }, { new: true },)
        
                    await cartModel.findOneAndUpdate({ userId }, { items: [], totalPrice: 0, totalItems: 0 }, { new: true })
        
                    return res.status(200).send({ status: true, message: "Success", data: update })
                }
        
                else if (status == "cancelled") {
        
                    if (findOrder.cancellable == false) return res.status(400).send({ status: false, message: "you can not cancel this order" })
        
                    let updatedata = await orderModel.findOneAndUpdate({ _id: orderId }, { isDeleted: true, deletedAt: Date.now(), status: "cancelled" }, { new: true })
        
                    await cartModel.findOneAndUpdate({ userId }, { items: [], totalPrice: 0, totalItems: 0 }, { new: true })
        
                    return res.status(200).send({ status: true, message: "Success", data: updatedata })
                }
        
                else {
        
                    return res.status(400).send({ status: false, message: "please enter status either cancelled or completed " })
                }
        
            }
            catch (err) {
                return res.status(500).send({ status: false, message: err.message })
            }
    

}


module.exports = {createOrder,updateOrder}