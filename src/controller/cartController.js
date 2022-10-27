const productModel = require('../model/productModel')
const userModel = require('../model/userModel')
const cartModel = require('../model/cartModel')
const { isValid, isvalidObjectId,isValidBody} = require('../validation/validator')


const createcart = async function (req, res) {
    try {
        let userId = req.params.userId
        if (!isvalidObjectId(userId)) return res.status(400).send({ status: false, message: "Please provide valid userId" })
        let user = await userModel.findOne({ _id: userId, isDeleted: false })
        if (!user) return res.status(404).send({ status: false, message: "User not present or may be deleted" })

        let data = req.body
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "Please provide  data in request body" })
        let { productId, cartId } = data

        // if (!productId) return res.status(400).send({ status: false, message: "Please provide productId" })
        if(!isValid(productId)) return res.status(400).send({status:false, message:"Please provide productId"})
        if (!isvalidObjectId(productId)) return res.status(400).send({ status: false, message: "Please provide valid productId" })
        let product = await productModel.findOne({ _id: productId, isDeleted: false })
        if (!product) { return res.status(404).send({ status: false, message: "Product not found or may be deleted" }) }

        let addItems = {}
        addItems.productId = productId    //addItems["productId"] = productId
        addItems.quantity = 1

       
        let cart = await cartModel.findOne({ userId: userId })
        if (cart) {
            let cartItems = cart.items
            for (let i = 0; i < cartItems.length; i++) {
                if (cartItems[i].productId.toString() == addItems.productId) {
                    cartItems[i].quantity = cartItems[i].quantity + addItems.quantity
                       break
                }
                else if (i == (cartItems.length - 1)) {
                    cartItems.push(addItems)
                    break
                }
            }
            if (cart.items.length == 0) {
                cartItems.push(addItems)
            }
            let items = {
                userId: userId,
                items: cartItems,
                totalPrice: product.price + cart.totalPrice,
                totalItems: cartItems.length

            }
           
            if (cartId) {
                
                if (!isvalidObjectId(cartId)) return res.status(400).send({ status: false, message: "Please provide valid cartId" })
                
            let addproduct = await cartModel.findOneAndUpdate({ _id: cartId , userId:userId}, { $set: items }, { new: true }).populate({ path: 'items.productId', model: productModel, select: ["title", "price", "productImage", "availableSizes"] })
            if (!addproduct) return res.status(404).send({ status: false, message: "Cart not found or you are not authorised " })
            return res.status(201).send({ status: true, message: "Product added successfully", data: addproduct })
        }
        return res.status(400).send({status:false, message:"cart for this user already created try to update that cart"})
    }


        let newcart = {
            userId: userId,
            items: addItems,
            totalPrice: product.price,
            totalItems: 1
        }
        let createcart = await cartModel.create(newcart)
        return res.status(201).send({ status: true, message: "Cart created with a product", data: createcart }) //"title", "price" , "productImage","availableSizes"

    }
    catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    }
}


const getCart = async function (req, res) {
    try {
        let userId = req.params.userId

        // validation for userId
        if (!isvalidObjectId(userId)) {
            return res.status(400).send({ status: false, message: `given userId: ${userId} is not valid` });
        }

        let checkUserId = await userModel.findOne({ _id: userId,isDeleted:false })
        if (!checkUserId) {
            return res.status(404).send({ status: false, message: "User details are not found or may be deleted" })
        }

        let getData = await cartModel.findOne({ userId });
        if (getData.items.length == 0)
            return res.status(404).send({ status: false, message: "No items present" });

        if (!getData) {
            return res.status(404).send({ status: false, message: `Cart does not exist with this userId ${userId}` })
        }

        res.status(200).send({ status: true, message: 'Success', data: getData })

    } catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    }
};


