const productModel = require('../model/cartModel')
const userModel = require('../model/userModel')
const cartModel = require('../model/cartModel')
const { isValid, isvalidObjectId } = require('../validation/validator')


const getCart = async function (req, res) {
    try {
        let userId = req.params.userId

        // validation for userId
        if (!isvalidObjectId(userId)) {
            return res.status(400).send({ status: false, message: `given userId: ${userId} is not valid` });
        }

        let checkUserId = await userModel.findOne({ _id: userId })
        if (!checkUserId) {
            return res.status(404).send({ status: false, message: "User details are not found" })
        }

        let getData = await cartModel.findOne({ userId });
        if (getData.items.length == 0)
            return res.status(400).send({ status: false, message: "No items present" });

        if (!getData) {
            return res.status(404).send({ status: false, message: `Cart does not exist with this userId ${userId}` })
        }

        res.status(200).send({ status: true, message: 'Success', data: getData })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
};





const deleteCart = async function (req, res) {
    try {

        // Validate params
        userId = req.params.userId
        if (!isvalidObjectId(userId)) {
            return res.status(400).send({ status: false, message: `given userId: ${userId} is not valid` })
        }

        //  To check user is present or not
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
        return res.status(204).send({ status: true, message: 'Success', data: "Cart is deleted successfully" })

    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}