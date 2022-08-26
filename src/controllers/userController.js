const userModel= require("../models/userModel")
// Write a POST api to create a user that takes user details from the request body. If the header isFreeAppUser is not present terminate the request response cycle with an error message that the request is missing a mandatory header. The value of field isFreeAppUser is determined by isFreeAppUser request header.


   //2 
    const basicCode= async function(req, res) {
     let createUser=req.body
    //  let request = req.headers.isfreeappuser;
    //  req.body.isFreeAppUser = req.headers["isfreeappuser"];
     const create=await userModel.create(createUser)
     res.send({msg: create})

    }



















const createUser= async function (req, res) {
    let data= req.body
    let savedData= await UserModel.create(data)
    res.send({msg: savedData})
}

const getUsersData= async function (req, res) {
    let allUsers= await UserModel.find()
    res.send({msg: allUsers})
}

module.exports.createUser= createUser
module.exports.getUsersData= getUsersData
module.exports.basicCode= basicCode