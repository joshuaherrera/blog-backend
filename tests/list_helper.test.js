const listHelper = require("../utils/list_helper");
const listWithOneBlog = [
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    likes: 5,
    url:
      "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    __v: 0,
  },
];
const listWithManyBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 8,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url:
      "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    likes: 12,

    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    __v: 0,
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url:
      "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0,
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url:
      "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0,
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0,
  },
];

test("dummy returns one", () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  expect(result).toBe(1);
});

describe("total likes", () => {
  test("when list has only one blog, equals the likes of that", () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    expect(result).toBe(5);
  });

  test("of empty list is zero", () => {
    expect(listHelper.totalLikes([])).toBe(0);
  });

  test("of a bigger list is calculated right", () => {
    expect(listHelper.totalLikes(listWithManyBlogs)).toBe(37);
  });
});

describe("favorite blog", () => {
  test("when list has only one blog, return that blog", () => {
    expect(listHelper.favoriteBlog(listWithOneBlog)).toEqual({
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      likes: 5,
    });
  });

  test("of a bigger list, return with most likes", () => {
    expect(listHelper.favoriteBlog(listWithManyBlogs)).toEqual({
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12,
    });
  });

  test("of empty list is empty map", () => {
    expect(listHelper.favoriteBlog([])).toEqual({});
  });
});

describe("most blogs", () => {
  test("of one blog, return that author", () => {
    expect(listHelper.mostBlogs(listWithOneBlog)).toEqual({
      author: "Edsger W. Dijkstra",
      blogs: 1,
    });
  });

  test("of many blogs, return right author", () => {
    expect(listHelper.mostBlogs(listWithManyBlogs)).toEqual({
      author: "Robert C. Martin",
      blogs: 3,
    });
  });

  test("of zero blogs, return empty map", () => {
    expect(listHelper.mostBlogs([])).toEqual({});
  });
});

describe("most likes", () => {
  test("of one blog, return likes", () => {
    expect(listHelper.mostLikes(listWithOneBlog)).toEqual({
      author: "Edsger W. Dijkstra",
      likes: 5,
    });
  });

  test("of many blogs, return most likes", () => {
    expect(listHelper.mostLikes(listWithManyBlogs)).toEqual({
      author: "Edsger W. Dijkstra",
      likes: 17,
    });
  });

  test("of zero blogs, return empty object", () => {
    expect(listHelper.mostLikes([])).toEqual({});
  });
});
