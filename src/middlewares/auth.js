const jwt = require("jsonwebtoken");

let authentication = function (req, res, next) {
  let token = req.headers["x-api-key"];
  if (!token) {
    return res.status(400).send({ msg: "token mustbe present" });
  }
  let tokenVerfiy = jwt.verify(token, "this-is-secret-key");
  if (!tokenVerfiy) {
    return res.status(400).send({ msg: "token is invalid" });
  }

  next();
};

const authorisation = function (req, res, next) {
  try {
    let token = req.headers["x-api-key"];

    if (!token)
      return res
        .status(400)
        .send({ status: false, msg: "token must be present" });
    let decodedToken = jwt.verify(token, "this-is-secret-key");
    let userTobeModified = req.query.authorid;
    let userLoggedIn = decodedToken.authorId;

    if (!decodedToken)
      return res.status(401).send({ status: false, msg: "token is invalid" });
    if (userTobeModified != userLoggedIn)
      return res
        .status(403)
        .send({ status: false, msg: "You are not Authorized" });

    next();
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};

module.exports.authentication = authentication;
module.exports.authorisation = authorisation;
