const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookInfo");

router.post("/add-newbook", bookController.Newbookadd);

router.get("/get-booklistData", bookController.getAllBookList);

module.exports = router;
