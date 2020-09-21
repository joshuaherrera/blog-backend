const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");

beforeEach(async () => {
  await Blog.deleteMany({});

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog);

    await blogObject.save();
  }
});

test("correct amount of blogs returned", async () => {
  const res = await api.get("/api/blogs");

  expect(res.body).toHaveLength(6);
});

test("id parameter is defined", async () => {
  const res = await api.get("/api/blogs");
  expect(res.body[0].id).toBeDefined();
});

test("blog is posted", async () => {
  const newBlog = {
    title: "test blog",
    author: "josh h",
    url: "www.jesus.com",
    likes: 99,
  };

  await api.post("/api/blogs").send(newBlog);
  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

  const authors = blogsAtEnd.map((b) => b.author);

  expect(authors).toContain("josh h");
});

test("if no likes, default to 0", async () => {
  const newBlog = {
    title: "test blog 2",
    author: "lucyg",
    url: "www.jesus.com",
  };

  const res = await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  expect(res.body.likes).toEqual(0);
});

test("if no title/url, get 400 response", async () => {
  const missingUrl = {
    title: "test blog 2",
    author: "lucyg",
    likes: 99,
  };
  await api.post("/api/blogs").send(missingUrl).expect(400);
  let blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);

  const missingTitle = {
    author: "lucyg",
    likes: 99,
    url: "google.com",
  };
  await api.post("/api/blogs").send(missingTitle).expect(400);
  blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
});

afterAll(() => {
  mongoose.connection.close();
});
