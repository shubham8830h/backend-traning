const express = require("express");
const router = express.Router();

const UserController = require("../controllers/userController");
const BookController = require("../controllers/bookController");
const bookModel = require("../models/bookModel");

router.get("/test-me", function (req, res) {
  res.send("My first ever api!");
});



router.post("/createBook", BookController.createBook);

router.get("/getBooksData", BookController.getBooksData);
router.get("/booklist", BookController.bookList);
router.post("/bookyear", BookController.getBooksInYear);
router.post("/particularBooks", BookController.getParticularBooks);
router.get("/getBooks/indianPrice", BookController.getXINRBooks);
router.get("/randomBooks", BookController.getRandomBooks);

module.exports = router;
