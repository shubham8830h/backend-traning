
const productModel = require("../models/productModel")

//1 condtion
const createBook= async function (req, res) {
    let data= req.body
    let savedData= await productModel.create(data)
    res.send({msg: savedData})
}


module.exports.createBook = createBook

