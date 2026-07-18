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
      title: "Building Node.js Natively on RISC-V: A 15-Hour Journey from Fork to Release",
      author: "Bruno Verachten",
      url: "https://bruno.verachten.fr/2025/11/07/building-node.js-natively-on-risc-v-a-15-hour-journey-from-fork-to-release/",
      likes: 1
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

  test('if there is a POST without likes attribute, the default value should be 0', 
    async () => {
      const newBlog = {
        title: "Building Node.js Natively on RISC-V: A 15-Hour Journey from Fork to Release",
        author: "Bruno Verachten",
        url: "https://bruno.verachten.fr/2025/11/07/building-node.js-natively-on-risc-v-a-15-hour-journey-from-fork-to-release/"
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
      
      const blogsAtEnd = await helper.blogsInDb()
      const addedBlog = blogsAtEnd.find(blog => blog.title === newBlog.title)

      assert(addedBlog['likes'] === 0)
    }
  )

  test('POST a blog without the title attribute will get a 400 response', async () => {
    const newBlog = {
      author: "Bruno Verachten",
      url: "https://bruno.verachten.fr/2025/11/07/building-node.js-natively-on-risc-v-a-15-hour-journey-from-fork-to-release/"
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })

  test('POST a blog without the url attribute will get a 400 response', async () => {
    const newBlog = {
      title: "Building Node.js Natively on RISC-V: A 15-Hour Journey from Fork to Release",
      author: "Bruno Verachten"
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })

  test('DELETE a blog correspoding its id should remove the resource with response 204', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]
    assert(blogToDelete)

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    const ids = blogsAtEnd.map(n => n.id)
    assert(!ids.includes(blogToDelete.id))

    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
  })

  test('PUT a blog corresponding a specific id should only update its likes attribute', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    
    const newLikes = {
      likes: blogToUpdate.likes + 1,
      dummy: 'test',
      dummy2: 1
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(newLikes)

    const blogsAtEnd = await helper.blogsInDb()
    const blogUpdated = blogsAtEnd[0]


    assert.deepStrictEqual(blogUpdated, {...blogToUpdate, likes: blogToUpdate.likes + 1})
  })


})

after(async () => {
  await mongoose.connection.close()
})