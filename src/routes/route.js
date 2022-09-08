const express = require("express");
const router = express.Router();
const authorController = require("../controller/authorcontroller");
const blogsController = require("../controller/blogsController");
const {authentication,authorisation} = require("../middlewares/auth");


router.post("/authors", authorController.createAuthor);

router.post("/blogs", authentication, blogsController.createBlog);

router.get("/getblogs",authentication, blogsController.getBlogs);
router.put("/blogs/:blogId",authorisation,blogsController.updateBlogs);
router.get("/blogs/:blogId",authorisation,blogsController.deletedBlog);
router.delete("/blog",authentication,blogsController.deletedByQurey);
router.post("/login/token", authorController.login);

module.exports = router;
