const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({}) // empty the test DB
    await Blog.insertMany(helper.blogs)
  })

  test('GET response should be returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('initially, GET should return as many blogs as we saved', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.blogs.length)
  })

  test('the unique identifier for each blog should be id, not _id', async () => {
    const response = await api.get('/api/blogs')
    
    assert(response.body)
    const firstBlog = response.body[0]

    assert('id' in firstBlog)
    assert(!('_id' in firstBlog))
  })

  test('POST request should be able to create a new blog', async () => {
    const newBlog = {
      "title": "Building Node.js Natively on RISC-V",
      "author": "Bruno Verachten",
      "url": "https://bruno.verachten.fr/2025/11/07/building-node.js-natively-on-risc-v-a-15-hour-journey-from-fork-to-release/",
      "likes": 1
    }
    
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.blogs.length + 1)

    const titles = blogsAtEnd.map(blog => blog.title)
    assert(titles.includes(newBlog.title))
  })



})

after(async () => {
  await mongoose.connection.close()
})