const express = require('express')
const router = express.Router()
const userController = require('../controller/userController')



router.post('/login',userController.userlogin)
router.get('/user/:userId/profile' , userController.getuserprofile)












module.exports = router