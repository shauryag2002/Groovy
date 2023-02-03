const router = require("express").Router();
const mongoose = require("mongoose");
const Post = require("../models/Post");
const User = require("../models/User");
//get all post
router.get("/", async (req, res) => {
  const post = await Post.find();
  res.json(post);
});
//create a post
router.post("/", async (req, res) => {
  const post = new Post(req.body);
  await post.save();
  res.json(post);
});
//update a post
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });
    const postUpdated = await post.save();
    res.status(200).json(postUpdated);
  } catch (err) {
    console.log(err);
  }
});
//delete a post
router.delete("/:id", async (req, res) => {
  const post = await Post.findByIdAndDelete(req.params.id);
  res.json("post has been deleted");
});
//like / dislike a post
router.post("/:id/like", async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (post.likes.includes(req.body.userId)) {
    await post.updateOne({ $pull: { likes: req.body.userId } });
    const liked = await post.save();
    res.json(liked);
  } else {
    await post.updateOne({ $push: { likes: req.body.userId } });
    const liked = await post.save();
    await post.save();
    res.json(liked);
  }
});
//get a post
router.get("/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);
  res.json(post);
});
//get user's all posts
router.get("/profile/:username", async (req, res) => {
  //   const user = await User.findOne({ username: req.params.username });
  //   const post = await Post.find({ userId: user._id });
  const user = await User.findOne({ username: req.params.username });
  if (!user) {
    return res.json({ error: "user not found" });
  }
  const posts = await Post.find({ userId: user._id });
  res.json(posts);
});
// comment on a post
router.put("/:id/comment", async (req, res) => {
  const comment = {
    text: req.body.text,
    postedBy: req.body.postedBy,
    postedByName: req.body.postedByName,
  };
  const post = await Post.findByIdAndUpdate(req.params.id, {
    $push: { comments: comment },
  });
  const addedComment = await post.save();
  res.json(addedComment);
});
//get timeline posts
router.get("/timeline/:userId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    const userPosts = await Post.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    res.status(200).json(userPosts.concat(...friendPosts));
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
