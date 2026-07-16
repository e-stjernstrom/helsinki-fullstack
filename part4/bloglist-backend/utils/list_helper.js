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

const mostAuthorAttribute = (blogs, attribute) => {
  if (blogs.length === 0) {
    return {
      author: undefined,
      [attribute]: NaN
    }
  } else if (
    !attribute in blogs[0]
  ) {
    console.log('triggered unknown attribute')
    return {
      author: undefined,
      [attribute]: NaN
    }
  }

  const authorSet = new Set();

  blogs.forEach((blog) => {
    authorSet.add(blog.author)
  })

  const authorRecords = [...authorSet].map(author => ({
    author,
    [attribute]: 0
  }))

  blogs.forEach((blog) => {
    const author = blog.author
    const authorRecord = authorRecords.find(record => record.author === author)
    if (typeof blogs[0][attribute] === 'number') {
      authorRecord[attribute] += blog[attribute]
    } else {
      authorRecord[attribute]++
    }
  })

  let mostRecord = authorRecords[0]

  authorRecords.forEach(record => {
    if (record[attribute] > mostRecord[attribute]) {
      mostRecord = record
    }
  })

  return mostRecord
}

const mostBlogs = (blogs) => (mostAuthorAttribute(blogs, 'blogs'))

const mostLikes = (blogs) => (mostAuthorAttribute(blogs, 'likes'))

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}