
const blogsModel = require("../model/blogsmodel");
let authorModel = require("../model/authormodel");
const { all } = require("../routes/route");

const createBlog = async (req, res) => {
  try {
    let blogData = req.body;
    let { title, body, authorId, tags, category, subcategory, isPublished } =
      blogData;
    let validAuthorId = await authorModel.findById(authorId);
    if (!validAuthorId) {
      return res.staus(400).send({ status: false, msg: "userId is not valid" });
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

const getAllBlogs = async (req, res) => {
  try{
  let blogData = req.query
  let allBlogs = await blogsModel
    .find({ $and: [{ isDeleted: false }, { isPublished: true }, blogData] })
    .populate("authorId");
  if (!allBlogs) {
    return res.status(400).send({ msg: "not valid" });
  }
  res.status(201).send({ status: true, msg: allBlogs });
}catch(err){
  res.status(500).send({staus:false,error:err.message})
}
}


const updatedBlogsData=async(req,res)=>{
  try{
let userData=req.params.blogId
let data=req.body
let validUserId=await blogsModel.findById({_id:userData})
if(!validUserId){
  res.status(404).send({status:false,msg:"invalid blog id"})
}
  if(validUserId.isPublished === true){
    let UpdatedData=await blogsModel.findByIdAndUpdate(userData,
      {$push:{tags:data.tags,subcategory: data.subcategory },
    title:data.title,category:data.category,publishedAt:Date.now()
    })
    res.status(200).send({status:true,data:UpdatedData})
  }
}catch(err){
  res.status(500).send({status:false,msg:err.message})
}
}


const deletedByParams=async(req,res)=>{
  try {
    let userData = req.params.blogId;
    if (!userData) {
      return res.status(400).send({ status: false, msg: "invalid blogId" });
    }
    let validUserId = await blogsModel.findById({ _id: userData });
    if (validUserId.isPublished === true || validUserId.isDeleted == true) {
      res
        .status(404)
        .send({ status: false, msg: "The blog document is not found" });
    }
    let allBlogs = await blogsModel.findOneAndUpdate(
      { isDeleted: false },
      { $set: { isDeleted: true, deletedAt: Date.now() } },
      { new: true }
    );
    return res.status(200).send({ status: true, msg: allBlogs });
  } catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
}


const deletedByQuray=async (req,res)=>{
  try{
  let data=req.query
let allBlogs= await blogsModel.findOne(data)
if(!allBlogs){
  res.status(400).send({status:false,msg:"invalid user id"})
}
if(data.isDeleted === true){
  res.status(404).send({status:false,msg:"incorrect data entered"})
}
let deletedData=await blogsModel.findOneAndUpdate({isDeleted:false},
  {$set:{isDeleted:true,deletedAt:Date.now()}},
  {new:true})
  res.status(200).send({status:true,msg:deletedData})
}catch(err){
  res.status(500).send({status:false,error:err.message})
}
}


module.exports.createBlog = createBlog;
module.exports.getAllBlogs = getAllBlogs;
module.exports.updatedBlogsData = updatedBlogsData;
module.exports.deletedByParams = deletedByParams;
module.exports.deletedByQuray = deletedByQuray;