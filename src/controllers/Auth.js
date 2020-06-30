const express = require('express')
const bcrypt = require('bcrypt')
const { Account } = require('../models')
const { accountSignUp } = require('../validators/Account')
const { getMessage } = require('../helpers/Messages')

const router = express.Router()

const saltRounds = 8

router.get('/signin', (req, res) => {
  return res.jsonOK(null)
})

router.post('/signup', accountSignUp, async (req, res) => {

  const { email, password } = req.body

  const account = await Account.findOne({ where: { email } })
  if (account)
    return res.jsonBadRequest(account, getMessage('Account.signUp.email_exists'))

  const hash = bcrypt.hashSync(password, saltRounds)
  const newAccount = await Account.create({ email, password: hash })

  return res.jsonOK(newAccount, getMessage('Account.signUp.success'))
})

module.exports = router