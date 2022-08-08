const express = require("express");
const abc = require("../introduction/intro");
const router = express.Router();

router.get("/test-me", function (req, res) {
  console.log("My batch is", abc.name);
  abc.printName();
  logger.welcome();

  res.send("My second ever api!");
});

router.get("/students", function (req, res) {
  let students = ["Sabiha", "Neha", "Akash"];
  res.send(students);
});

router.get("/student-details/:name", function (req, res) {
  /*
    params is an attribute inside request that contains 
    dynamic values.
    This value comes from the request url in the form of an 
    object where key is the variable defined in code 
    and value is what is sent in the request
    */

  let requestParams = req.params;

  // JSON strigify function helps to print an entire object
  // We can use any ways to print an object in Javascript, JSON stringify is one of them
  console.log("This is the request " + JSON.stringify(requestParams));
  let studentName = requestParams.name;
  console.log("Name of the student is ", studentName);

  res.send("Dummy response");
});

//1
router.get("/movies", function (req, res) {
  let movieslist = ["KGF", "KGF2", "RRR", "pushpa"];
  res.send(movieslist);
});

//2
router.get("/GET/movies/:i", function (req, res) {
  let movies = ["KGF", "KGF2", "RRR", "pushpa"];

  let requestParams = req.params;
  let num = JSON.stringify(requestParams);
  let value = Object.values(requestParams);

  res.send(movies[value]);
});
//3
router.get("/get-movies:indexNumber", function (req, res) {
  let moviesno = ["KGF", "RRR", "puspa", "Don", "Batman"];
  let requestParams = req.params; //
  let num = JSON.stringify(requestParams);
  let value = Object.values(requestParams);

  if (value >= moviesno.length) {
    res.send("enter valid number");
  } else {
    res.send(moviesno[value]);
  }
});

//4
router.get("/GET/films", function (req, res) {
  let movies = [
    { id: 1, name: "KGF" },
    { id: 2, name: "RRR" },
    { id: 3, name: "pushpa" },
    { id: 4, name: "don" },
  ];

  res.send(movies);
});

//5
router.get("/GET/films:indexNumber", function (req, res) {
  const result = [
    {
      id: 1,
      name: "KGF",
    },
    {
      id: 2,
      name: "KGF2",
    },
    {
      id: 3,
      name: "pushpa",
    },
    {
      id: 4,
      name: "RRR",
    },
  ];
  let index = req.params.indexNumber;
  if (index > result.length) {
    return res.send("movies greater than length no id exit");
  } else {
    res.send(result[index]);
  }
});

module.exports = router;
