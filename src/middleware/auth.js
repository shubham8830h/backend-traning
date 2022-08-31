const auth = async function (req, res, next) {
  try {
    let token = req.headers["x-Auth-token"];
    if (!token) token = req.headers["x-auth-token"];
    if (!token)
      return res.send({ status: false, msg: "token must be present" });

    //token verify
    let decodedToken = jwt.verify(
      token,
      "functionup-plutonium-very-very-secret-key"
    );
    if (!decodedToken)
      return res.status(403).send({ status: false, msg: "token is invalid" });

    req.loggeduser = decodedToken.userId;
    next();
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

const authorizedUser = function (req, res, next) {
  try {
    let userId = req.params.userId;
    if (userId !== req.loggeduser) {
      return res
        .status(403)
        .send({ status: false, msg: "permission not user" });
    }
    next();
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

module.exports.auth = auth;
module.exports.authorizedUser = authorizedUser;
