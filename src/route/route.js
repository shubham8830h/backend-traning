const express = require("express");
const router = express.Router();

const collageController = require("../Controller/CollegeController");
const getcontroller = require("../Controller/getController");
const internscontroller = require("../Controller/InternController");


router.post("/functionup/colleges", collageController.createcollage);
router.post("/functionup/interns", internscontroller.createinterns);
router.get("/functionup/collegeDetails", getcontroller.getcollegeDetails);




module.exports = router;
