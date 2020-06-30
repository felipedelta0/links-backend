const express = require('express')
const bcrypt = require('bcrypt')
const { Account } = require('../models')

const router = express.Router()

const saltRounds = 8

router.get('/signin', (req, res) => {
  return res.json('Sign in')
})

router.post('/signup', async (req, res) => {

  const { email, password } = req.body

  const account = await Account.findOne({ where: { email } })
  if (account)
    return res.jsonBadRequest(account, "Account already exists")

  const hash = bcrypt.hashSync(password, saltRounds)
  const newAccount = await Account.create({ email, password: hash })

  return res.jsonOK(newAccount, 'Account created')
})

module.exports = router