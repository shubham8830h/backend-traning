const { all } = require("../routes/route");

const trimName = "     Functionup      ";

const casechangelower = "SHUBHAM ";

const casechangehiger = "shubham";

const allfunction = function () {
  console.log("To string applying trim Functionup : " + trimName.trim());
  console.log(
    "To string convert lower case SHUBHAM TO :" + casechangelower.toLowerCase()
  );
  console.log(
    "To string convert upper case shubham TO : " + casechangehiger.toUpperCase()
  );
};

module.exports.allfunction = allfunction;
