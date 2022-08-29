// const mid1 = function (req, res, next) {
//   req.falana = "hi there. i am adding something new to the req object";
//   console.log("Hi I am a middleware named Mid1");
//   next();
// };

const documentModel = require("../models/documentModel");
const productModel = require("../models/productModel");
const userModel = require("../models/userModel");

const mid2 = function (req, res, next) {
  let header = req.headers.isfreeappuser;
  if (!header) {
    return res.send({
      status: false,
      msg: "request is missing a mandatory header ",
    });
  }
  next();
};

const mid3 = async function (req, res, next) {
  let productExit = req.body;
  let productfind = await productModel.findById(productExit.productId);
  if (!productfind) {
    return res.send({ msg: "productid is not present" });
  }
  let userfind = await userModel.findById(productExit.userId);
  if (!userfind) {
    return res.send({ msg: "userid is not present" });
  }
  if (userfind && productfind) {
    next();
  }
};

module.exports.mid2 = mid2;
module.exports.mid3 = mid3;
