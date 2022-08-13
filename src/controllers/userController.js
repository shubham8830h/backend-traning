const usermodule = require("../moduels/userModuels");

const createNewuser = async function (req, res) {
  let data = req.body;
  let savaData = await usermodule.create(data);
  res.send({ msg: savaData });
};

const getUserData = async function (req, res) {
  let alluser = await usermodule.find();
  res.send({ msg: alluser });
};

module.exports.createNewuser = createNewuser;
module.exports.getUserData = getUserData;
