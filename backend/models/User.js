const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    username: {
      type: String,
      require: true,
      min: 3,
      max: 20,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    followers: [
      {
        name: String,
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        username: String,
        pic: String,
      },
    ],
    followings: [
      {
        name: String,
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        username: String,
        pic: String,
      },
    ],
    desc: {
      type: String,
      max: 50,
    },
    city: {
      type: String,
      max: 50,
    },
    relationship: {
      type: Number,
      enum: [1, 2, 3],
    },
  },
  { timestamps: true },
  { typeKey: "$type" }
);
module.exports = new mongoose.model("User", userSchema);
