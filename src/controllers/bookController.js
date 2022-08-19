const { count } = require("console");
const BookModel = require("../models/bookModel");
const autherModel = require("../models/auther");
const bookModel = require("../models/bookModel");
const assert = require("assert");
const auther = require("../models/auther");

// 1 Write down the schemas for book and authors (keeping the data given below in mind). Also create the documents (corresponding to the data given below) in your database.
// Write create APIs for both books and authors ---> If author_id is not available then do not accept the entry(in neither the author collection nor the books collection)

const createBook = async function (req, res) {
  let data = req.body;
  let idrequired = req.body.author_id;
  if (!idrequired) {
    return res.send({ msg: "auther id is required" });
  }

  let savedData = await BookModel.create(data);
  res.send({ msg: savedData });
};

const createBookAuthors = async function (req, res) {
  let data = req.body;
  let idrequired = data.author_id;
  if (!idrequired) {
    return res.send({ msg: "auther id is required" });
  }
  let savedDataAuther = await autherModel.create(data);
  res.send({ msg: savedDataAuther });
};

// ========================================2========================================
// 2 List out the books written by "Chetan Bhagat" ( this will need 2 DB queries one after another- first query will find the author_id for "Chetan Bhagat”. Then next query will get the list of books with that author_id )

const listChetan = async function (req, res) {
  let listauther = await autherModel
    .find({ author_name: "Chetan Bhagat" })
    .select({ author_id: 1 });
  let listbook = await BookModel.find({
    author_id: { $eq: listauther[0].author_id },
  });
  res.send({ msg: listbook });
};

// =========================================3=========================================
// 3 find the author of “Two states” and update the book price to 100;  Send back the author_name and updated price in response.  ( This will also need 2  queries- 1st will be a findOneAndUpdate. The second will be a find query aith author_id from previous query)

const twoStates = async function (req, res) {
  let bookprice = await BookModel.findOneAndUpdate(
    { name: "Two states" },
    { $set: { price: 100 } }
  );
  let authorupdate = await autherModel
    .find({ author_id: { $eq: bookprice.author_id } })
    .select({ author_name: 1, _id: 0 });
  res.send({ bookprice, authorupdate });
};
// ======================================4===================================================
// Find the books which costs between 50-100(50,100 inclusive) and respond back with the author names of respective books..

const range = async function (req, res) {
  let booklist = await BookModel.find({
    price: { $gte: 50, $lte: 100 },
  });
  let a = booklist.map((a) => a.author_id);
  let result = await autherModel
    .find({ author_id: a })
    .select({ author_name: 1, _id: 0 });
  res.send({ msg: result });
};

module.exports.createBookAuthors = createBookAuthors;
module.exports.createBook = createBook;
module.exports.twoStates = twoStates;
module.exports.range = range;
module.exports.listChetan = listChetan;
