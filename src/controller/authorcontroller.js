const authorModel = require("../model/authormodel");
const jwt = require("jsonwebtoken");

const createAuthor = async function (req, res) {
  try {
    let author = req.body;
    let duplicate = await authorModel.findOne({ email: author.email });
    if (duplicate) {
      return res.status(400).send({ status: false, msg: "mail already exist" });
    }
    let authorCreated = await authorModel.create(author);
    res.status(201).send({ data: authorCreated });
  } catch (err) {
    console.log("this is the error:", err.message);
    res.status(500).send({ msg: "error", error: err.message });
  }
};

const login = async function (req, res) {
  try {
    let userName = req.body.email;
    let password = req.body.password;

    let author = await authorModel.findOne({
      email: userName,
      password: password,
    });
    // console.log(author);
    if (!author) {
      return res.status(400).send("userId or password worng");
    }
    let token = jwt.sign(
      {
        authorId: author._id.toString(),
        project: "first",
      },
      "this-is-secret-key"
    );

    res.status(200).send({ status: true, msg: token });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports.createAuthor = createAuthor;
module.exports.login = login;
