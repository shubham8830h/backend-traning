const productModel = require('../model/productModel')
const userModel = require('../model/userModel')
const cartModel = require('../model/cartModel')
const { isValid, isvalidObjectId } = require('../validation/validator')


const createcart = async function (req, res) {
    try {
        let userId = req.params.userId
        if (!isvalidObjectId(userId)) return res.status(400).send({ status: false, message: "Please provide valid userId" })
        let user = await userModel.findOne({ _id: userId, isDeleted: false })
        if (!user) return res.status(400).send({ status: false, message: "User not present or may be deleted" })

        let data = req.body
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "Please provide  data in request boyd" })
        let { productId, cartId } = data

        if (!productId) return res.status(400).send({ status: false, message: "Please provide productId" })
        if (!isvalidObjectId(productId)) return res.status(400).send({ status: false, message: "Please provide valid productId" })
        let product = await productModel.findOne({ _id: productId, isDeleted: false })
        if (!product) { return res.status(404).send({ status: false, message: "Product not found or may be deleted" }) }
        let addItems = {}
        addItems.productId = productId
        addItems.quantity = 1

        if (cartId) {
            if (!isvalidObjectId(cartId)) return res.status(400).send({ status: false, message: "Please provide valid cartId" })
        }

        let cart = await cartModel.findOne({ userId: userId })
        if (cart) {
            let cartItems = cart.items
            for (let i = 0; i < cartItems.length; i++) {
                if (cartItems.productId == addItems.productId) {
                    cartItems.quantity = cart.items.quantity + addItems.quantity,
                        cart.totalItems = cart.totalItems
                    break
                }
                else {
                    cartItems.push(addItems)
                    cart.totalItems = cart.totalItems + 1
                    break
                }
            }
            let items = {
                userId: userId,
                items: cartItems,
                totalPrice: product.price + cart.totalPrice,
                totalItems: cart.totalItems

            }

            let addproduct = await cartModel.findOneAndUpdate({ _id: cartId }, { $set: items }, { new: true })
            if(addproduct.userId !== userId)  return res.status(403).send({status:false,message:"User not authorised to add product"})
            if (!addproduct) return res.send({ status: false, message: "Cart not found or please provide cartId to add product" })
            console.log(addproduct)
            return res.status(201).send({ status: true, message: "Product added successfully", data: addproduct })
        }


        let newcart = {
            userId: userId,
            items: addItems,
            totalPrice: product.price,
            totalItems: 1
        }
        let createcart = await cartModel.create(newcart)
        return res.status(201).send({ status: true, message: "Cart created with a product", data: createcart })

    }
    catch (err) {
        console.log(err)
        return res.status(500).send({ msg: "Error", error: err.message });
    }
}





module.exports = { createcart }