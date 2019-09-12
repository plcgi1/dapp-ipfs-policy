const express = require('express')

const path = require('path')

const passport = require('passport')

const expressJoi = require('express-joi-validator')

const controller = require(path.resolve('./src/controllers/api/things/file.controller'))

const { create, update } = require(path.resolve('./src/controllers/api/things/file.schema'))

const { restrict4write } = require('../../../middleware/restrict4write')

const router = express.Router()

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  restrict4write,
  expressJoi(create),
  controller.create
)

router.get('/', passport.authenticate('jwt', { session: false }), controller.get)

module.exports = router
