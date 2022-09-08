const authormodel = require("../model/authormodel");
const blogsModel = require("../model/blogsmodel");

const createBlog = async (req, res) => {
  try {
    let blogData = req.body;
    let { title, body, authorId, tags, category, subcategory, isPublished } =
      blogData;
    let validAuthorId = await authormodel.findById(authorId);
    if (!validAuthorId) {
      return res
        .status(400)
        .send({ status: false, msg: "userId is not valid" });
    }
    let blogDatas = {
      title: title,
      body: body,
      authorId: authorId,
      tags: tags,
      category: category,
      subcategory: subcategory,
      isPublished: isPublished ? isPublished : false,
      publishedAt: isPublished ? new Date() : null,
    };
    //Blogs creation
    let savedData = await blogsModel.create(blogDatas);
    return res.status(201).send({ status: true, data: savedData });
  } catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
};

const getBlogs = async function (req, res) {
  let data = req.query;
  let getData = await blogsModel
    .find({ $and: [{ isDeleted: false }, { isPublished: true }, data] })
    .populate("authorId");

  if (!getData) {
    return res.status(400).send({ status: false, msg: " not valid" });
  }
  res.status(201).send({ status: true, data: getData });
};

const updateBlogs = async function (req, res) {
  try {
    let getId = req.params.blogId;
    let data = req.body;
    let checkId = await blogsModel.findOne({ _id: getId });
    if (checkId) {
      if (checkId.isDeleted === false) {
        let checkData = await blogsModel.findByIdAndUpdate(getId, {
          $push: { tags: data.tags, subcategory: data.subcategory },
          title: data.title,
          category: data.category,
          publishedAt: Date.now(),
        },{new:true});
        res.status(200).send({ status: true, data: checkData });
      } else {
        res.status(404).send("file may be not present or Deleted");
      }
    } else {
      res
        .status(404)
        .send({ status: false, msg: "please enter valid blog id" });
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const deletedBlog = async function (req, res) {
  try {
    let blogid = req.params.blogId;
    if (!blogid) {
      return res.status(400).send({ msg: "blogId is not valid" });
    }
    let findBlockid = await blogsModel.findById(blogid);
    if (!findBlockid) {
      return res.status(404).send({ msg: " block is not exits" });
    }
    if (findBlockid["isDeleted"] == false) {
      let finddata = await blogsModel.findOneAndUpdate(
        { _id: blogid },
        { $set: { isDeleted: true, deletedAt: Date.now() } },
        { new: true }
      );
      res.status(200).send({ staus: true });
    } else {
      res.status(404).send({ msg: "file is allredy deleted" });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send(err.message);
  }
};

const deletedByQurey = async function (req, res) {
  try {
    let data = req.query;
    let alldata = await blogsModel.findOne(data);
    if (!alldata) {
      res.status(404).send({ msg: "document doesen't exit" });
    }
    if (alldata.isDeleted == true) {
      return res.status(404).send({ msg: "document allredy exits" });
    }
    let dataget = await blogsModel.findOneAndUpdate(
      { isDeleted: false },
      { $set: { isDeleted: true, deletedAt: Date.now() } },
      { new: true }
    );
    res.status(200).send({ msg: dataget });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports.createBlog = createBlog;
module.exports.getBlogs = getBlogs;
module.exports.updateBlogs = updateBlogs;
module.exports.deletedBlog = deletedBlog;
module.exports.deletedByQurey = deletedByQurey;
