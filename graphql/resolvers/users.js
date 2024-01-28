const User = require('../../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { validateRegisterInput, validateLoginInput } = require('../../util/validators')
const { UserInputError } = require('apollo-server')

const generateToken = user => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username
    },
    process.env.SECRET_KEY,
    { expiresIn: '1h' }
  )
}

module.exports = {
  Query: {
    getUsers: async () => {
      try {
        const users = await User.find()
        return users
      } catch (err) {
        throw new Error(err)
      }
    }
  },
  Mutation: {
    login: async (_, { username, password }) => {
      const { errors, valid } = validateLoginInput(username, password)

      if (!valid) {
        throw new UserInputError('Errors', { errors })
      }

      const user = await User.findOne({ username })

      if (!user) {
        errors.general = 'User not found'
        throw new UserInputError('User not found', { errors })
      }

      const match = await bcrypt.compare(password, user.password)
      if (!match) {
        errors.general = 'Wrong Credentials'
        throw new UserInputError('Wrong Credentials', { errors })
      }

      const token = generateToken(user)

      return {
        ...user._doc,
        id: user._id,
        token
      }
    },
    register: async (_, { registerInput: { username, email, password, confirmPassword } }) => {
      // TODO: Validate user data
      const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword)
      if (!valid) {
        throw new UserInputError('Errors', { errors })
      }
      // TODO: Make sure user doesn't already exist

      const user = await User.findOne({ username })
      if (user) {
        throw new UserInputError('Username is taken', {
          errors: {
            username: 'This username is taken'
          }
        })
      }

      password = await bcrypt.hash(password, 12)

      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString()
      })

      const res = await newUser.save()

      const token = generateToken(res)

      return {
        ...res._doc,
        id: res._id,
        token
      }
    }
  }
}
