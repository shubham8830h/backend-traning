const authorModel = require("../model/authormodel");

const jwt = require("jsonwebtoken");

//========================================= Author Create ========================================================//

const createAuthor = async function (req, res) {
  try {
    let author = req.body;
    if (Object.keys(author).length != 0) {
      let authorCreated = await authorModel.create(author);
      res.status(201).send({ status: true, data: authorCreated });
    } else return res.status(400).send({ msg: "BAD REQUEST" });
  } catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
};

//========================================== Login author ======================================================================//

const authorLogin = async (req, res) => {
  try {
    let userName = req.body.email;
    let pwd = req.body.password;
    let authorDeatails = await authorModel.findOne({
      email: userName,
      password: pwd,
    });
    if (!authorDeatails) {
      return res
        .status(400)
        .send({ status: false, msg: "Please signup first" });
    }
    // token create :-
    let token = jwt.sign(
      {
        userId: authorDeatails._id,
        Batch: "plutonium",
        Project1: "Group26",
      },
      "secret key"
    );
    res.status(201).send({ status: true, data: token });
  } catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
};

//=========================================== export the module ===================================================//

module.exports.createAuthor = createAuthor;

module.exports.authorLogin = authorLogin;
