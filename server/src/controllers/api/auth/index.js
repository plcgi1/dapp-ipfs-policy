const express = require('express')

const path = require('path')

// TODO may be auth better https://www.toptal.com/ethereum/one-click-login-flows-a-metamask-tutorial

// https://medium.com/coinmonks/expressjs-user-authentication-with-metamask-meta-auth-630b6da123ef
// const metaAuth = require('../../../middleware/meta-auth')

const authController = require(path.resolve('./src/controllers/api/auth/auth.controller'))

const router = express.Router()

router.post('/eth', authController.create)

module.exports = router
