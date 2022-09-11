const express = require('express');
const router = express.Router();
const authorController = require('../controller/authorcontroller');
const blogsController = require('../controller/blogsController');


const m1authentication=require("../middleware/auth1")
const m2Authorisation=require("../middleware/auth2")
const m3Authorisation=require("../middleware/auth3")


router.post('/authors', authorController.createAuthor)

router.post('/login', authorController.authorLogin)

router.post('/blogs',m1authentication.authentication, blogsController.createBlog)  // handeler function 

router.get('/getBlogs',m1authentication.authentication, blogsController.getAllBlogs)

router.put('/blogs/:blogId',m1authentication.authentication, m2Authorisation.authorization,blogsController.updatedBlogsData)

router.delete('/blogs/:blogId',m1authentication.authentication,m2Authorisation.authorization, blogsController.deletedByParams)

router.delete('/blog',m3Authorisation.authorization1,blogsController.deleteByQuery)


module.exports = router;