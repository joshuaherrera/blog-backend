const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  // start at 0, add all likes
  return blogs.reduce((allLikes, blog) => allLikes + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return {};
  }
  let mostLikes = blogs[0].likes;
  let favBlog = {
    author: blogs[0]["author"],
    title: blogs[0]["title"],
    likes: blogs[0]["likes"],
  };
  blogs.forEach((blog) => {
    if (blog.likes > mostLikes) {
      mostLikes = blog.likes;
      favBlog["author"] = blog["author"];
      favBlog["title"] = blog["title"];
      favBlog["likes"] = blog["likes"];
    }
  });
  return favBlog;
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return {};
  }
  let counts = new Map();
  blogs.forEach((blog) => {
    if (counts.get(blog.author) !== undefined) {
      let c = counts.get(blog.author) + 1;
      counts.set(blog.author, c);
    } else {
      counts.set(blog.author, 1);
    }
  });
  let auth = "";
  let most = 1;
  counts.forEach((v, k) => {
    if (v >= most) {
      most = v;
      auth = k;
    }
  });
  return { author: auth, blogs: most };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return {};
  }
  let counts = new Map();
  blogs.forEach((blog) => {
    if (counts.get(blog.author) !== undefined) {
      let c = counts.get(blog.author) + blog.likes;
      counts.set(blog.author, c);
    } else {
      counts.set(blog.author, blog.likes);
    }
  });
  let auth = "";
  let most = 1;
  counts.forEach((v, k) => {
    if (v >= most) {
      most = v;
      auth = k;
    }
  });
  return { author: auth, likes: most };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
