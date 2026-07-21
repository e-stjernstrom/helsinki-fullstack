bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  const { username, password, name } = request.body

  if (username.length < 3 || password.length < 3) {
    return response.status(400).json(
      { error: 'the length of username and password must longer than 3 characters' }
    ).end()
  }
  
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User ({
    username,
    passwordHash,
    name,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})

  response.json(users)
})

usersRouter.delete('/:id', async (request, response) => {
  const id = request.params.id
  const result = await User.findByIdAndDelete(id)
  response.status(204).end()
})

module.exports = usersRouter