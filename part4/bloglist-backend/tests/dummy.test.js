const { test,describe } = require('node:test')
const assert = require('node:assert')
const testHelper = require('./test_helper')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []
  
  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  test('when list has no blog, equals zero', () => {
    const result = listHelper.totalLikes(testHelper.listWithoutBlog)
    assert.strictEqual(result, 0)
  })

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(testHelper.listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test('when list has many blogs, returns the total sum of likes in all of the blog posts', () => {
    const result = listHelper.totalLikes(testHelper.blogs)
    assert.strictEqual(result, 36)
  })
})

describe('favorite blog', () => {
  test('when list has no blog, returns an empty list', () => {
    const result = listHelper.favoriteBlog(testHelper.listWithoutBlog)
    assert.deepStrictEqual(result, [])
  })

  test('when list has only one blog, returns the record with that author', () => {
    const result = listHelper.favoriteBlog(testHelper.listWithOneBlog)
    assert.deepStrictEqual(result, testHelper.listWithOneBlog[0])
  })

  test('when list has many blogs without tie, returns the blog with the most likes', () => {
    const result = listHelper.favoriteBlog(testHelper.blogs)

    const expected = {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0
    }

    assert.deepStrictEqual(result, expected)
  })
})

describe('author with most blogs', () => {
  test('when list has no blog, returns a dummy record', () => {
    const result = listHelper.mostBlogs(testHelper.listWithoutBlog)
    assert.deepStrictEqual(
      result, 
      {
        author: undefined,
        blogs: NaN
      }
    )
  })

  test('when list has only one blog, returns that author who has only one blog', () => {
    const result = listHelper.mostBlogs(testHelper.listWithOneBlog)
    assert.deepStrictEqual(
      result, 
      {
        author: 'Edsger W. Dijkstra',
        blogs: 1
      }
    )
  })

  test('when list has many blogs without tie, returns the author who has the largest amount of blogs', () => {
    const result = listHelper.mostBlogs(testHelper.blogs)

    assert.deepStrictEqual(
      result, 
      {
        author: "Robert C. Martin",
        blogs: 3
      }
    )
  })
})


describe('author with most likes', () => {
  test('when list has no blog, returns a dummy record', () => {
    const result = listHelper.mostLikes(testHelper.listWithoutBlog)
    assert.deepStrictEqual(
      result, 
      {
        author: undefined,
        likes: NaN
      }
    )
  })

  test('when list has only one blog, returns likes of that author', () => {
    const result = listHelper.mostLikes(testHelper.listWithOneBlog)
    assert.deepStrictEqual(
      result, 
      {
        author: 'Edsger W. Dijkstra',
        likes: 5
      }
    )
  })

  test('when list has many blogs without tie, returns the author who has the largest amount of likes', () => {
    const result = listHelper.mostLikes(testHelper.blogs)

    assert.deepStrictEqual(
      result, 
      {
        author: "Edsger W. Dijkstra",
        likes: 17
      }
    )
  })
})