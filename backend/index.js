const express = require("express");
const app = express();
const { db } = require("./models/User");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const postRoute = require("./routes/post");
const cors = require("cors");
app.use(cors());
mongoose
  .connect(
    "mongodb+srv://shaurya:shaurya@cluster0.bqbj0e4.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("database connected successfully");
  });
app.use(express.json());
app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use("/post", postRoute);
// mongoose.set("strictQuery", true);
app.get("/", function (req, res) {
  res.send({ message: "hello world" });
});
// db.sync()
// .then(
// function(){
app.listen("5000", function () {
  console.log("server started on http://localhost:5000");
  // })
});
// .catch(function(err){
//     console.error(err)
// })
