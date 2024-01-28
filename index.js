const { ApolloServer, PubSub } = require('apollo-server')
const mongoose = require('mongoose')

const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers')
require('dotenv').config()

mongoose.Promise = global.Promise

const pubsub = new PubSub()

const port = process.env.PORT || 5000

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req, pubsub })
})

mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB Connected')
    return server.listen({ port: port })
  })
  .then(res => {
    console.log(`Server started at port ${res.url}`)
  })
