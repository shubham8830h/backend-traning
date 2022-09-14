const jwt = require("jsonwebtoken");
const blogsModel = require("../model/blogsmodel.js");

const authorization1 = async function (req, res, next) {
  try {
    let token = req.headers["x-api-key"];

    let decodedToken = jwt.verify(token, "secret key");

    if (req.query.authorId) {
      if (req.query.authorId != decodedToken.userId)
        return res
          .status(401)
          .send({ status: false, msg: "The person is unauthorised" });

      next();
    }
    if (!req.query.authorId) {
      req.query.authorId = decodedToken.userId; //In the decodedtoken userId value put on query of authorId

      let blog = await blogsModel.find(req.query);

      if (blog.length == 0)
        return res
          .status(401)
          .send({ status: false, msg: "The person is unauthorised" });
      next();
    }
  } catch (error) {
    res.status(500).send({ status: false, error: error.message });
  }
};

module.exports.authorization1 = authorization1;
