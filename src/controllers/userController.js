const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");



//1
const createUser = async function (req, res) {
  
  let data = req.body;
  let savedData = await userModel.create(data);
  res.send({ msg: savedData });
};

//2
const loginUser = async function (req, res) {
  let userName = req.body.emailId;
  let password = req.body.password;

  let user = await userModel.findOne({ emailId: userName, password: password });
  if (!user)
    return res.send({
      status: false,
      msg: "username or the password is not corerct",
    });

  
  let token = jwt.sign(
    {
      userId: user._id.toString(),
      batch: "plutonium",
      organisation: "FunctionUp",
      date:"18/7/2022"
    },
    "functionup-plutonium-very-very-secret-key"
  );
  // res.setHeader("x-auth-token", token);
  res.send({ status: true, token: token });
};

//3
const getUserData = async function (req, res) {
  
  let userId = req.params.userId;
  let userDetails = await userModel.findById(userId);
  if (!userDetails)
    return res.send({ status: false, msg: "No such user exists" });

  res.send({ status: true, data: userDetails });
  
};

//4
const updateUser = async function (req, res) {
 
  let userId = req.params.userId;
  let user = await userModel.findById(userId);
  //Return an error if no user with the given id exists in the db
  if (!user) {
    return res.send("No such user exists");
  }

  let userData = req.body;
  let updatedUser = await userModel.findOneAndUpdate({ _id: userId }, userData);
  res.send({ status: updatedUser, data: updatedUser });
};
//5
const deleteMetod=async function(req,res){
    let userId=req.params.userId
    let userfind = await userModel.findOneAndUpdate(
      {_id:userId },
      {$set:{isDeleted:true}}
    );
    
  res.send({status:true, msg: userfind });
}
module.exports.createUser = createUser;
module.exports.getUserData = getUserData;
module.exports.updateUser = updateUser;
module.exports.loginUser = loginUser;
module.exports.deleteMetod=deleteMetod
