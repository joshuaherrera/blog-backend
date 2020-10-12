const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.post("/", async (req, res) => {
  const body = req.body;

  if (!body.username || !body.password) {
    return res
      .status(401)
      .json({ error: "username and/or password is missing" });
  } else if (body.username.length < 3 || body.password.length < 3) {
    return res.status(401).json({
      error:
        "username and/or password is too short, minimum 3 characters required",
    });
  }
  const saltRounds = 10;

  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  });

  const savedUser = await user.save();

  res.json(savedUser);
});

usersRouter.get("/", async (req, res) => {
  const users = await User.find({}).populate("blogs", {
    title: 1,
    author: 1,
    url: 1,
  });

  res.json(users);
});

usersRouter.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id).populate("blogs", {
    title: 1,
    author: 1,
    url: 1,
  });
  if (!user) {
    return res.status(401).json({ error: "user not found" });
  }
  res.json(user);
});

module.exports = usersRouter;
