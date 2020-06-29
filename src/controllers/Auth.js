const express = require('express')

const router = express.Router()

router.get('/signin', (req, res) => {
  return res.json('Sign in')
})

router.get('/signup', (req, res) => {
  return res.json('Sign up')
})

module.exports = router