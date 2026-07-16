const dummy = (blogs) => {
  return 1
}

const likesOfBlogs = (blogs) => blogs.map(blog => blog.likes)

const totalLikes = (blogs) => {
  const likesArray = likesOfBlogs(blogs)

  const reducer = (sum, item) => {
    return sum + item
  }

  return blogs.length === 0
    ? 0
    : likesArray.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const likesArray = likesOfBlogs(blogs)
  const favoriteLikes = Math.max(...likesArray)

  return blogs.length === 0
    ? []
    : blogs.filter(blog => blog.likes === favoriteLikes)[0]
}

module.exports = {
  dummy, totalLikes, favoriteBlog
}