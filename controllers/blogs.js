const blogsRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const Blog = require("../models/blog");
const User = require("../models/user");
const logger = require("../utils/logger");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });

  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  let body = request.body;
  if (body.likes === undefined) {
    body.likes = 0;
  }
  if (body.title === undefined) {
    return response.status(400).end();
  }
  if (body.url === undefined) {
    return response.status(400).end();
  }
  const token = request.token;

  const decodedToken = jwt.verify(token, process.env.SECRET);

  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: "token missing or invalid" });
  }

  const user = await User.findById(decodedToken.id);

  const newBlog = {
    title: body.title,
    likes: body.likes,
    url: body.url,
    author: body.author,
    user: user._id,
  };

  const blog = new Blog(newBlog);

  const result = await blog.save();
  user.blogs = user.blogs.concat(result._id);
  await user.save();

  response.status(201).json(result);
});

blogsRouter.delete("/:id", async (req, res) => {
  const token = req.token;
  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!token || !decodedToken.id) {
    return res.status(401).json({ error: "token missing or invalid" });
  }
  // look for user with token
  const user = await User.findById(decodedToken.id);
  if (!user) {
    return res.status(401).json({ error: "user not found" });
  }
  // query blog and grab user, then compare
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    return res.status(400).json({ error: "blog not found" });
  }
  const userId = user._id;
  if (blog.user.toString() !== userId.toString()) {
    return res.status(401).json({ error: "invalid permissions for deletion" });
  }
  // since everything is good, we can DELET
  await Blog.findByIdAndRemove(req.params.id);
  res.status(204).end();
});

blogsRouter.put("/:id", async (req, res, next) => {
  const body = req.body;

  const blog = {
    title: body.title,
    url: body.url,
    likes: body.likes,
    author: body.author,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, {
    new: true,
  });
  res.json(updatedBlog);
});

module.exports = blogsRouter;
