const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      max: 500,
    },
    img: {
      type: String,
    },
    likes: {
      type: Array,
      default: [],
    },
    comments: [
      {
        text: String,
        postedBy: { type: ObjectId, ref: "User" },
        postedByName: String,
      },
    ],
  },
  { timestamps: true },
  { typeKey: "$type" }
);

module.exports = mongoose.model("Post", PostSchema);
