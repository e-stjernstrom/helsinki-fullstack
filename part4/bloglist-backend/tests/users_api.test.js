const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const User = require('../models/user')

const api = supertest(app)


beforeEach(async () => {
  await User.deleteMany({}) // clear the test DB
})

test('POST a user with username length shorter than 3 should get a 400 response with an error message', async () => {
  const newUser = {
    username: "u",
    password: "password",
    name: "User"
  }
  
  await api
    .post('/api/users')
    .send(newUser)
    .expect(400, { error: 'the length of username and password must longer than 3 characters' })

  const usersAtEnd = await helper.usersInDb()

  assert.strictEqual(usersAtEnd.length, 0)
})

test('POST a user with password length shorter than 3 should get a 400 response with an error message', async () => {
  const newUser = {
    username: "user",
    password: "pw",
    name: "User"
  }
  
  await api
    .post('/api/users')
    .send(newUser)
    .expect(400, { error: 'the length of username and password must longer than 3 characters' })

  const usersAtEnd = await helper.usersInDb()

  assert.strictEqual(usersAtEnd.length, 0)
})

test('POST a valid user should be able to create a new user', async () => {
  const usersAtStart = await helper.usersInDb()
  const newUser = {
    username: "user",
    password: "password",
    name: "User"
  }
  
  await api
    .post('/api/users')
    .send(newUser)
    .expect(201)

  const usersAtEnd = await helper.usersInDb()
  assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
})


after(async () => {
  await mongoose.connection.close()
})