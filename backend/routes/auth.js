const Post = require("../models/Post");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const router = require("express").Router();
router.post("/register", async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  const username = await User.findOne({ username: req.body.username });
  if (!username) {
    if (!(await User.findOne({ email: req.body.email }))) {
      const user = await new User({
        ...req.body,
        password: hashedPassword,
      });
      await user.save();
      res.status(200).json({ user });
    } else {
      res.status(200).json({ error: "email is allready taken." });
    }
  } else {
    res.status(200).json({ error: "username is allready taken." });
  }
});
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (validPassword) {
      res.status(200).json(user);
    } else {
      res.status(200).json({ error: "password incorrect" });
    }
  } catch (err) {
    console.log(err);
  }
});
module.exports = router;
