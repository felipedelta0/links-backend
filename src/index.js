const express = require('express')
const cors = require('cors')
const db = require('./models')
const response = require('./middlewares/Response')
const checkJwt = require('./middlewares/jwt')

const AuthController = require('./controllers/Auth')
const LinkController = require('./controllers/Link')

const app = express()

app.use(cors())
app.use(response)
app.use(checkJwt)

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/auth', AuthController)
app.use('/link', LinkController)

app.get('/', (req, res) => {
  return res.json('Api running...')
})

db.sequelize.sync().then(() => {
  app.listen(3001, () => {
    console.log('Listening on port 3001')
  })
})