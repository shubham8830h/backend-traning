const orderModule=require("../models/documentModel")
const userModel=require("../models/userModel")
const productModel = require("../models/productModel");
// const  use  = require("../routes/route");
// Write a POST api for order purchase that takes a userId and a productId in request body. If the header isFreeAppUser is not present terminate the request response cycle with an error message that the request is missing a mandatory header
//  If the header is present the control goes to the request handler. 
// Perform the user and product validation. Check if the user exists as well as whether the product exists. Return an error with a suitable error message if either of these validations fail For every purchase we save an order document in the orders collection. 
//isFreeAppUser property in an Order document depends on the header isFreeAppUser. If the isFreeAppUser header is true then the balance of the user is not deducted and the amount in order is set to 0 as well the attribute in order isFreeAppUser is set to true. If this header has a false value then the product’s price is checked. This value is deducted from the user’s balance and the order amount is set to the product’s price as well as the attrbiute isFreeAppUser is set to false in order document.

const orderPurches=async function(req,res){
  let productExit=req.body
  if(productExit.isFreeAppUser==true){
    productExit.amount=0
    let data =await orderModule.create(productExit)
    return res.send({msg:data})
  }
      let product=await productModel.findOne({_id:productExit.productId}).select({prices:1,_id:0})
      let price=product.prices
  
      let user=await userModel.findOne({_id:productExit.userId}).select({balance:1,_id:0})

      let balance=user.balance
  if(price <= balance){
     await userModel.findOneAndUpdate({_id:productExit.userId},{$inc:{balance:-(price)}})
   
     let data=await orderModule.create(productExit)
      res.send({msg:data})
  }
  else{
     res.send({msg:"insufficient balance"})
  }
}

module.exports.orderPurches=orderPurches