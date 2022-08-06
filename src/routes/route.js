const express = require("express");
const abc = require("../introduction/intro");
const xyz = require("../logger/logger");
const mno = require("../util/helper");
const def = require("../validator/formatter");
const router = express.Router();

router.get("/test-me", function (req, res) {
  console.log("My batch is", abc.name);
  abc.printName();

  res.send("My second ever api!");
});

router.get("/test-assgnment", function (req, res) {
  xyz.welcome();
  mno.dateprint();
  def.allfunction();
  res.send("This is the second routes implementation");
});

router.get("/give-me-students-data", function (req, res) {});
module.exports = router;
// adding this comment for no reason
