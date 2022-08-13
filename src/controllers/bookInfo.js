const bookModuels = require("../moduels/bookModuels");
// const bookModuels = require("../moduels/bookModuels");

const Newbookadd = async function (req, res) {
  let data = req.body;
  let savaData = await bookModuels.create(data);
  res.send({ msg: savaData });
};

const getAllBookList = async function (req, res) {
  let allBookList = await bookModuels.find();
  res.send({ msg: allBookList });
};

module.exports.Newbookadd = Newbookadd;
module.exports.getAllBookList = getAllBookList;
