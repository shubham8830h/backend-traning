const express = require("express");
const router = express.Router();

router.get("/students/:name", function (req, res) {
  let studentName = req.params.name;
  console.log(studentName);
  res.send(studentName);
});

router.get("/random", function (req, res) {
  res.send("hi there");
});

router.get("/test-api", function (req, res) {
  res.send("hi FunctionUp");
});

router.get("/test-api-2", function (req, res) {
  res.send("hi FunctionUp. This is another cool API");
});

router.get("/test-api-3", function (req, res) {
  res.send(
    "hi FunctionUp. This is another cool API. And NOw i am bored of creating API's "
  );
});

router.get("/test-api-4", function (req, res) {
  res.send(
    "hi FunctionUp. This is another cool API. And NOw i am bored of creating API's. PLZ STOP CREATING MORE API;s "
  );
});

router.get("/test-api-5", function (req, res) {
  res.send(
    "hi FunctionUp5. This is another cool API. And NOw i am bored of creating API's. PLZ STOP CREATING MORE API;s "
  );
});

router.get("/test-api-6", function (req, res) {
  res.send({ a: 56, b: 45 });
});

router.post("/test-post", function (req, res) {
  res.send([23, 45, 6]);
});

router.post("/test-post-2", function (req, res) {
  res.send({ msg: "hi", status: true });
});

router.post("/test-post-3", function (req, res) {
  let id = req.body.user;
  let pwd = req.body.password;

  console.log(id, pwd);

  console.log(req.body);

  res.send({ msg: "hi", status: true });
});

router.post("/test-post-4", function (req, res) {
  let arr = [12, "functionup"];
  let ele = req.body.element;
  arr.push(ele);
  res.send({ msg: arr, status: true });
});

//Write a POST /players api that saves a player’s details and doesn’t allow saving the data of a player with a name that already exists in the data

let players = [
  {
    name: "manish",
    dob: "1/1/1995",
    gender: "male",
    city: "jalandhar",
    sports: ["swimming"],
  },
  {
    name: "gopal",
    dob: "1/09/1995",
    gender: "male",
    city: "delhi",
    sports: ["soccer"],
  },
  {
    name: "lokesh",
    dob: "1/1/1990",
    gender: "male",
    city: "mumbai",
    sports: ["soccer"],
  },
];

router.post("/test-student", function (req, res) {
  let newPlayer = req.body;
  let newplayerName = req.body.name;
  let flag = false;

  for (let i = 0; i < players.length; i++) {
    if (players[i].name == newplayerName) {
      flag = true;
      break;
    }
  }
  if (flag) {
    res.send("this is player allredy in player list");
  } else {
    players.push(newPlayer);
    res.send(players);
  }
});

//you will be given an array of persons ( 1.e an array of objects )..each person will have a (name: String, age: Number, votingStatus: true/false (Boolean)} take input in query param as votingAge..and for all the people above that age, change votingStatus as true also return an array consisting of only the person that can vote

let person = [
  {
    name: "PK",
    age: 10,
    votingStatus: false,
  },
  {
    name: "SK",
    age: 18,
    votingStatus: false,
  },
  {
    name: "AA",
    age: 25,
    votingStatus: false,
  },
  {
    name: "HO",
    age: 65,
    votingStatus: false,
  },
  {
    name: "SC",
    age: 35,
    votingStatus: false,
  },
];

router.post("/persone/:votetingAge", function (req, res) {
  let arr = [];
  let input = req.params.votetingAge;
  for (var i = 0; i < person.length; i++) {
    if (person[i].age >= input) {
      person[i].votingStatus = true;
      arr.push(person[i]);
    }
  }

  res.send({ "that person can vote": arr });

});

module.exports = router;
