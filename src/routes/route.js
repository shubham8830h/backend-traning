const express = require("express");
const router = express.Router();
// const UserModel= require("../models/userModel.js")
const UserController = require("../controllers/userController");
const BookController = require("../controllers/bookController");

const bookModel = require("../models/bookModel");

router.get("/test-me", function (req, res) {
  res.send("My first ever api!");
});

router.post("/createBook", BookController.createBook);

router.post("/createAutherInfo", BookController.createBookAuthors);
router.get("/findauther",BookController.twoStates)
router.get("/rangebook", BookController.range);
router.get("/listchentan",BookController.listChetan)


module.exports = router;
