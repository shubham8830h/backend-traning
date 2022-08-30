const express = require('express');
const router = express.Router();
const userController= require("../controllers/userController");
const { auth, authorizedUser } = require('../middleware/auth');

router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})
//1
router.post("/users", userController.createUser  )
//2
router.post("/login", userController.loginUser)
//3
//The userId is sent by front end
router.get("/users/:userId",auth,authorizedUser,userController.getUserData)
//4
router.put("/users/:userId",auth,authorizedUser,userController.updateUser)
//5
router.get("/delete/users/:userId",auth,authorizedUser,userController.deleteMetod)
module.exports = router;