const updateCartById = async function (req, res) {
    try {
    
        let userId = req.params.userId;

        if (!isvalidObjectId(userId)) {
            return res
                .status(400)
                .send({ status: false, message: "Enter a Valid UserID" });
        }

        let isUserExist = await userModel.findById(userId);
        if (!isUserExist) {
            return res.status(404).send({ status: false, message: "User Not Found" });
        }

        // // Authorization
        // if (isUserExist.userId !== req.userId) {
        //     return res
        //         .status(403)
        //         .send({ status: false, message: "user not authorized to update cart" });
        // }

        let requestBody = req.body;

          if(Object.keys(requestBody).length == 0) {return res
                 .status(400)
                 .send({ status: false, message: `Invalid Request parameters` });
         }

        // Destruct the reqBody
        let { cartId, productId, removeProduct } = requestBody;

        // Check Cart Exists or not
        const isCartExist = await cartModel.findOne({ userId: userId });
        if (!isCartExist) {
            return res.status(404).send({
                status: false,
                message: `Cart Not Found `,
            });
        }

        if (!isValid(cartId)) {
            return res
                .status(400)
                .send({ status: false, message: `Please Enter A Cart ID` });
        }
        cartId = cartId.trim();

        // Validate the cart ID
        if (!isvalidObjectId(cartId)) {
            return res
                .status(400)
                .send({ status: false, message: `invalid Cart Id` });
        }

        // Cart ID from user and cart ID from body matches or not
        if (isCartExist._id != cartId) {
            return res
                .status(400)
                .send({ status: false, message: "CartId and user do not match" });
        }

        
        if (!isValid(productId)) {
            return res
                .status(400)
                .send({ status: false, message: "enter the productId" });
        }
       

        // Validate the Product ID
        if (!isvalidObjectId(productId)) {
            return res
                .status(400)
                .send({ status: false, message: "enter a valid productId" });
        }

        // Check Product exists or not
        const isProductExist = await productModel.findOne({
            _id: productId,
            isDeleted: false,
        });
        if (!isProductExist) {
            return res
                .status(404)
                .send({ status: false, message: `Product Not Exists` });
        }

        // check remove product is coming or not in reqBody
        if (!req.body.hasOwnProperty("removeProduct")) {
            return res.status(400).send({
                status: false,
                message: "removeProduct key Should Be present",
            });
        }

        // Check if remove is NAN then throw error
        if (isNaN(removeProduct)) {
            return res.status(400).send({
                status: false,
                message: "Enter the valid value for removeProduct",
            });
        }

    
        if (!(removeProduct === 1 || removeProduct === 0)) {
            return res.status(400).send({
                status: false,
                message: `invalid input - remove Product key Should Be a number 1 or 0`,
            });
        }

        // Store items in a Variable
        itemList = isCartExist.items;

        // Take ID List in variable through map
        let idList = itemList.map((ele) => (ele = ele.productId.toString()));
        let index = idList.indexOf(productId);

       
        if (index == -1) {
            return res
                .status(400)
                .send({ status: false, message: `Product Does Not Exist In Cart` });
        }

        // IF Remove Product is ZERO
        if (
            removeProduct == 0 ||
            (removeProduct == 1 && itemList[index]["quantity"] == 1)
        ) {
            let productPrice = itemList[index].quantity * isProductExist.price;

            const updatedCart = await cartModel.findOneAndUpdate(
                { userId: userId },
                {
                    $pull: { items: { productId: productId } },
                    $inc: {
                        totalPrice: -productPrice,
                        totalItems: -1,
                    },
                },
                { new: true }
            ).populate({ path: 'items.productId', model: productModel, select: ["title", "price", "productImage", "availableSizes"] });

            return res
                .status(200)
                .send({ status: true, message: "Sucess", data: updatedCart });
        }

        // If Remove Product Key is ONE
        if (removeProduct == 1) {
    
                  const updatedCart = await cartModel.findOneAndUpdate(
                { userId: userId, "items.productId": productId },
                {
                    $inc: {
                        totalPrice: -isProductExist.price,
                        "items.$.quantity": -1,
                    },
                },
                { new: true }
            ).populate({ path: 'items.productId', model: productModel, select: ["title", "price", "productImage", "availableSizes"] });

            return res
                .status(200)
                .send({ status: true, message: "Success", data: updatedCart });
        }
    } catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    }
}



const deleteCart = async function (req, res) {
    try {

  
        userId = req.params.userId
        if (!isvalidObjectId(userId)) {
            return res.status(400).send({ status: false, message: `given userId: ${userId} is not valid` })
        }

        
        const userSearch = await userModel.findById({ _id: userId })
        if (!userSearch) {
            return res.status(404).send({ status: false, message: "User details are not found " })
        }

        // To check cart is present or not
        const cartSearch = await cartModel.findOne({ userId })
        if (!cartSearch) {
            return res.status(404).send({ status: false, message: "Cart details are not found " })
        }

        const cartDelete = await cartModel.findOneAndUpdate({ userId }, { $set: { items: [], totalItems: 0, totalPrice: 0 } }, { new: true })
        // console.log(cartDelete)
        return res.status(204).send({ status: true, message:"Cart is deleted successfully"})

    }
    catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    }
}





module.exports = { createcart, updateCartById ,getCart,deleteCart}
