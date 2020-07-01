const express = require('express')
const bcrypt = require('bcrypt')
const { Account } = require('../models')
const { accountSignUp, accountSignIn } = require('../validators/Account')
const { getMessage } = require('../helpers/Messages')
const { generateJwt, generateRefreshJwt, verifyRefreshJwt, getTokenFromHeaders } = require('../helpers/jwt')

const router = express.Router()

const saltRounds = 8

router.post('/signin', accountSignIn, async (req, res) => {
  const { email, password } = req.body

  const account = await Account.findOne({ where: { email } })
  const match = account ? bcrypt.compareSync(password, account.password) : null

  if (!match)
    return res.jsonBadRequest(account, getMessage('Account.signIn.invalid'))

  const token = generateJwt({ id: account.id })
  const refreshToken = generateRefreshJwt({ id: account.id, version: account.jwtVersion })

  return res.jsonOK(account, getMessage('Account.signIn.success'), { token, refreshToken })
})

router.post('/signup', accountSignUp, async (req, res) => {
  const { email, password } = req.body

  const account = await Account.findOne({ where: { email } })
  if (account)
    return res.jsonBadRequest(account, getMessage('Account.signUp.email_exists'))

  const hash = bcrypt.hashSync(password, saltRounds)
  const newAccount = await Account.create({ email, password: hash })

  const token = generateJwt({ id: newAccount.id })
  const refreshToken = generateRefreshJwt({ id: newAccount.id, version: newAccount.jwtVersion })

  return res.jsonOK(newAccount, getMessage('Account.signUp.success'), { token, refreshToken })
})

router.post('/refresh', async (req, res) => {
  const token = getTokenFromHeaders(req.headers)
  if (!token)
    return res.jsonUnauthorized(null, 'Invalid token')

  try {
    const decoded = verifyRefreshJwt(token)
    const account = await Account.findByPk(decoded.id)
    if (!account)
      return res.jsonUnauthorized(null, 'Invalid token')
    
    if (decoded.version !== account.jwtVersion) {
      return res.jsonUnauthorized(null, 'Invalid token')
    }

    const meta = {
      token: generateJwt({ id: account.id })
    }

    return res.jsonOK(null, null, meta)
  } catch {
    return res.jsonUnauthorized(null, 'Invalid token')
  }
})

module.exports = router