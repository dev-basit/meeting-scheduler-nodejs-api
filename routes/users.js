const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validate, validateResetPassword } = require("../models/user");
const express = require("express");
const router = express.Router();

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  user = new User(_.pick(req.body, ["name", "email", "password", "isAdmin"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  res.header("x-auth-token", token).send(_.pick(user, ["_id", "name", "email", "isAdmin"]));
});

router.put("/", async (req, res) => {
  try {
    const { error } = validateResetPassword(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    let user = req.body;
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    const updatedUser = await User.updateOne({ email: req.body.email }, user, {
      new: true,
    });
    if (!updatedUser) return res.status(404).json({ message: "User not found for given email." });

    return res.json(updatedUser);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", auth, async (req, res) => {
  const idOfUserToDelete = req.params.id;

  try {
    const deletedUser = await User.findOneAndDelete({ _id: idOfUserToDelete });
    if (!deletedUser) return res.status(404).json({ message: "User not found" });

    return res.json({ message: "User deleted successfully", deletedUser });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
