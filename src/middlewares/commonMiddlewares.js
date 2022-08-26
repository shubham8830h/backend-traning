// const mid1 = function (req, res, next) {
//   req.falana = "hi there. i am adding something new to the req object";
//   console.log("Hi I am a middleware named Mid1");
//   next();
// };

const mid2 = function (req, res, next) {
 let header = req.headers.isfreeappuser;
 if (!header) {
   return res.send({
     status: false,
     msg: "request is missing a mandatory header ",
   });
 }
  next();
};

const mid3 = function (req, res, next) {
  let request = req.headers.isfreeappuser;
  if (!request) {
    return res.send({ status: true, msg: "headers is mandatory" });
  }
  next();
};

// const mid4 = function (req, res, next) {
//   console.log("Hi I am a middleware named Mid4");
//   next();
// };

// module.exports.mid1 = mid1;
module.exports.mid2 = mid2;
module.exports.mid3 = mid3;
// module.exports.mid4 = mid4;
