const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/create-newUser", userController.createNewuser);

router.get("/get-UserData", userController.getUserData);

module.exports = router;
