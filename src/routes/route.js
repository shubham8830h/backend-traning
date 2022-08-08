const express = require("express");
const lodash = require("lodash");
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

  let arr = [
    "januray",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ];
  let result = lodash.chunk(arr, 3);
  console.log(result);

  const arr2 = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
  let result2 = lodash.tail(arr2);
  console.log(result2);

  const arr3 = [1, 2, 3];
  const arr4 = [2, 3, 4];
  const arr5 = [3, 2, 1];
  const arr6 = [2, 1, 3];
  const arr7 = [2, 3, 1];
  const result3 = lodash.union(arr3, arr4, arr5, arr6, arr7);
  console.log(result3);

  const arr8 = [
    ["horror", "The Shining"],
    ["drama", "Titanic"],
    ["thriller", "Shutter Island"],
    ["fantasy", "Pans Labyrinth"],
  ];

  result4 = lodash.fromPairs(arr8);
  console.log(result4);

  res.send("This is the second routes implementation");
});

router.get("/give-me-students-data", function (req, res) {});
module.exports = router;
// adding this comment for no reason
