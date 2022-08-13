const express = require("express");
const bodyParser = require("body-parser");
const route = require("./routes/route.js");
const app = express();
const mongoose = require("mongoose");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect(
    "mongodb+srv://shubham108h:0qT2Cnyjo6cTAji1@cluster0.ovhwygy.mongodb.net/shubham108h?retryWrites=true&w=majority",
    {
      useNewurlParser: true,
    }
  )
  .then(() => console.log("MongoDB is connected"))
  .catch((err) => console.log(err));

app.use("/", route);

app.listen(process.env.PORT || 3000, function () {
  console.log("Express app running on port " + (process.env.PORT || 3000));
});
