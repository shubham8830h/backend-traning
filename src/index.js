const express = require('express'); // framework 
const bodyParser = require('body-parser');   
const route =require("./routes/route.js");
const mongoose  = require('mongoose');   // liberary 

const app = express();
const multer= require("multer");
app.use(bodyParser.json()); //
app.use( multer().any())


mongoose.connect("mongodb+srv://rakib123:rakib1234@cluster0.bwxs7wf.mongodb.net/group25Database", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )

 
 app.use('/', route);


app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});


