  mongoose
    .connect(
      "mongodb+srv://shubham1008H:M7QPGG6QlZFkt4Za@cluster0.ovhwygy.mongodb.net/shubham1008H",
      {
        useNewurlParser: true,
      }
    )
    .then(() => console.log("MongoDB is connected"))
    .catch((err) => console.log(err));

  res.send({ "that person can vote": arr });