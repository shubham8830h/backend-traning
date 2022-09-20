const collegeModel = require("../Model/collegeModel");

const InternModel = require("../Model/InternModel");

const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length > 0) return true;
  return false;
};

const isValidRequest = function (object) {
  return Object.keys(object).length > 0;
};

const createinterns = async function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    const nameregex = /^[a-zA-Z , ]*$/;
    const emailregex = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;

    const mobileregex = /^([6-9]\d{9})$/;
    let reqquery = req.query;
    if (isValidRequest(reqquery))
      return res.status(400).send({ status: false, msg: "invalidRequest" });

    let interdata = req.body;
    // if body is empty
    if (!isValidRequest(interdata))
      return res
        .status(400)
        .send({ status: false, msg: "body should not be empty" });

    // checking if name is present
    if (!isValid(interdata.name))
      return res.status(400).send({ status: false, msg: "name is required" });

    // mathing name with regex
    if (!interdata.name.match(nameregex))
      return res
        .status(400)
        .send({ status: false, msg: "name must be a valid format" });
    // checking name is unique
    const isnameAlreadyUsed = await InternModel.findOne({
      name: interdata.name,
    });
    if (isnameAlreadyUsed) {
      return res
        .status(400)
        .send({ status: false, msg: "name is already registered" });
    }
    // email is present
    if (!isValid(interdata.email))
      return res.status(400).send({ status: false, msg: "email is required" });
    // mathing email with regex
    if (!interdata.email.match(emailregex))
      return res
        .status(400)
        .send({ status: false, msg: "email must in valid format" });
    // checking email is unique
    const isEmailAlreadyUsed = await InternModel.findOne({
      email: interdata.email,
    });
    if (isEmailAlreadyUsed) {
      return res
        .status(400)
        .send({ status: false, msg: "email already registered" });
    }
    // mobile is present
    if (!isValid(interdata.mobile))
      return res
        .status(400)
        .send({ status: false, msg: "mobile number must be prasent" });
    //  validating mobile no
    if (!interdata.mobile.match(mobileregex))
      return res
        .status(400)
        .send({ status: false, msg: "mobile number must be a valid format" });
    // mobile should be unique
    const isMobileAlreadyUsed = await InternModel.findOne({
      mobile: interdata.mobile,
    });
    if (isMobileAlreadyUsed) {
      return res
        .status(400)
        .send({ status: false, msg: "mobile number already registered" });
    }

    // ***********************validation end***************************//

    let checkName = await collegeModel.findOne({ name: interdata.collegeName });
    if (!checkName)
      return res.status(404).send({ status: false, msg: "college not found" });
    //
    let id = checkName._id;
    //
    let create = {};
    create.name = interdata.name;
    create.email = interdata.email;
    create.mobile = interdata.mobile;
    create.collegeId = id;
    let createinterns = await InternModel.create(create);
    return res
      .status(201)
      .send({
        status: true,
        message: "interns created successfully",
        data: createinterns,
      });
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, msg: "server error", error: err.message });
  }
};

module.exports.createinterns = createinterns;
