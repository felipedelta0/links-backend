const express = require('express')
const db = require('./models')
const response = require('./middlewares/Response')

const AuthController = require('./controllers/Auth')
const LinkController = require('./controllers/Link')

const app = express()

app.use(response)

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/auth', AuthController)
app.use('/link', LinkController)

app.get('/', (req, res) => {
  return res.json('Api running...')
})

db.sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Listening on port 3000')
  })
})