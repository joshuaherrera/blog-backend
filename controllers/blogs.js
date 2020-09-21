const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});

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
  const blog = new Blog(body);

  const result = await blog.save();
  response.status(201).json(result);
});

module.exports = blogsRouter;
