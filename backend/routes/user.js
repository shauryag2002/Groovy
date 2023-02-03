const router = require("express").Router();
const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcrypt");
router.put("/:id", async (req, res) => {
  if (req.params.id == req.body.userId) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json("User not found");
      }
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashedPassword;
        const user1 = await User.findByIdAndUpdate(req.params.id, {
          $set: req.body,
        });
        res.status(200).json("Update user");
      } else {
        const user1 = await User.findByIdAndUpdate(req.params.id, {
          $set: req.body,
        });
        res.status(200).json("Update user");
      }
    } catch (err) {
      console.log(err);
    }
  } else {
    res.status(401).json("you can edit only your account");
  }
});
router.delete("/:id", async (req, res) => {
  if (req.body.userId == req.params.id) {
    const user = await User.findById(req.params.id);
    await user.remove();
    res.status(200).json("user deleted");
  } else {
    res.status(200).json("you can delete only your account");
  }
});
router.get("/", async (req, res) => {
  try {
    const userId = req.query.userId;
    const username = req.query.username;
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username });
    if (user) return res.status(200).json(user);
    res.status(404).json("user not find");
  } catch (err) {
    res.status(500).json(err);
  }
});
router.put("/:id/follow", async (req, res) => {
  if (req.params.id == req.body.userId) {
    return res.status(200).json("You cannot follow or unfollow yourself");
  } else {
    try {
      const usertofollow = await User.findById(req.params.id);
      const userfollowing = await User.findById(req.body.userId);
      // let t = false;
      for (let i = 0; i < usertofollow.followers.length; i++) {
        const element = usertofollow.followers[i];
        if (element.userId == req.body.userId) {
          await usertofollow.updateOne({
            $pull: {
              followers: {
                userId: req.body.userId,
                username: userfollowing.username,
                name: userfollowing.name,
                pic: userfollowing.profilePicture,
              },
            },
          });
          await userfollowing.updateOne({
            $pull: {
              followings: {
                userId: req.params.id,
                username: usertofollow.username,
                name: usertofollow.name,
                pic: usertofollow.profilePicture,
              },
            },
          });
          const updateUsertofollow = await usertofollow.save();
          return res.status(200).json({
            message: "user has been unfollowed",
            user: updateUsertofollow,
          });
          // t = true;
        }
      }

      if (!usertofollow.followers.find((u) => u.userId === req.body.userId)) {
        await usertofollow.updateOne({
          $push: {
            followers: {
              userId: req.body.userId,
              username: userfollowing.username,
              name: userfollowing.name,
              pic: userfollowing.profilePicture,
            },
          },
        });
        await userfollowing.updateOne({
          $push: {
            followings: {
              userId: req.params.id,
              username: usertofollow.username,
              name: usertofollow.name,
              pic: usertofollow.profilePicture,
            },
          },
        });
        const updateUsertofollow = await usertofollow.save();
        return res.status(200).json({
          message: "user has been followed",
          user: updateUsertofollow,
        });
      } else {
        return res.status(403).json({
          message: "you allready follow this user",
          user: usertofollow,
        });
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  }
});
router.put("/:id/unfollow", async (req, res) => {
  const usertofollow = await User.findById(req.params.id);
  const userfollowing = await User.findById(req.body.userId);
  if (req.params.id == req.body.userId) {
    return res.status(200).json("You cannot follow or unfollow yourself");
  } else {
    if (!usertofollow.followers.includes(req.body.userId)) {
      await usertofollow.updateOne({ $pull: { followers: req.body.userId } });
      await userfollowing.updateOne({ $pull: { followings: req.params.id } });
      res.status(200).json("user has been unfollowed");
    } else {
      res.status(403).json("you donot follow this user");
    }
  }
});
router.post("/:id/setfollow", async (req, res) => {
  try {
    const usertofollow = await User.findById(req.params.id);
    const userfollowing = await User.findById(req.body.userId);
    if (req.params.id == req.body.userId) {
      return res.status(200).json("You cannot follow or unfollow yourself");
    } else {
      for (let i = 0; i < usertofollow.followers.length; i++) {
        const element = usertofollow.followers[i];
        // console.log(req.body.userId);
        if (
          JSON.stringify(element.userId) === JSON.stringify(req.body.userId)
        ) {
          return res.status(200).json({ message: true, user: usertofollow });
        }
      }
      res.status(200).json({ message: false, user: usertofollow });
    }
  } catch (err) {
    res.json(err);
  }
});
router.get("/:id/name", async (req, res) => {
  const name = req.query.name;
  const names = await User.find({ name });
  res.status(200).json(names);
});
module.exports = router;
