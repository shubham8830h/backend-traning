const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

/*
  Read all the comments multiple times to understand why we are doing what we are doing in login api and getUserData api
*/

//1
const createUser = async function (req, res) {
  try {
    let data = req.body;
    if (data) {
      let savedData = await userModel.create(data);
      res.status(201).send({ msg: savedData });
    } else res.status(400).send({ msg: "Bad request" });
  } catch (err) {
    res.status(500).send({error:err.message});
  }
};

//2
const loginUser = async function (req, res) {
  try{
  let userName = req.body.emailId;
  let password = req.body.password;

  let user = await userModel.findOne({ emailId: userName, password: password });
  if (!user)
    return res.status(403).send({
      status: false,
      msg: "username or the password is not corerct",
    });
  
  // Once the login is successful, create the jwt token with sign function
  // Sign function has 2 inputs:
  // Input 1 is the payload or the object containing data to be set in token
  // The decision about what data to put in token depends on the business requirement
  // Input 2 is the secret (This is basically a fixed value only set at the server. This value should be hard to guess)
  // The same secret will be used to decode tokens
  let token = jwt.sign(
    {
      userId: user._id.toString(),
      batch: "plutonium",
      organisation: "FunctionUp",
      date: "18/7/2022",
    },
    "functionup-plutonium-very-very-secret-key"
  ); 
  // res.setHeader("x-auth-token", token);
  res.status(200).send({ status: true, token: token });
}catch(err){
 res.status(500).send({error:err.message})
}
}

//3
const getUserData = async function (req, res) {
  // let token = req.headers["x-Auth-token"];
  // if (!token) token = req.headers["x-auth-token"];

  // //If no token is present in the request header return error. This means the user is not logged in.
  // if (!token) return res.send({ status: false, msg: "token must be present" });

  // console.log(token);
try{
  let userId = req.params.userId;
  let userDetails = await userModel.findById(userId);
  if (!userDetails)
    return res.status(401).send({ status: false, msg: "No such user exists" });

  res.send({ status: true, data: userDetails });
  // Note: Try to see what happens if we change the secret while decoding the token
}catch(err){
  res.status(500).send({error:err.message})
}
}

//4
const updateUser = async function (req, res) {
  try{
  let userId = req.params.userId;
  let user = await userModel.findById(userId);
  //Return an error if no user with the given id exists in the db
  if (!user) {
    return res.status(401).send("No such user exists");
  }

  let userData = req.body;
  let updatedUser = await userModel.findOneAndUpdate({ _id: userId }, userData);
  res.status(201).send({ status: updatedUser, data: updatedUser });
}catch(err){
res.status(500).send({error:err.message})
}
}
//5
const deleteMetod = async function (req, res) {
  try{
  let userId = req.params.userId;
  let userfind = await userModel.findOneAndUpdate(
    { _id: userId },
    { $set: { isDeleted: true } }
  );

  res.status(200).send({ status: true, msg: userfind });
}catch(err){
  res.status(500).send({error:err.message})
}
}
module.exports.createUser = createUser;
module.exports.getUserData = getUserData;
module.exports.updateUser = updateUser;
module.exports.loginUser = loginUser;
module.exports.deleteMetod = deleteMetod;
