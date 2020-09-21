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

blogsRouter.delete("/:id", async (req, res) => {
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
