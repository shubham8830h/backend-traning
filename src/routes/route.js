const express = require('express')
const router = express.Router()
const userController = require('../controller/userController')
const aws =  require("../middleware/aws")



router.post('/register',userController.createUser)
router.post('/login',userController.userlogin)
router.get('/user/:userId/profile' , userController.getuserprofile)
router.put('/user/:userId/profile',userController.updateprofile)
    




router.all("/**",  (req, res) => {
    res.status(400).send({ status: false, msg: "The api you request is not available" })
});






module.exports = router