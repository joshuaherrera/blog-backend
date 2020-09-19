const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  // start at 0, add all likes
  return blogs.reduce((allLikes, blog) => allLikes + blog.likes, 0);
};

module.exports = {
  dummy,
  totalLikes,
};
