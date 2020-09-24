const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");
const User = require("../models/user");
const bcrypt = require("bcrypt");

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

test("able to delete a blog", async () => {
  const newBlog = {
    title: "to be deleted",
    author: "lucyg",
    url: "www.jesus.com",
    likes: 9009,
  };
  const res = await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  expect(res.body.id).toBeDefined();

  const idToDelete = res.body.id;
  await api.delete(`/api/blogs/${idToDelete}`).expect(204);
  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
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

test("able to update blog", async () => {
  const newBlog = {
    title: "test update",
    author: "jazz",
    url: "www.jesus.com",
    likes: 1,
  };

  const post = await api.post("/api/blogs").send(newBlog).expect(201);

  const blogToUpdate = post.body.id;
  const updatedBlog = {
    title: "test update done",
    author: "jay",
    url: "www.jesussaves.com",
    likes: 777,
  };

  const res = await api
    .put(`/api/blogs/${blogToUpdate}`)
    .send(updatedBlog)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  // add id to do comparison at the end
  updatedBlog.id = blogToUpdate;
  expect(res.body).toEqual(updatedBlog);
});

describe("when there is initially one user in db", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({ username: "root", passwordHash });

    await user.save();
  });

  test("invalid user operations", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "root",
      name: "Superuser",
      password: "salainen",
    };
    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain("`username` to be unique");

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
