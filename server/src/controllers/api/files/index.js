const express = require('express')

const path = require('path')

const passport = require('passport')

const expressJoi = require('express-joi-validator')

const controller = require(path.resolve('./src/controllers/api/files/file.controller'))

const { create } = require(path.resolve('./src/controllers/api/files/file.schema'))

const router = express.Router()

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  expressJoi(create),
  controller.create
)

router.get('/', controller.get)

module.exports = router
