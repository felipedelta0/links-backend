const express = require('express')
const db = require('./models')

const AuthController = require('./controllers/Auth')

const app = express()

app.use('/auth', AuthController)

app.get('/', (req, res) => {
  return res.json('Api running...')
})

db.sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Listening on port 3000')
  })
})