const jwt = require("jsonwebtoken");

// const jwt = require(JsonWebTokenError);
const auth = async function (req, res, next) {
  let token = req.headers["x-Auth-token"];
  if (!token) token = req.headers["x-auth-token"];
  if (!token) return res.send({ status: false, msg: "token must be present" });

  //token verify
  let decodedToken = jwt.verify(
    token,
    "functionup-plutonium-very-very-secret-key"
  );
  if (!decodedToken)
    return res.send({ status: false, msg: "token is invalid" });

  req.loggeduser = decodedToken.userId;
  next();
};

const authorizedUser = function (req, res, next) {
  let userId = req.params.userId;
  if (userId !== req.loggeduser) {
    return res.send({ status: false, msg: "permission not user" });
  }
  next();
};

module.exports.auth = auth;
module.exports.authorizedUser = authorizedUser;
